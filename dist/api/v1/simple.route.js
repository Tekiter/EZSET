'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _expressValidator = require('express-validator');

var _Board = require('../../models/Board');

var _Board2 = _interopRequireDefault(_Board);

var _Post = require('../../models/Post');

var _Post2 = _interopRequireDefault(_Post);

var _api = require('../../utils/api');

var _role = require('../../utils/role');

var _file = require('../../utils/file');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
const crypto = require('crypto');
const viewObj = new Object();

/**
 * @api {post} /simple/boards/ 게시판 생성
 * @apiDescription 새로운 게시판을 생성한다
 * @apiName 게시판 생성
 * @apiGroup Board
 * @apiPermission can.create
 *
 * @apiParam {String} title 게시판 이름
 * @apiParam {Boolean} isAnonymous 익명게시판 판단
 *
 * @apiSuccess {Number} 201 게시판 생성 성공
 *
 * @apiError {Number} 500 게시판 생성 에러
 */
router.post('/boards', [(0, _role.perm)('manageBoards').can('access'), (0, _expressValidator.body)('title').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    let board = new _Board2.default();
    board.title = req.body.title;
    board.isAnonymous = req.body.isAnonymous;

    try {
        await board.save();
        res.status(201).end();
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

/**
 * @api {delete} /simple/boards/:board_id 게시판 삭제
 * @apiDescription 게시판을 삭제한다
 * @apiName 게시판 삭제
 * @apiGroup Board
 * @apiPermission can.delete
 * @apiParam {Number} board_id 게시판 아이디
 *
 * @apiSuccess {json} 200 게시판 삭제
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200
 *       {
 *          message: '게시판을 삭제했습니다',
 *        }
 *
 * @apiError {json} 404 해당 게시판 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: '존재하지 않는 게시판입니다.',
 *        }
 *
 * @apiError {Number} 500 게시판 삭제 에러
 */
//게시판 수정
router.patch('/boards/:board_id', [(0, _role.perm)('manageBoards').can('access'), (0, _expressValidator.param)('board_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const board = await _Board2.default.findOne().where('_id').equals(req.params.board_id);

    if (!board) {
        const err = new Error('존재하지 않는 게시판입니다.');
        err.status = 404;
        throw err;
    }
    try {
        board.title = req.body.title;
        await board.save();
        res.status(200).json({
            message: '수정 완료'
        });
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

//게시판 삭제
router.delete('/boards/:board_id', [(0, _role.perm)('manageBoards').can('access'), (0, _expressValidator.param)('board_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const board = await _Board2.default.findOne().where('_id').equals(req.params.board_id);

    if (!board) {
        res.status(404).json({
            message: '존재하지 않는 게시판입니다.'
        });
        return;
    }

    try {
        const posts = await _Post2.default.find().where('board').equals(req.params.board_id);

        for (let i = 0; i < posts.length; i++) {
            await (0, _file.removeFileLink)(posts[i].files);
            await (0, _file.deleteUnlinkedFile)(posts[i].files);
        }

        for (let j = 0; j < posts.length; j++) {
            await posts[j].remove();
        }

        await board.remove();
        // await Board.remove({ _id: req.params.board_id })
        res.status(200).json({
            message: '게시판을 삭제했습니다'
        });
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

/**
 * @api {get} /simple/boards/ 게시판 목록
 * @apiDescription 게시판 목록을 불러온다
 * @apiName 게시판 목록
 * @apiGroup Board
 *
 * @apiSuccess {json} 200 게시판 목록
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200
 *      {
 *          "_id": 10,
 *          "title": "test"
 *      },
 *      {
 *          "_id": 11,
 *          "title": "익명게시판"
 *      }
 *
 * @apiError {json} 404 해당 게시판 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: '존재하지 않는 게시판입니다.',
 *        }
 */
router.get('/boards', (0, _api.asyncRoute)(async (req, res) => {
    const boards = await _Board2.default.find();
    res.json(boards.map(board => {
        return {
            _id: board._id,
            title: board.title,
            isAnonymous: board.isAnonymous
        };
    }));
}));

/**
 * @api {post} /simple/boards/:board_id 게시글 생성
 * @apiDescription 게시글을 첨부파일과 같이 작성한다
 * @apiName 게시글 생성
 * @apiGroup Board
 * @apiPermission can.create
 *
 * @apiParam {Number} board_id 게시판 아이디
 * @apiParam {String} title 게시글 제목
 * @apiParam {String} content 게시글 내용
 * @apiParam {String} files 게시글 첨부파일
 *
 * @apiSuccess {json} 201 게시글 작성
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 201 OK
 *       {
 *           "isAnonymous": false,
 *           "view": 0,
 *           "like":[],
 *           "isLike": false,
 *           "files":["5e65db86b869b0322cbc1bda"],
 *           "board": 10,
 *           "title": "hello",
 *           "content": "hhhhh",
 *           "author": "admin",
 *           "created_date": "2020-03-09T06:01:45.804Z",
 *           "comments":[],
 *           "_id": 101,
 *           "__v": 1
 *       }
 * @apiError {Number} 403 권한 없음
 *
 * @apiError {json} 404 해당 게시판 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: no board id 10,
 *       }
 *
 * @apiError {Number} 400 첨부파일 오류
 * @apiErrorExample {String} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          string: 올바르지 않은 첨부파일입니다.
 *       }
 */
router.post('/boards/:board_id', [(0, _expressValidator.param)('board_id').isNumeric(), (0, _expressValidator.body)('title').isString(), (0, _expressValidator.body)('content').isString(), (0, _expressValidator.body)('files').custom(_file.checkAttachableFileArray), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    if (!req.user.perm('board', req.params.board_id).can('write')) {
        res.status(403).end();
        return;
    }
    const boardId = parseInt(req.params.board_id);

    try {
        let board = await _Board2.default.findOne({ _id: boardId });
        if (!board) {
            res.status(404).json({ message: 'no board id ' + boardId });
            return;
        }
        if (!(0, _file.checkIsFileOwner)(req.body.files) || !(0, _file.checkUnlinkedFile)(req.body.files)) {
            const err = new Error('올바르지 않은 첨부파일입니다.');
            err.status = 400;
            throw err;
        }
        let post;
        if (board.isAnonymous == false) {
            post = new _Post2.default({
                board: boardId,
                title: req.body.title,
                content: req.body.content,
                author: req.user.username,
                isAnonymous: false,
                created_date: Date.now()
            });
        } else {
            post = new _Post2.default({
                board: boardId,
                title: req.body.title,
                content: req.body.content,
                author: crypto.createHash('sha512').update(req.user.username).digest('base64'),
                isAnonymous: true,
                created_date: Date.now()
            });
        }

        let newpost = await post.save();

        // DB 파일 객체에 역참조 등록
        await (0, _file.applyFileLink)(req.body.files, 'boardPost', newpost.id);
        newpost.files = req.body.files;

        await newpost.save();

        res.status(201).json(newpost);
    } catch (err) {
        throw err;
    }
}));

/**
 * @api {delete} /simple/posts/:post_id 게시글 삭제
 * @apiDescription 게시글을 삭제한다
 * @apiName 게시글 삭제
 * @apiGroup Board
 * @apiPermission can.delete
 *
 * @apiParam {Number} post_id 게시판 아이디
 *
 * @apiSuccess {json} 200 게시글 삭제
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       message": "post deleted",
 *          "target":{
 *          "isAnonymous": false,
 *          "view": 0,
 *          "like":[],
 *          "isLike": false,
 *          "files":["5e65db86b869b0322cbc1bda"],
 *          "_id": 101,
 *          "board": 10,
 *          "title": "hello",
 *          "content": "hhhhh",
 *          "author": "admin",
 *          "created_date": "2020-03-09T06:01:45.804Z",
 *          "comments":[],
 *          "__v": 1
 *          }
 *
 * @apiError {Number} 403 권한 없음
 *
 * @apiError {json} 404 해당 게시판 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: no board id 10,
 *       }
 *
 * @apiError {Number} 500 삭제 오류
 * @apiErrorExample {String} Error-Response:
 *       HTTP/1.1 500
 *       {
 *          string: database error
 *       }
 */
router.delete('/posts/:post_id', [(0, _expressValidator.param)('post_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    // if (!req.user.perm('board', req.params.board_id).canOwn('delete')) {
    //     res.status(403).end()
    //     return
    // }

    try {
        let post = await _Post2.default.findById(req.params.post_id);
        if (post) {
            if (post.isAnonymous == false) {
                if (post.author != req.user.username && !req.user.perm('board', req.params.board_id).can('delete')) {
                    res.status(403).end();
                    return;
                }
            } else {
                if (post.author != crypto.createHash('sha512').update(req.user.username).digest('base64') && !req.user.perm('board', req.params.board_id).can('delete')) {
                    res.status(403).end();
                    return;
                }
            }

            await (0, _file.removeFileLink)(post.files);
            await (0, _file.deleteUnlinkedFile)(post.files);

            await post.delete();
            res.status(200).json({ message: 'post deleted', target: post });
        } else {
            res.status(404).json({
                message: 'no post id ' + req.params.post_id
            });
        }
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

/**
 * @api {patch} /simple/posts/:post_id 게시글 수정
 * @apiDescription 게시글을 수정한다
 * @apiName 게시글 수정
 * @apiGroup Board
 * @apiPermission can.update
 *
 * @apiParam {Number} board_id 게시판 아이디
 * @apiParam {String} title 게시글 제목
 * @apiParam {String} content 게시글 내용
 * @apiParam {String} files 게시글 첨부파일
 *
 * @apiSuccess {json} 200 게시글 수정
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       message": '수정 완료',
 *          "target":{
 *          "isAnonymous": false,
 *          "view": 0,
 *          "like":[],
 *          "isLike": false,
 *          "files":["5e65db86b869b0322cbc1bda"],
 *          "_id": 101,
 *          "board": 10,
 *          "title": "hello",
 *          "content": "hhhhh",
 *          "author": "admin",
 *          "created_date": "2020-03-09T06:01:45.804Z",
 *          "comments":[],
 *          "__v": 1
 *          }
 *
 * @apiError {Number} 403 권한 없음
 *
 * @apiError {json} 404 해당 게시판 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404
 *       {
 *          message: no board id 10,
 *       }
 */
router.patch('/posts/:post_id', [(0, _expressValidator.param)('post_id').isNumeric(), (0, _expressValidator.body)('title').isString(), (0, _expressValidator.body)('content').isString(), (0, _expressValidator.body)('files').custom(_file.checkAttachableFileArray), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    // if (!req.user.perm('board', req.params.board_id).canOwn('update')) {
    //     res.status(403).end()
    //     return
    // }
    let post = await _Post2.default.findById(req.params.post_id);

    if (post) {
        if (post.isAnonymous == false) {
            if (post.author != req.user.username) {
                res.status(403).end();
                return;
            }
        } else {
            if (post.author != crypto.createHash('sha512').update(req.user.username).digest('base64')) {
                res.status(403).end();
                return;
            }
        }

        // 첨부할 파일들이 본인이 업로드한 파일들인지 체크
        if (!(0, _file.checkIsFileOwner)(req.body.files)) {
            const err = new Error('올바르지 않은 첨부파일입니다.');
            err.status = 400;
            throw err;
        }
        // 이미 첨부된 파일을 첨부하는지 검사
        const links = await (0, _file.getFileLinks)(req.body.files);
        for (let link of links) {
            if (link.target !== 'boardPost' || link.ref !== post.id) {
                const err = new Error('올바르지 않은 첨부파일입니다.');
                err.status = 400;
                throw err;
            }
        }

        if (req.body.content) {
            post.title = req.body.title;
            post.content = req.body.content;
        }
        const newpost = await post.save();
        const prevFiles = newpost.files;

        // 기존 파일들의 역참조 삭제
        await (0, _file.removeFileLink)(prevFiles);

        // 새로운 파일들의 역참조 등록
        await (0, _file.applyFileLink)(req.body.files, 'boardPost', newpost.id);
        newpost.files = req.body.files;

        await newpost.save();

        // 기존에는 첨부되었지만, 수정시 제거된 파일들의 처리
        await (0, _file.deleteUnlinkedFile)(prevFiles);

        res.status(200).json({
            message: '수정 완료',
            target: post
        });
    } else {
        res.status(404).json({
            message: 'no post id' + req.params.post_id
        });
    }
}));

/**
 * @api {get} /simple/posts/:post_id 게시글 목록 보기
 * @apiDescription 해당 게시판의 게시글 목록을 불러온다
 * @apiName 게시글 목록 보기
 * @apiGroup Board
 *
 * @apiParam {Number} post_id 게시판 아이디
 */
router.get('/posts/:post_id', [(0, _expressValidator.param)('post_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    const post = await _Post2.default.findOne().where('_id').equals(req.params.post_id);

    if (!req.user.perm('board', post.board).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }

    if (post) {
        //조회수 증가 viewObj 오브젝트 만들어서 post_id : [username] 형식으로 저장
        if (!viewObj[req.params.post_id]) {
            viewObj[req.params.post_id] = [];
        }
        if (viewObj[req.params.post_id].indexOf(req.user.username) == -1) {
            //username이 없다면 배열에 추가하고 조회수 증가
            viewObj[req.params.post_id].push(req.user.username);
            post.view++;
            setTimeout(() => {
                //10분이 지나면 배열에서 삭제해서 다시 조회수가 증가할 수 있게 만듦
                viewObj[req.params.post_id].splice(viewObj[req.params.post_id].indexOf(req.user.username), 1);
            }, 600000);
            for (let i in viewObj) {
                //username이 하나도 없으면 해당 오브젝트 삭제
                if (i.length == 0) {
                    delete viewObj.i;
                }
            }
        }

        await post.save();
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
            files: await (0, _file.getFileInfoArray)(post.files)
        });
    } else {
        res.status(404).json({
            message: 'no post id ' + req.params.post_id
        });
    }
}));

//게시글 목록 보기
router.get('/boards/:board_id', [(0, _expressValidator.param)('board_id').isNumeric(), (0, _expressValidator.query)('page').custom(_api.isPositive), (0, _expressValidator.query)('pagesize').custom(_api.isPositive), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    if (!req.user.perm('board', req.params.board_id).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }

    let boardId = parseInt(req.params.board_id);

    try {
        let board = await _Board2.default.findOne({ _id: boardId });
        if (!board) {
            res.status(404).json({ message: 'no board id ' + boardId });
            return;
        }

        const page = parseInt(req.query.page);
        const pagesize = parseInt(req.query.pagesize || 8);

        let postcount = await _Post2.default.find().count().where('board').equals(boardId);

        let posts = await _Post2.default.find().where('board').equals(boardId).limit(pagesize).skip((page - 1) * pagesize).sort('-_id');
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
                    comment_count: post.comments.length,
                    comment: post.comments
                };
            })
        });
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

//댓글 작성
router.post('/posts/:post_id/comment', [(0, _expressValidator.param)('post_id').isNumeric(), (0, _expressValidator.body)('content').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let postId = parseInt(req.params.post_id);
    let post = await _Post2.default.findOne({ _id: postId });

    if (!req.user.perm('board', post.board).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }
    // if (req.body.content.length > 300) {
    //     const err = new Error('댓글은 300자를 넘을 수 없습니다.')
    //     err.status = 500
    //     return
    // }
    if (!post) {
        res.status(404).json({ message: 'no post id ' + postId });
        return;
    }
    if (post.isAnonymous == true) {
        await post.addComment(req.body.content, crypto.createHash('sha512').update(req.user.username).digest('base64'));
    } else {
        await post.addComment(req.body.content, req.user.username);
    }
    res.status(201).json({ message: '댓글 작성 완료' });
}));

//댓글 수정
router.patch('/posts/:post_id/comment/:comment_id', [(0, _expressValidator.param)('post_id').isNumeric(), (0, _expressValidator.body)('content').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let post = await _Post2.default.findOne().where('_id').equals(req.params.post_id);
    if (!post) {
        res.status(404).json({
            message: 'no post id ' + req.params.comment_id
        });
        return;
    }

    if (!req.user.perm('board', post.board).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }

    let comment = post.getComment(req.params.comment_id);

    if (post.isAnonymous == false) {
        if (comment.writer != req.user.username) {
            res.status(403).end();
            return;
        }
    } else {
        if (comment.writer != crypto.createHash('sha512').update(req.user.username).digest('base64')) {
            res.status(403).end();
            return;
        }
    }

    await post.updateComment(req.body.content, req.params.comment_id);

    res.status(201).json({ message: '댓글 수정 완료' });
}));

//댓글 삭제
router.delete('/posts/:post_id/comment/:comment_id', [(0, _expressValidator.param)('post_id').isNumeric(), (0, _expressValidator.param)('comment_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let post = await _Post2.default.findOne().where('_id').equals(req.params.post_id);

    //게시글 유무
    if (!post) {
        res.status(404).json({
            message: 'no post id ' + req.params.comment_id
        });
        return;
    }
    //댓글 본인확인
    let comment = post.getComment(req.params.comment_id);

    if (comment.writer == req.user.username) {
        await post.removeComment(req.params.comment_id);
        res.status(200).json({ message: '삭제 성공' });
    }

    //게시판 권한
    if (!req.user.perm('board', post.board).can('delete')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }

    if (post.isAnonymous == false) {
        if (comment.writer != req.user.username && !req.user.perm('board', req.params.comment_id).can('delete')) {
            res.status(403).end();
            return;
        }
    } else {
        if (comment.writer != crypto.createHash('sha512').update(req.user.username).digest('base64') && !req.user.perm('board', req.params.comment_id).can('delete')) {
            res.status(403).end();
            return;
        }
    }

    //다른 사람이 삭제할때 모든 권한 확인 후 삭제
    await post.removeComment(req.params.comment_id);
    res.status(200).json({ message: '삭제 성공' });
}));

//좋아요 생성
router.post('/posts/:post_id/like', [(0, _expressValidator.param)('post_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let postId = parseInt(req.params.post_id);
    let post = await _Post2.default.findOne({ _id: postId });

    if (!post) {
        res.status(404).json({ message: 'no post id ' + postId });
        return;
    }

    if (!req.user.perm('board', post.board).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }

    await post.likes_create(req.user.username);
    res.status(201).json({ message: '좋아요 생성 완료' });
}));

//좋아요 삭제
router.delete('/posts/:post_id/like', [(0, _expressValidator.param)('post_id').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let postId = parseInt(req.params.post_id);
    let post = await _Post2.default.findOne({ _id: postId });
    if (!post) {
        res.status(404).json({ message: 'no post id ' + postId });
        return;
    }

    if (!req.user.perm('board', post.board).can('read')) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }
    await post.likes_delete(req.user.username);
    res.status(201).json({ message: '좋아요 삭제 완료' });
}));

//게시물 검색
router.get('/searchpost', [(0, _expressValidator.query)('content'), (0, _expressValidator.query)('option'), (0, _expressValidator.query)('page').custom(_api.isPositive), (0, _expressValidator.query)('pagesize').custom(_api.isPositive), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    let options = [];
    if (req.query.option == 'title') {
        options = [{ title: new RegExp(req.query.content) }];
    } else if (req.query.option == 'content') {
        options = [{ content: new RegExp(req.query.content) }];
    } else if (req.query.option == 'title+content') {
        options = [{ title: new RegExp(req.query.content) }, { content: new RegExp(req.query.content) }];
    } else {
        const err = new Error('검색 옵션이 없습니다.');
        err.status = 400;
        throw err;
    }

    const board = (await _Board2.default.find()).filter(item => {
        return req.user.perm('board', item.id + '').can('read');
    }).map(item => item.id);

    try {
        const page = parseInt(req.query.page);
        const pagesize = parseInt(req.query.pagesize || 8);

        let postcount = await _Post2.default.find({
            $or: options,
            board: { $in: board }
        }).count();

        const posts = await _Post2.default.find({
            $or: options,
            board: { $in: board }
        }).limit(pagesize).skip((page - 1) * pagesize);

        res.status(200).json({
            totalpage: postcount,
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
                    comment_count: post.comments.length,
                    comment: post.comments
                };
            })
        });
    } catch (error) {
        const errr = new Error('database error');
        errr.status = 500;
        throw errr;
    }
}));

exports.default = router;
//# sourceMappingURL=simple.route.js.map