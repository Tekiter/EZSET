'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _api = require('../../utils/api');

var _expressValidator = require('express-validator');

var _role = require('../../utils/role');

var _role2 = _interopRequireDefault(_role);

var _permissions = require('../../utils/role/permissions');

var _permissions2 = _interopRequireDefault(_permissions);

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
role.route.js
Role과 거기에 대한 권한을 관리하는 API

*/

const router = (0, _express.Router)();

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
router.get('/me', [(0, _role.perm)('role').canOwn('read'), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const userRoles = await _role2.default.getUserRoles(req.user.username);
    const userPerms = userRoles.map(i => {
        return _role2.default.roles.export(i).perm;
    });

    res.json({
        roles: userRoles,
        perms: [_role2.default.roles.export('default').perm, ...userPerms]
    });
}));

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
router.get('/', [(0, _role.perm)('role').can('modify'), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    let roles = await _role2.default.getRoleNames();

    roles = roles.filter(item => !['admin', 'default'].includes(item.tag)).sort((a, b) => a.name.localeCompare(b.name));

    res.json([{ tag: 'default', name: '모든 유저' }, { tag: 'admin', name: '관리자' }, ...roles]);
}));

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
router.post('/', [(0, _role.perm)('role').can('modify'), (0, _expressValidator.body)('name').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    // if (req.user.perm('role').can('create')) {
    //     const newrole = await role.createRole({ name: req.body.name })
    //     res.json(newrole)
    // } else {
    //     const err = new Error('권한이 없습니다.')
    //     err.status = 403
    //     throw err
    // }
    const newrole = await _role2.default.createRole({
        name: req.body.name
    });
    res.json(newrole);
}));

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
router.get('/managepage', [_api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    res.json(_permissions2.default.managePage);
}));

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
router.get('/:role_tag', [(0, _expressValidator.param)('role_tag').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    if (_role2.default.roles.hasRole(req.params.role_tag)) {
        const roleobj = _role2.default.roles.export(req.params.role_tag);
        res.json(roleobj);
    } else {
        const err = new Error('invalid role tag');
        err.status = 404;
        throw err;
    }
}));

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
router.get('/:role_tag/users', [(0, _expressValidator.param)('role_tag').custom(_api.checkRoleTag), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    const users = await _User2.default.find({ roles: req.params.role_tag }).select('username info');
    res.json({
        users: users.map(user => {
            return { username: user.username, realname: user.info.realname };
        })
    });
}));

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
router.patch('/:role_tag', [(0, _role.perm)('role').can('modify'), (0, _expressValidator.param)('role_tag').custom(_api.checkRoleTag), (0, _expressValidator.body)('name').isString().optional(), (0, _expressValidator.body)('perms').isArray(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    if (req.params.role_tag == 'admin') {
        const err = new Error('admin 역할은 변경할 수 없습니다.');
        err.status = 400;
        throw err;
    }

    // Validation
    // 올바른 perm 배열인지 체크
    for (let item of req.body.perms) {
        if (!item.resource || !item.action || !(item.range || item.range == 'any' || item.range == 'own')) {
            const err = new Error('Invalid action');
            err.status = 400;
            throw err;
        }
    }

    // 역할 name 변경
    if (req.body.name) {
        _role.roles.getRole(req.params.role_tag).name = req.body.name;
    }

    // 수정할 데이터를 Role 에 반영
    const context = _role.roles.role(req.params.role_tag);
    for (let item of req.body.perms) {
        const resource = context.resource(item.resource, item.param != undefined ? item.param + '' : undefined);
        if (item.allow) {
            resource.can(item.action, item.range);
        } else {
            resource.cannot(item.action, item.range);
        }
    }

    await _role2.default.updateRole(req.params.role_tag);

    res.end();
}));

/**
 * @api {delete} /role/:role_tag 역할 삭제
 * @apiDescription 태그가 role_tag인 역할을 삭제함
 * @apiName DeleteRole
 * @apiGroup role
 *
 */
router.delete('/:role_tag', [(0, _role.perm)('role').can('modify'), (0, _expressValidator.param)('role_tag').custom(_api.checkRoleTag), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
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

    await _role2.default.removeRole(req.params.role_tag);

    res.end();
}));

exports.default = router;
//# sourceMappingURL=role.route.js.map