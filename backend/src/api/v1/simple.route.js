import { Router } from 'express'
import { body, param, query } from 'express-validator'
import Board from '../../models/Board'
import Post from '../../models/Post'
import { validateParams, asyncRoute, isPositive } from '../../utils/api'
import { perm } from '../../utils/role'
import {
    checkAttachableFileArray,
    applyFileLink,
    getFileInfoArray,
    removeFileLink,
    deleteUnlinkedFile,
    checkIsFileOwner,
    checkUnlinkedFile,
    getFileLinks,
} from '../../utils/file'
const router = Router()
const crypto = require('crypto')
const viewObj = new Object()

//게시판 생성
router.post(
    '/boards',
    [perm('board').can('create'), body('title').isString(), validateParams],
    asyncRoute(async (req, res) => {
        let board = new Board()
        board.title = req.body.title
        board.isAnonymous = req.body.isAnonymous
        await board.save()
        res.status(201).end()
    })
)

//게시판 삭제
router.delete(
    '/boards/:board_id',
    [param('board_id').isNumeric(), validateParams],
    asyncRoute(async (req, res) => {
        if (!req.user.perm('board', req.params.board_id).can('delete')) {
            res.status(403).end()
            return
        }

        const board = await Board.findOne()
            .where('_id')
            .equals(req.params.board_id)

        if (!board) {
            const err = new Error('존재하지 않는 게시판입니다.')
            err.status = 404
            throw err
        }

        try {
            const posts = await Post.find()
                .where('board')
                .equals(req.params.board_id)

            for (let i = 0; i < posts.length; i++) {
                await removeFileLink(posts[i].files)
                await deleteUnlinkedFile(posts[i].files)
            }

            for (let j = 0; j < posts.length; j++) {
                await posts[j].remove()
            }

            await board.remove()
            // await Board.remove({ _id: req.params.board_id })
            res.end()
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//게시판 목록 보기
router.get(
    '/boards',
    asyncRoute(async (req, res) => {
        const boards = await Board.find()
        res.json(
            boards.map(board => {
                return {
                    _id: board._id,
                    title: board.title,
                }
            })
        )
    })
)

//게시글 작성
router.post(
    '/boards/:board_id',
    [
        param('board_id').isNumeric(),
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        if (!req.user.perm('board', req.params.board_id).can('create')) {
            res.status(403).end()
            return
        }
        const boardId = parseInt(req.params.board_id)

        try {
            let board = await Board.findOne({ _id: boardId })
            if (!board) {
                res.status(404).json({ message: 'no board id ' + boardId })
                return
            }
            if (
                !checkIsFileOwner(req.body.files) ||
                !checkUnlinkedFile(req.body.files)
            ) {
                const err = new Error('올바르지 않은 첨부파일입니다.')
                err.status = 400
                throw err
            }
            let post
            if (board.isAnonymous == false) {
                post = new Post({
                    board: boardId,
                    title: req.body.title,
                    content: req.body.content,
                    author: req.user.username,
                    isAnonymous: false,
                    created_date: Date.now(),
                })
            } else {
                post = new Post({
                    board: boardId,
                    title: req.body.title,
                    content: req.body.content,
                    author: crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64'),
                    isAnonymous: true,
                    created_date: Date.now(),
                })
            }

            let newpost = await post.save()

            // DB 파일 객체에 역참조 등록
            await applyFileLink(req.body.files, 'boardPost', newpost.id)
            newpost.files = req.body.files

            await newpost.save()

            res.status(201).json(newpost)
        } catch (err) {
            throw err
        }
    })
)

//게시글 삭제
router.delete(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        if (!req.user.perm('board', req.params.board_id).canOwn('delete')) {
            res.status(403).end()
            return
        }

        try {
            let post = await Post.findById(req.params.post_id)
            if (post) {
                if (post.isAnonymous == false) {
                    if (post.author != req.user.username) {
                        res.status(403).end()
                        return
                    }
                } else {
                    if (
                        post.author !=
                        crypto
                            .createHash('sha512')
                            .update(req.user.username)
                            .digest('base64')
                    ) {
                        res.status(403).end()
                        return
                    }
                }

                await removeFileLink(post.files)
                await deleteUnlinkedFile(post.files)

                await post.delete()
                res.status(200).json({ message: 'post deleted', target: post })
            } else {
                res.status(404).json({
                    message: 'no post id ' + req.params.post_id,
                })
            }
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//게시글 수정
router.patch(
    '/posts/:post_id',
    [
        param('post_id').isNumeric(),
        body('title').isString(),
        body('content').isString(),
        body('files').custom(checkAttachableFileArray),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        if (!req.user.perm('board', req.params.board_id).canOwn('update')) {
            res.status(403).end()
            return
        }
        let post = await Post.findById(req.params.post_id)

        if (post) {
            if (post.isAnonymous == false) {
                if (post.author != req.user.username) {
                    res.status(403).end()
                    return
                }
            } else {
                if (
                    post.author !=
                    crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64')
                ) {
                    res.status(403).end()
                    return
                }
            }

            // 첨부할 파일들이 본인이 업로드한 파일들인지 체크
            if (!checkIsFileOwner(req.body.files)) {
                const err = new Error('올바르지 않은 첨부파일입니다.')
                err.status = 400
                throw err
            }
            // 이미 첨부된 파일을 첨부하는지 검사
            const links = await getFileLinks(req.body.files)
            for (let link of links) {
                if (link.target !== 'boardPost' || link.ref !== post.id) {
                    const err = new Error('올바르지 않은 첨부파일입니다.')
                    err.status = 400
                    throw err
                }
            }

            if (req.body.content) {
                post.title = req.body.title
                post.content = req.body.content
            }
            const newpost = await post.save()
            const prevFiles = newpost.files

            // 기존 파일들의 역참조 삭제
            await removeFileLink(prevFiles)

            // 새로운 파일들의 역참조 등록
            await applyFileLink(req.body.files, 'boardPost', newpost.id)
            newpost.files = req.body.files

            await newpost.save()

            // 기존에는 첨부되었지만, 수정시 제거된 파일들의 처리
            await deleteUnlinkedFile(prevFiles)

            res.status(200).json({
                message: '수정 완료',
                target: post,
            })
        } else {
            res.status(404).json({
                message: 'no post id' + req.params.post_id,
            })
        }
    })
)

//게시글 보기
router.get(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        const post = await Post.findOne()
            .where('_id')
            .equals(req.params.post_id)
        if (post) {
            //조회수 증가 viewObj 오브젝트 만들어서 post_id : [username] 형식으로 저장
            if (!viewObj[req.params.post_id]) {
                viewObj[req.params.post_id] = []
            }
            if (viewObj[req.params.post_id].indexOf(req.user.username) == -1) {
                //username이 없다면 배열에 추가하고 조회수 증가
                viewObj[req.params.post_id].push(req.user.username)
                post.view++
                setTimeout(() => {
                    //10분이 지나면 배열에서 삭제해서 다시 조회수가 증가할 수 있게 만듦
                    viewObj[req.params.post_id].splice(
                        viewObj[req.params.post_id].indexOf(req.user.username),
                        1
                    )
                }, 600000)
                for (let i in viewObj) {
                    //username이 하나도 없으면 해당 오브젝트 삭제
                    if (i.length == 0) {
                        delete viewObj.i
                    }
                }
            }

            await post.save()
            res.status(200).json({
                _id: parseInt(post.id),
                title: post.title,
                content: post.content,
                author: post.author,
                isAnonymous: post.isAnonymous,
                created_date: post.created_date,
                view: post.view,
                like: post.likes_count,
                isLike: post.likes_flag(req.user.username),
                comment: post.comments,
                files: await getFileInfoArray(post.files),
            })
        } else {
            res.status(404).json({
                message: 'no post id ' + req.params.post_id,
            })
        }
    })
)

//게시글 목록 보기
router.get(
    '/boards/:board_id',
    [
        param('board_id').isNumeric(),
        query('page').custom(isPositive),
        query('pagesize').custom(isPositive),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        let boardId = parseInt(req.params.board_id)

        try {
            let board = await Board.findOne({ _id: boardId })
            if (!board) {
                res.status(404).json({ message: 'no board id ' + boardId })
                return
            }

            const page = parseInt(req.query.page)
            const pagesize = parseInt(req.query.pagesize || 8)

            let postcount = await Post.find()
                .count()
                .where('board')
                .equals(boardId)

            let posts = await Post.find()
                .where('board')
                .equals(boardId)
                .limit(pagesize)
                .skip((page - 1) * pagesize)
                .sort('-_id')
            res.status(200).json({
                board: board,
                totalpage: postcount,
                posts: posts.map(post => {
                    return {
                        _id: parseInt(post.id),
                        title: post.title,
                        content: post.content,
                        author: post.author,
                        isAnonymous: post.isAnonymous,
                        created_date: post.created_date,
                        view: post.view,
                        like: post.likes_count,
                        comment: post.comments,
                    }
                }),
            })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//댓글 작성
router.post(
    '/posts/:post_id/comment',
    [param('post_id').isNumeric(), body('content').isString(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            let postId = parseInt(req.params.post_id)
            let post = await Post.findOne({ _id: postId })
            if (!post) {
                res.status(404).json({ message: 'no post id ' + postId })
                return
            }
            if (post.isAnonymous == true) {
                await post.addComment(
                    req.body.content,
                    crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64')
                )
            } else {
                await post.addComment(req.body.content, req.user.username)
            }
            res.status(201).json({ message: '댓글 작성 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//댓글 수정
router.patch(
    '/posts/:post_id/comment/:comment_id',
    [param('post_id').isNumeric(), body('content').isString(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            let post = await Post.findOne()
                .where('_id')
                .equals(req.params.post_id)

            if (!post) {
                res.status(404).json({
                    message: 'no post id ' + req.params.comment_id,
                })
                return
            }
            if (post.isAnonymous == false) {
                if (post.author != req.user.username) {
                    res.status(403).end()
                    return
                }
            } else {
                if (
                    post.author !=
                    crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64')
                ) {
                    res.status(403).end()
                    return
                }
            }

            if (post.isAnonymous == true) {
                await post.updateComment(
                    req.body.content,
                    crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64')
                )
            } else {
                await post.updateComment(
                    req.params.comment_id,
                    req.body.content
                )
            }

            res.status(201).json({ message: '댓글 수정 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//댓글 삭제
router.delete(
    '/posts/:post_id/comment/:comment_id',
    [
        param('post_id').isNumeric(),
        param('comment_id').isNumeric(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        try {
            let post = await Post.findOne()
                .where('_id')
                .equals(req.params.post_id)

            if (!post) {
                res.status(404).json({
                    message: 'no post id ' + req.params.comment_id,
                })
                return
            }
            if (post.isAnonymous == false) {
                if (post.author != req.user.username) {
                    res.status(403).end()
                    return
                }
            } else {
                if (
                    post.author !=
                    crypto
                        .createHash('sha512')
                        .update(req.user.username)
                        .digest('base64')
                ) {
                    res.status(403).end()
                    return
                }
            }
            await post.removeComment(req.params.comment_id)
            res.status(200).json({ message: '삭제 성공' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//좋아요 생성
router.post(
    '/posts/:post_id/like',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            let postId = parseInt(req.params.post_id)
            let post = await Post.findOne({ _id: postId })
            if (!post) {
                res.status(404).json({ message: 'no post id ' + postId })
                return
            }
            await post.likes_create(req.user.username)
            res.status(201).json({ message: '좋아요 생성 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//좋아요 삭제
router.delete(
    '/posts/:post_id/like',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            let postId = parseInt(req.params.post_id)
            let post = await Post.findOne({ _id: postId })
            if (!post) {
                res.status(404).json({ message: 'no post id ' + postId })
                return
            }
            await post.likes_delete(req.user.username)
            res.status(201).json({ message: '좋아요 삭제 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//게시물 검색
router.get(
    '/searchpost',
    [query('content'), query('option'), validateParams],
    asyncRoute(async function(req, res) {
        let options = []
        if (req.query.option == 'title') {
            options = [{ title: new RegExp(req.query.content) }]
        } else if (req.query.option == 'content') {
            options = [{ content: new RegExp(req.query.content) }]
        } else if (req.query.option == 'title+content') {
            options = [
                { title: new RegExp(req.query.content) },
                { content: new RegExp(req.query.content) },
            ]
        } else {
            const err = new Error('검색 옵션이 없습니다.')
            err.status = 400
            throw err
        }
        try {
            const posts = await Post.find({ $or: options })

            res.status(200).json({
                posts: posts.map(post => {
                    return {
                        board: post.board,
                        _id: parseInt(post.id),
                        title: post.title,
                        content: post.content,
                        author: post.author,
                        isAnonymous: post.isAnonymous,
                        created_date: post.created_date,
                        view: post.view,
                        like: post.likes_count,
                        comment: post.comments,
                    }
                }),
            })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

export default router
