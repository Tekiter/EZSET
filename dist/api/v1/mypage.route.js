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
const auth_1 = __importDefault(require("../../utils/auth"));
const api_1 = require("../../utils/api");
const User_1 = __importDefault(require("../../models/User"));
const router = express_1.Router();
// 유저 정보 조회하여 회원 정보를 넘겨줌
/**
 * @api {get} /mypage/ 마이페이지 회원정보 조회
 * @apiName 마이페이지 회원정보 조회
 * @apiGroup Mypage
 *
 * @apiSuccess {Number} 200 마이페이지 회원정보 조회 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200
 *          {
 *             username: user.username,
 *             realname: user.info.realname,
 *             email: user.info.email,
 *          }
 */
//group 목록 보기
router.route('/').get([api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.user.username)
        .select('username info');
    res.json({
        username: user.username,
        realname: user.info.realname,
        email: user.info.email,
    });
})));
/**
 * @api {post} /mypage/edit 마이페이지 회원정보 수정
 * @apiName 마이페이지 회원정보 수정
 * @apiGroup Mypage
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 * @apiParam {String} realname 유저 실명
 * @apiParam {Email} email 유저 이메일
 * @apiParam {JWT} editToken 회원정보 보안 토큰
 *
 * @apiSuccess {Number} 201 마이페이지 회원정보 수정 성공
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 201
 *          {
 *              message: 'success',
 *          }
 *
 * @apiError {Number} 400 마이페이지 비밀번호 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 400
 *       {
 *          message:'비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',
 *       }
 *
 * @apiError {Number} 403 마이페이지 비정상적 접근 에러
 * @apiErrorExample Error-Response:
 *       HTTP/1.1 403
 *       {
 *          '토큰이 만료되었습니다.',
 *       }
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 403
 *       {
 *          message: '정상적인 접근이 아닙니다',
 *       }
 *
 */
router.route('/edit').post([
    express_validator_1.body('username').isString(),
    express_validator_1.body('password').isString(),
    express_validator_1.body('realname').isString(),
    express_validator_1.body('email').isString(),
    express_validator_1.body('edittoken').isString(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let decoded;
        try {
            decoded = yield auth_1.default.checkToken(req.body.edittoken);
        }
        catch (error) {
            const err = new Error('토큰이 만료되었습니다.');
            err.status = 403;
            throw err;
        }
        if (decoded.username == req.body.username) {
            if (req.body.password != '') {
                let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/;
                if (!pwreg.test(req.body.password)) {
                    res.status(400).json({
                        message: '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',
                    });
                    return;
                }
            }
            const user = yield User_1.default.findOne()
                .where('username')
                .equals(req.body.username);
            if (req.body.realname != '') {
                user.info.realname = req.body.realname;
            }
            if (req.body.email != '') {
                user.info.email = req.body.email;
            }
            if (req.body.password != '') {
                user.password = req.body.password;
            }
            user.markModified('info');
            yield user.save();
            res.status(201).json({ message: 'success' });
        }
        else {
            res.status(403).json({
                message: '정상적인 접근이 아닙니다',
            });
        }
    }
    catch (error) { }
})));
exports.default = router;
//# sourceMappingURL=mypage.route.js.map