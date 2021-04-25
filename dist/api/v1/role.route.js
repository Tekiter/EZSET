"use strict";
/*
role.route.js
Role과 거기에 대한 권한을 관리하는 API

*/
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const api_1 = require("../../utils/api");
const express_validator_1 = require("express-validator");
const role_1 = __importStar(require("../../utils/role"));
const permissions_1 = __importDefault(require("../../utils/role/permissions"));
const User_1 = __importDefault(require("../../models/User"));
const router = express_1.Router();
/**
 * @api {get} /role/me 내 역할 조회
 * @apiDescription 내 아이디에 부여된 역할과 권한 정보를 받아옴
 * @apiName MyRole
 * @apiGroup role
 *
 * @apiSuccess {Array} roles 나에게 부여된 역할들
 * @apiSuccess {Array} perms 나에게 부여된 권한들
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 * {
 *   "roles": [
 *     "admin"
 *   ],
 *   "perms": [
 *     {
 *       "role": {
 *         "all": {
 *           "any": [],
 *           "own": [
 *             "read"
 *           ]
 *         }
 *       },
 *       "managePreusers": {},
 *       "serverConfig": {},
 *       "manageUsers": {},
 *       "manageBoards": {}
 *     },
 *     {
 *       "serverConfig": {
 *         "all": [
 *           "change"
 *         ]
 *       }
 *     }
 *   ]
 * }
 */
router.get('/me', [role_1.perm('role').canOwn('read'), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userRoles = yield role_1.default.getUserRoles(req.user.username);
    const userPerms = userRoles.map(i => {
        return role_1.default.roles.export(i).perm;
    });
    res.json({
        roles: userRoles,
        perms: [role_1.default.roles.export('default').perm, ...userPerms],
    });
})));
/**
 * @api {get} /role 역할 조회
 * @apiDescription 모든 역할들의 정보와 권한들을 가져옴
 * @apiName RoleAllInfos
 * @apiGroup role
 *
 * @apiSuccess {Array} roles 나에게 부여된 역할들
 * @apiSuccess {Array} perms 나에게 부여된 권한들
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 * {
 *   "roles": [
 *     "admin"
 *   ],
 *   "perms": [
 *     {
 *       "role": {
 *         "all": {
 *           "any": [],
 *           "own": [
 *             "read"
 *           ]
 *         }
 *       },
 *       "managePreusers": {},
 *       "serverConfig": {},
 *     },
 *     {
 *       "serverConfig": {
 *         "all": [
 *           "change"
 *         ]
 *       }
 *     }
 *   ]
 * }
 */
router.get('/', [role_1.perm('role').can('modify'), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let roles = yield role_1.default.getRoleNames();
    roles = roles
        .filter(item => !['admin', 'default'].includes(item.tag))
        .sort((a, b) => a.name.localeCompare(b.name));
    res.json([
        { tag: 'default', name: '모든 유저' },
        { tag: 'admin', name: '관리자' },
        ...roles,
    ]);
})));
/**
 * @api {post} /role 역할 추가
 * @apiDescription 새로운 역할을 추가함
 * @apiName CreateRole
 * @apiGroup role
 *
 * @apiParam {String} name 역할 이름
 *
 * @apiParamExample {json} Request-Example:
 *      { name: "role1" }
 *
 * @apiSuccess {String} tag 새 역할의 태그
 * @apiSuccess {String} name 새 역할의 이름
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *      {"tag":"1913c","name":"role1","perm":{}}
 */
router.post('/', [role_1.perm('role').can('modify'), express_validator_1.body('name').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // if (req.user.perm('role').can('create')) {
    //     const newrole = await role.createRole({ name: req.body.name })
    //     res.json(newrole)
    // } else {
    //     const err = new Error('권한이 없습니다.')
    //     err.status = 403
    //     throw err
    // }
    const newrole = yield role_1.default.createRole({
        name: req.body.name,
    });
    res.json(newrole);
})));
/**
 * @api {get} /role/managepage 역할의 권한 목록 조회
 * @apiDescription 변경할 수 있는 권한의 정보들을 가져옴
 * @apiName RolePermList
 * @apiGroup role
 *
 * @apiSuccess {Object[]} - frontend의 SettingSelect 컴포넌트에 들어갈 데이터형식
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       [
 *          {"type":"header","title":"관리"},
 *          {"type":"switch","title":"유저 관리",
 *           "content":"유저의 비밀번호를 초기화하거나, 강제 탈퇴시킬 수 있습니다.",
 *           "target":{"resource":"manageUsers","action":"access","range":"any"}
 *          }
 *       ]
 */
router.get('/managepage', [api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    res.json(permissions_1.default.managePage);
})));
/**
 * @api {get} /role/:role_tag 해당 역할의 정보 조회
 * @apiDescription 태그가 role_tag 역할의 정보를 보여줌
 * @apiName RoleInfo
 * @apiGroup role
 *
 * @apiSuccess {String} tag 역할의 태그
 * @apiSuccess {String} name 역할의 이름
 * @apiSuccess {Object} perm 역할의 권한
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       {
 *          "tag":"admin",
 *          "name":"관리자",
 *          "perm":{ ... }
 *      }
 */
router.get('/:role_tag', [express_validator_1.param('role_tag').isString(), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (role_1.default.roles.hasRole(req.params.role_tag)) {
        const roleobj = role_1.default.roles.export(req.params.role_tag);
        res.json(roleobj);
    }
    else {
        const err = new Error('invalid role tag');
        err.status = 404;
        throw err;
    }
})));
/**
 * @api {get} /role/:role_tag/users 역할 유저 조회
 * @apiDescription 태그가 role_tag 역할에 속한 유저들을 보여줌
 * @apiName RoleUsers
 * @apiGroup role
 *
 * @apiSuccess {Object[]} users 역할에 속한 유저들
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *       {
 *          "users":[
 *              {"username":"admin","realname":"관리자"}]
 *          }
 */
router.get('/:role_tag/users', [express_validator_1.param('role_tag').custom(api_1.checkRoleTag), api_1.validateParams], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.default.find({ roles: req.params.role_tag }).select('username info');
    res.json({
        users: users.map(user => {
            return { username: user.username, realname: user.info.realname };
        }),
    });
})));
/**
 * @api {patch} /role/:role_tag 역할 권한 변경
 * @apiDescription 태그가 role_tag 역할의 권한을 변경함
 * @apiName ChangeRolePerm
 * @apiGroup role
 *
 * @apiParam {String} name 바꿀 역할 이름
 * @apiParam {Object[]} perms 바꿀 권한의 정보
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          "name":"role1",
 *          "perms":[
 *              {"allow":false,"resource":"manageUsers","action":"access","range":"any"},
 *              {"allow":false,"resource":"manageBoards","action":"access","range":"any"}
 *          ]
 *      }
 *
 */
router.patch('/:role_tag', [
    role_1.perm('role').can('modify'),
    express_validator_1.param('role_tag').custom(api_1.checkRoleTag),
    express_validator_1.body('name')
        .isString()
        .optional(),
    express_validator_1.body('perms').isArray(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.role_tag == 'admin') {
        const err = new Error('admin 역할은 변경할 수 없습니다.');
        err.status = 400;
        throw err;
    }
    // Validation
    // 올바른 perm 배열인지 체크
    for (let item of req.body.perms) {
        if (!item.resource ||
            !item.action ||
            !(item.range || item.range == 'any' || item.range == 'own')) {
            const err = new Error('Invalid action');
            err.status = 400;
            throw err;
        }
    }
    // 역할 name 변경
    if (req.body.name) {
        role_1.roles.getRole(req.params.role_tag).name = req.body.name;
    }
    // 수정할 데이터를 Role 에 반영
    const context = role_1.roles.role(req.params.role_tag);
    for (let item of req.body.perms) {
        const resource = context.resource(item.resource, item.param != undefined ? item.param + '' : undefined);
        if (item.allow) {
            resource.can(item.action, item.range);
        }
        else {
            resource.cannot(item.action, item.range);
        }
    }
    yield role_1.default.updateRole(req.params.role_tag);
    res.end();
})));
/**
 * @api {delete} /role/:role_tag 역할 삭제
 * @apiDescription 태그가 role_tag인 역할을 삭제함
 * @apiName DeleteRole
 * @apiGroup role
 *
 */
router.delete('/:role_tag', [
    role_1.perm('role').can('modify'),
    express_validator_1.param('role_tag').custom(api_1.checkRoleTag),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (req.params.role_tag == 'admin') {
        const err = new Error('admin 역할은 삭제할 수 없습니다.');
        err.status = 400;
        throw err;
    }
    if (req.params.role_tag == 'default') {
        const err = new Error('default 역할은 삭제할 수 없습니다.');
        err.status = 400;
        throw err;
    }
    yield role_1.default.removeRole(req.params.role_tag);
    res.end();
})));
exports.default = router;
//# sourceMappingURL=role.route.js.map