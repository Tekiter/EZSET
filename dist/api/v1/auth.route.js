"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const config_1 = require("../../utils/config");
const auth_1 = __importDefault(require("../../utils/auth"));
const api_1 = require("../../utils/api");
const User_1 = __importDefault(require("../../models/User"));
const PreUser_1 = __importDefault(require("../../models/PreUser"));
const router = express_1.Router();
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
router.route('/login').post([express_validator_1.body('username').isString(), express_validator_1.body('password').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne()
            .where('username')
            .equals(req.body.username);
        if (user && user.checkPassword(req.body.password)) {
            const accessToken = yield auth_1.default.createAccessToken(user);
            res.status(200).json({
                accessToken,
            });
        }
        else {
            const user = yield PreUser_1.default.findOne()
                .where('username')
                .equals(req.body.username);
            if (user) {
                res.status(403).json({ message: '가입 승인 대기중입니다.' });
            }
            else {
                res.status(403).json({
                    message: '올바르지 않은 아이디 또는 비밀번호입니다.',
                });
            }
        }
    }
    catch (error) {
        const err = new Error('알 수 없는 오류가 발생했습니다.');
        err.status = 500;
        throw err;
    }
})));
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
router.route('/register').post([
    express_validator_1.body('username').isString(),
    express_validator_1.body('password').isString(),
    express_validator_1.body('realname').isString(),
    express_validator_1.body('email')
        .isEmail()
        .optional({ checkFalsy: true }),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let idreg = /^[a-z0-9]{6,12}$/;
    if (!idreg.test(req.body.username)) {
        res.status(400).json({
            message: '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.',
        });
        return;
    }
    let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,32}$/;
    if (!pwreg.test(req.body.password)) {
        res.status(400).json({
            message: '비밀번호는 8자 이상의 영문자와 숫자를 필수로 사용해야 합니다.',
        });
        return;
    }
    const exists = yield User_1.default.count()
        .where('username')
        .equals(req.body.username);
    const existsPreuser = yield PreUser_1.default.count()
        .where('username')
        .equals(req.body.username);
    if (exists || existsPreuser) {
        res.status(409).json({
            message: '이미 사용중인 아이디입니다.',
        });
        return;
    }
    const userData = {
        username: req.body.username,
        password: req.body.password,
        info: {
            realname: req.body.realname,
            email: req.body.email,
        },
    };
    // 회원승인제 설정이 도입되어있으면 PreUser 에 회원가입 넣기
    let user;
    if (yield config_1.getConfig('usePreUser', false)) {
        user = new PreUser_1.default(userData);
    }
    else {
        user = new User_1.default(userData);
    }
    yield user.save();
    res.status(201).json({
        message: 'success',
    });
})));
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
router.route('/register/doublecheck/username').post([express_validator_1.body('username').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const exits = yield User_1.default.count()
            .where('username')
            .equals(req.body.username);
        const existsPreuser = yield PreUser_1.default.count()
            .where('username')
            .equals(req.body.username);
        if (exits || existsPreuser) {
            res.status(409).json({
                message: '이미 사용중인 아이디입니다.',
            });
            return;
        }
        res.status(200).end();
    }
    catch (error) {
        api_1.unexpectedError(res, error);
    }
})));
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
router.route('/edittoken/issue').post([express_validator_1.body('username').isString(), express_validator_1.body('password').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield User_1.default.findOne()
            .where('username')
            .equals(req.body.username);
        if (user && user.checkPassword(req.body.password)) {
            const editToken = yield auth_1.default.createEditToken(req.body.username);
            res.status(200).json({
                editToken,
            });
        }
        else {
            res.status(403).json({ message: '토큰 발급 실패' });
        }
    }
    catch (error) {
        api_1.databaseError(res, error);
    }
})));
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
router.route('/edittoken/check').post([express_validator_1.body('edittoken').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const decoded = yield auth_1.default.checkToken(req.body.edittoken);
        if (decoded.is_edit_token &&
            decoded.username === req.user.username) {
            res.status(200).end();
        }
    }
    catch (err) {
        res.status(403).end();
    }
})));
exports.default = router;
//# sourceMappingURL=auth.route.js.map