import { Router } from 'express'
const Board = require('../../models/Board')
const Post = require('../../models/Post')
const router = Router()

//post board
router.post('/boards', function(req, res) {
    let board = new Board()
    board.title = req.body.title

    board.save(function(err) {
        if (err) {
            //console.error(err)
            res.status(503).json({ error })
            return
        }
        res.status(201).json({ board })
    })
})

//delete board
router.delete('/boards/:board_id', function(req, res) {
    Board.remove({ _id: req.params.board_id }, function(err, output) {
        if (err) {
            return res.status(500).json({ error: 'database failure' })
        }
        res.status(204).end()
    })
})

//get all board
router.get('/boards', function(req, res) {
    Board.find(function(err, board) {
        if (err) {
            return res.status(500).send({ err: 'database failure' })
        }
        res.json(board)
    })
})

//post post
router.post('/boards/:board_id', function(req, res) {
    const boardId = parseInt(req.params.board_id)
    Board.findOne()
        .where('_id')
        .equals(boardId)
        .then(board => {
            const post = new Post({
                board: boardId,
                title: req.body.title,
                content: req.body.content,
                author: req.body.author,
            })
            post.save()
                .then(newpost => {
                    res.status(201).json(newpost)
                })
                .catch(() => res.json({ error }))
        })
        .catch(err => {
            //console.log(err)
            res.status(404).json({ message: 'no board id ' + boardId })
        })
})

//delete post
router.delete('/posts/:post_id', function(req, res) {
    Post.findById(req.params.post_id)
        .then(post => {
            if (post) {
                post.delete()
                    .then(() => {
                        res.status(200).json({
                            message: 'post deleted',
                            target: post,
                        })
                    })
                    .catch(() => res.json({ error }))
            } else {
                res.status(404).json({
                    message: 'no post id ' + req.params.post_id,
                })
            }
        })
        .catch(() => res.json({ error }))
})

//edit post
router.put('/posts/:post_id', function(req, res) {
    Post.findById(req.params.post_id).then(post => {
        if (post) {
        }
    })
})

//get one post
router.get('/posts/:post_id', function(req, res) {
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
})

//get all post (get one board)
router.get('/boards/:board_id', function(req, res) {
    let boardId = parseInt(req.params.board_id)
    Board.findOne({ _id: boardId })
        .then(board => {
            if (!board) {
                res.status(404).json({ message: 'no board id ' + boardId })
                return
            }
            Post.find()
                .where('board')
                .equals(boardId)
                .then(posts => {
                    res.status(200).json({
                        board: board,
                        posts: posts,
                    })
                })
                .catch(() => res.json({ error: error }))
        })
        .catch(() => res.json({ error: error }))
})

export default router
