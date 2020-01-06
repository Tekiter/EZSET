import { Router } from 'express'
import { body, param } from 'express-validator'
import Board from '../../models/Board'
import Post from '../../models/Post'
import { validateParams, asyncRoute } from '../../utils/api'
const router = Router()

//post board
router.post('/boards', [body('title').isString(), validateParams], function(
    req,
    res
) {
    if (!req.user.perm('board').can('create')) {
        res.status(403).end()
        return
    }
    let board = new Board()
    board.title = req.body.title

    board.save(function(err) {
        if (err) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
        res.status(201).json({ board })
    })
})

//delete board
router.delete(
    '/boards/:board_id',
    [param('board_id').isNumeric(), validateParams],
    function(req, res) {
        if (!req.user.perm('board', req.params.board_id).can('delete')) {
            res.status(403).end()
            return
        }
        Board.remove({ _id: req.params.board_id }, function(err, output) {
            if (err) {
                const errr = new Error('database error')
                errr.status = 500
                throw errr
            }
            res.status(204).end()
        })
    }
)

//get all board
router.get('/boards', function(req, res) {
    Board.find(function(err, board) {
        if (err) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
        res.json(board)
    })
})

//post post
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
            let board = await Board.findOne()
                .where('_id')
                .equals(boardId)

            const post = new Post({
                board: boardId,
                title: req.body.title,
                content: req.body.content,
                author: req.user.username,
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

//delete post
router.delete(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    asyncRoute(async function(req, res) {
        if (!req.perm('board', req.params.board_id).canOwn('delete')) {
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

//edit post
router.put(
    '/posts/:post_id',
    [param('post_id').isNumeric(), body('content').isString(), validateParams],
    asyncRoute(async function(req, res) {
        let post = await Post.findById(req.params.post_id)

        try {
            if (post) {
                if (req.body.content) {
                    post.content = req.body.content
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

//get one post
router.get(
    '/posts/:post_id',
    [param('post_id').isNumeric(), validateParams],
    function(req, res) {
        Post.findOne()
            .where('_id')
            .equals(req.params.post_id)
            .then(post => {
                if (post) res.status(200).json(post)
                else
                    res.status(404).json({
                        message: 'no post id ' + req.params.post_id,
                    })
            })
    }
)

//get all post (get one board)
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
            res.status(200).json({
                board: board,
                posts: posts,
            })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//post comment
router.post(
    '/posts/:post_id/comment',
    [param('post_id').isNumeric(), body('comment').isString(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            let post = await findOne()
                .where('_id')
                .equals(req.params.post_id)

            if (!post) {
                res.status(404).json({
                    message: 'no post id' + req.params.post_id,
                })
                return
            }

            await post.addComment(req.body.content, req.body.user)
            res.status(201).json({ message: '댓글 작성 완료' })
        } catch (error) {
            const errr = new Error('database error')
            errr.status = 500
            throw errr
        }
    })
)

//delete comment
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
