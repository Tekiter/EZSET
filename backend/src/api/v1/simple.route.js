import { Router } from 'express'
import { body, param } from 'express-validator'
import Board from '../../models/Board'
import Post from '../../models/Post'
import { validateParams, asyncRoute } from '../../utils/api'
import { perm } from '../../utils/role'
const router = Router()

//게시판 생성
router.post(
    '/boards',
    [perm('board').can('create'), body('title').isString(), validateParams],
    asyncRoute(async (req, res) => {
        let board = new Board()
        board.title = req.body.title

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

        await board.remove()
        // await Board.remove({ _id: req.params.board_id })
        res.end()
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
            const post = new Post({
                board: boardId,
                title: req.body.title,
                content: req.body.content,
                author: req.user.username,
                created_date: Date.now(),
            })

            let newpost = await post.save()

            res.status(201).json(newpost)
        } catch (err) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//게시글 삭제
router.delete(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        if (!req.user.perm('board', req.params.board_id).canOwn('delete')) {
        }

        try {
            let post = await Post.findById(req.params.post_id)
            if (post) {
                if (post.owner != req.user.username) {
                }

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
router.put(
    '/posts/:post_id',
    [param('post_id').isNumeric(), body('content').isString(), validateParams],
    asyncRoute(async function(req, res) {
        let post = await Post.findById(req.params.post_id)

        try {
            if (post) {
                if (req.body.content) {
                    post.title = req.body.title
                    post.content = req.body.content
                    post.created_date = req.body.created_date
                }
                await post.save()

                res.status(200).json({
                    message: '수정 완료',
                    target: post,
                })
            } else {
                res.status(404).json({
                    message: 'no post id' + req.params.post_id,
                })
            }
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//게시글 보기
router.get(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    function(req, res) {
        Post.findOne()
            .where('_id')
            .equals(req.params.post_id)
            .then(post => {
                if (post)
                    res.status(200).json({
                        _id: parseInt(post.id),
                        title: post.title,
                        content: post.content,
                        author: post.author,
                        created_date: post.created_date,
                        view: post.view,
                        like: post.likes_count,
                        comment: post.comments,
                    })
                else
                    res.status(404).json({
                        message: 'no post id ' + req.params.post_id,
                    })
            })
    }
)

//게시글 목록 보기
router.get(
    '/boards/:board_id',
    [param('board_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        let boardId = parseInt(req.params.board_id)

        try {
            let board = await Board.findOne({ _id: boardId })
            if (!board) {
                res.status(404).json({ message: 'no board id ' + boardId })
                return
            }

            let posts = await Post.find()
                .where('board')
                .equals(boardId)
                .sort('-_id')
            res.status(200).json({
                board: board,
                posts: posts.map(post => {
                    return {
                        _id: parseInt(post.id),
                        title: post.title,
                        content: post.content,
                        author: post.author,
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

            await post.addComment(req.body.content, req.user.username)
            res.status(201).json({ message: '댓글 작성 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//댓글 수정
router.put(
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
            await post.updateComment(req.params.comment_id, req.body.content)
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

            await post.removeComment(req.params.comment_id)
            res.status(200).json({ message: '삭제 성공' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

export default router
