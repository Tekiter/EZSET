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
const random_number_csprng_1 = __importDefault(require("random-number-csprng"));
const api_1 = require("../../utils/api");
const express_validator_1 = require("express-validator");
const User_1 = __importDefault(require("../../models/User"));
const config_1 = require("../../utils/config");
const cachegoose_1 = require("cachegoose");
const role_1 = __importDefault(require("../../utils/role"));
const router = express_1.Router();
/**
 * @api {get} /user 유저 조회
 * @apiDescription 유저의 전체 목록을 가져옴
 * @apiName Users
 * @apiGroup user
 *
 * @apiSuccess {Number} total 결과의 개수
 * @apiSuccess {Object[]} users 유저 정보 리스트
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       {
 *          "total":1,
 *          "users":[
 *              {"username":"admin","realname":"관리자","roles":["admin"]}
 *          ]
 *      }
 */
router.route('/').get([
    role_1.default.perm('manageUsers').can('access'),
    express_validator_1.query('page')
        .custom(api_1.isPositive)
        .optional(),
    express_validator_1.query('pagesize')
        .custom(api_1.isPositive)
        .optional(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let query;
    const total = yield User_1.default.count();
    if (req.query.page) {
        // 페이지 쿼리 존재할때
        const page = parseInt(req.query.page);
        const pagesize = parseInt(req.query.pagesize || 30);
        query = User_1.default.find()
            .limit(pagesize)
            .skip((page - 1) * pagesize);
    }
    else {
        // 페이지 쿼리 없을 때
        query = User_1.default.find();
    }
    const users = yield query.sort('username').select('username info roles');
    res.json({
        total,
        users: users.map(user => {
            return {
                username: user.username,
                realname: user.info.realname || '',
                roles: user.roles,
            };
        }),
    });
})));
/**
 * @api {delete} /user/:username 유저 회원 탈퇴
 * @apiDescription 아이디가 username 인 유저를 탈퇴시킴
 * @apiName DeleteUser
 * @apiGroup user
 *
 */
router.delete('/:username', [express_validator_1.param('username').custom(api_1.checkUsername), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!role_1.default.perm('manageUsers').can('access') &&
        req.params.username === req.user.username) {
        const err = new Error('권한이 없습니다.');
        err.status = 403;
        throw err;
    }
    if ((yield config_1.getConfig('superAdmin')) == req.params.username) {
        const err = new Error('admin 계정은 탈퇴할 수 없습니다.');
        err.status = 403;
        throw err;
    }
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    yield user.remove();
    res.status(200).end();
})));
/**
 * @api {post} /user/:username/resetpassword 유저 회원 탈퇴
 * @apiDescription 아이디가 username 인 유저의 비밀번호를 초기화시킴
 * @apiName ResetUserPassword
 * @apiGroup user
 *
 */
router.post('/:username/resetpassword', [
    role_1.default.perm('manageUsers').can('access'),
    express_validator_1.param('username').custom(api_1.checkUsername),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    const newpasswd = (yield random_number_csprng_1.default(11, 35)).toString(36) +
        (yield random_number_csprng_1.default(Math.pow(36, 7), Math.pow(36, 8))).toString(36);
    user.password = newpasswd;
    yield user.save();
    res.json({ new_password: newpasswd });
})));
/**
 * @api {get} /user/:username/role 유저 역할 가져오기
 * @apiDescription 아이디가 username 인 유저에게 부여된 역할들을 가져옴
 * @apiName UserRoles
 * @apiGroup user
 *
 */
router.get('/:username/role', [
    role_1.default.perm('role', 'user').can('read'),
    express_validator_1.param('username').isString(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username)
        .select('roles');
    // .cache(0, 'USER-ROLE-' + req.user.username)
    if (!user) {
        const err = new Error('해당 유저가 없습니다.');
        err.status = 404;
        throw err;
    }
    res.json({
        roles: user.roles,
    });
})));
/**
 * @api {put} /user/:username/role 유저 역할 부여
 * @apiDescription 아이디가 username 인 유저의 역할을 설정함
 * @apiName SetUserRole
 * @apiGroup user
 *
 * @apiParam {String[]} roletags 설정할 역할들의 태그들
 *
 * @apiParamExample {json} Request-Example:
 *      {roletags: ["admin"]}
 *
 */
router.put('/:username/role', [
    role_1.default.perm('role').can('modify'),
    express_validator_1.param('username').custom(api_1.checkUsername),
    express_validator_1.body('roletags').custom(api_1.checkRoleTagArray),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 없습니다.');
        err.status = 404;
        throw err;
    }
    if (req.body.roletags.indexOf('admin') < 0) {
        if ((yield config_1.getConfig('superAdmin')) == req.params.username) {
            const err = new Error('서버 관리자의 어드민 역할은 변경할 수 없습니다.');
            err.status = 403;
            throw err;
        }
    }
    if (req.body.roletags.includes('default')) {
        const err = new Error('default 역할은 변경할 수 없습니다.');
        err.status = 403;
        throw err;
    }
    user.roles = req.body.roletags;
    yield user.save();
    cachegoose_1.clearCache('USER-ROLE-' + req.user.username);
    res.end();
})));
/**
 * @api {post} /user/:username/role 유저 역할 부여
 * @apiDescription 아이디가 username 인 유저에게 역할을 부여함
 * @apiName AddUserRole
 * @apiGroup user
 *
 * @apiParam {String} roletag 부여할 역할의 roletag
 *
 */
router.post('/:username/role', [
    role_1.default.perm('role').can('modify'),
    // param('username').isString(),
    express_validator_1.param('username').custom(api_1.checkUsername),
    express_validator_1.body('roletag').custom(api_1.checkRoleTag),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 없습니다.');
        err.status = 404;
        throw err;
    }
    if (req.body.roletag == 'default') {
        const err = new Error('default 역할은 변경할 수 없습니다.');
        err.status = 403;
        throw err;
    }
    if (user.roles.indexOf(req.body.roletag) == -1) {
        user.roles.push(req.body.roletag);
        yield user.save();
    }
    cachegoose_1.clearCache('USER-ROLE-' + req.user.username);
    res.status(200).json({});
})));
/**
 * @api {delete} /user/:username/role/:roletag 유저의 역할 제거
 * @apiDescription 아이디가 username 인 유저의, 태그가 roletag인 역할을 빼버림
 * @apiName DeleteUserRole
 * @apiGroup user
 *
 */
router.delete('/:username/role/:roletag', [
    role_1.default.perm('role').can('modify'),
    express_validator_1.param('username').custom(api_1.checkUsername),
    express_validator_1.param('roletag').custom(api_1.checkRoleTag),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 없습니다.');
        err.status = 404;
        throw err;
    }
    if (req.params.roletag == 'admin') {
        if ((yield config_1.getConfig('superAdmin')) == req.params.username) {
            const err = new Error('서버 관리자의 어드민 역할은 변경할 수 없습니다.');
            err.status = 403;
            throw err;
        }
    }
    const idx = user.roles.indexOf(req.params.roletag);
    if (idx != -1) {
        user.roles.splice(idx, 1);
        yield user.save();
    }
    cachegoose_1.clearCache('USER-ROLE-' + req.user.username);
    res.status(200).json({});
})));
exports.default = router;
//# sourceMappingURL=user.route.js.map