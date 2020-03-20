'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _expressValidator = require('express-validator');

var _config = require('../../utils/config');

var _auth = require('../../utils/auth');

var _auth2 = _interopRequireDefault(_auth);

var _api = require('../../utils/api');

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

var _PreUser = require('../../models/PreUser');

var _PreUser2 = _interopRequireDefault(_PreUser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
router.loginNotRequired = true;

/**
 * @api {post} /auth/login 로그인
 * @apiName 로그인
 * @apiGroup Auth
 *
 * @apiParam {String} username 로그인 할 아이디
 * @apiParam {String} password 로그인 할 비밀번호
 *
 * @apiSuccess {JWT} accessToken 로그인 인증 토큰
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *  {
 *    "accessToken": "<JWT-LOGIN-TOKEN>"
 *  }
 */
router.route('/login').post([(0, _expressValidator.body)('username').isString(), (0, _expressValidator.body)('password').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    try {
        const user = await _User2.default.findOne().where('username').equals(req.body.username);

        if (user && user.checkPassword(req.body.password)) {
            const accessToken = await _auth2.default.createAccessToken(user);

            res.status(200).json({
                accessToken
            });
        } else {
            const user = await _PreUser2.default.findOne().where('username').equals(req.body.username);

            if (user) {
                res.status(403).json({ message: '가입 승인 대기중입니다.' });
            } else {
                res.status(403).json({
                    message: '올바르지 않은 아이디 또는 비밀번호입니다.'
                });
            }
        }
    } catch (error) {
        const err = new Error('알 수 없는 오류가 발생했습니다.');
        err.status = 500;
        throw err;
    }
}));

/**
 * @api {post} /auth/register 유저 회원가입
 * @apiName 유저 회원가입
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 * @apiParam {String} realname 유저 실명
 * @apiParam {Email} email 유저 이메일
 *
 * @apiSuccess {Number} 201 유저 회원가입 성공
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 */
router.route('/register').post([(0, _expressValidator.body)('username').isString(), (0, _expressValidator.body)('password').isString(), (0, _expressValidator.body)('realname').isString(), (0, _expressValidator.body)('email').isEmail().optional({ checkFalsy: true }), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    let idreg = /^[a-z0-9]{6,12}$/;
    if (!idreg.test(req.body.username)) {
        res.status(400).json({
            message: '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.'
        });
        return;
    }

    let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,32}$/;
    if (!pwreg.test(req.body.password)) {
        res.status(400).json({
            message: '비밀번호는 8자 이상의 영문자와 숫자를 필수로 사용해야 합니다.'
        });
        return;
    }

    const exists = await _User2.default.count().where('username').equals(req.body.username);

    const existsPreuser = await _PreUser2.default.count().where('username').equals(req.body.username);

    if (exists || existsPreuser) {
        res.status(409).json({
            message: '이미 사용중인 아이디입니다.'
        });
        return;
    }

    const userData = {
        username: req.body.username,
        password: req.body.password,
        info: {
            realname: req.body.realname,
            email: req.body.email
        }

        // 회원승인제 설정이 도입되어있으면 PreUser 에 회원가입 넣기
    };let user;
    if (await (0, _config.getConfig)('usePreUser', false)) {
        user = new _PreUser2.default(userData);
    } else {
        user = new _User2.default(userData);
    }
    await user.save();

    res.status(201).json({
        message: 'success'
    });
}));

/**
 * @api {post} /auth/register/doublecheck/username 유저 중복 아이디 체크
 * @apiName 유저 중복 아이디 체크
 * @apiGroup Auth
 * @apiDescription 유저가 화원가입 할 시 username을 중복 체크
 *
 * @apiParam {String} username 유저 아이디
 *
 * @apiSuccess {Number} 200 사용할 수 있는 아이디
 *
 * @apiError {Number} 409 username 중복 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 409
 *       {
 *          message: '이미 사용중인 아이디입니다.',
 *        }
 */
router.route('/register/doublecheck/username').post([(0, _expressValidator.body)('username').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    try {
        const exits = await _User2.default.count().where('username').equals(req.body.username);
        const existsPreuser = await _PreUser2.default.count().where('username').equals(req.body.username);

        if (exits || existsPreuser) {
            res.status(409).json({
                message: '이미 사용중인 아이디입니다.'
            });
            return;
        }
        res.status(200).end();
    } catch (error) {
        (0, _api.unexpectedError)(res, error);
    }
}));

/**
 * @api {post} /auth/edittoken/issue 유저 회원정보 보안 토큰 발급
 * @apiName 유저 회원정보 보안 토큰 발급
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 *
 * @apiSuccess {JWT} editToken 회원정보 보안 토큰
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 * @apiError {Number} 403 회원정보 보안 토큰 발급 실패 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 403
 *       {
 *          message: '토큰 발급 실패',
 *        }
 */
router.route('/edittoken/issue').post([(0, _expressValidator.body)('username').isString(), (0, _expressValidator.body)('password').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    try {
        const user = await _User2.default.findOne().where('username').equals(req.body.username);

        if (user && user.checkPassword(req.body.password)) {
            const editToken = await _auth2.default.createEditToken(req.body.username);

            res.status(200).json({
                editToken
            });
        } else {
            res.status(403).json({ message: '토큰 발급 실패' });
        }
    } catch (error) {
        (0, _api.databaseError)(res, error);
    }
}));

/**
 * @api {post} /auth/edittoken/check 유저 회원정보 보안 토큰 유효성 검사
 * @apiName 유저 회원정보 보안 토큰 유효성 검사
 * @apiGroup Auth
 *
 * @apiParam {JWT} editToken 회원정보 보안 토큰
 *
 * @apiSuccess {Number} 200 회원정보 보안 토큰이 유효함
 *
 * @apiError {Number} 403 회원정보 보안 토큰이 유효하지 않음
 */
router.route('/edittoken/check').post([(0, _expressValidator.body)('edittoken').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    try {
        const decoded = await _auth2.default.checkToken(req.body.edittoken);
        if (decoded.is_edit_token && decoded.username === req.user.username) {
            res.status(200).end();
        }
    } catch (err) {
        res.status(403).end();
    }
}));
exports.default = router;
//# sourceMappingURL=auth.route.js.map