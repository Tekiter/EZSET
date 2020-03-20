'use strict';

var _Role = require('../../models/Role');

var _Role2 = _interopRequireDefault(_Role);

var _role = require('../../libs/role');

var _randomNumberCsprng = require('random-number-csprng');

var _randomNumberCsprng2 = _interopRequireDefault(_randomNumberCsprng);

var _default = require('./default');

var _User = require('../../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const roles = new _role.RoleSystem();

const role = {
    roles,
    async getRoleMiddleware(req, res, next) {
        if (req.user) {
            const user = await _User2.default.findOne().where('username').equals(req.user.username).select('roles').cache(60, 'USER-ROLE-' + req.user.username);
            req.user.perm = roles.createPermChecker(['default', ...user.roles]);
            next();
        } else {
            next();
        }
    },
    perm(resource, params) {
        const middleware = (verb, action, type) => {
            return (req, res, next) => {
                if (req.user.perm(resource, params)[verb](action, type)) {
                    next();
                } else {
                    const err = new Error('권한이 없습니다.');
                    err.status = 403;
                    throw err;
                }
            };
        };

        return {
            can(action, type) {
                return middleware('can', action, type);
            },
            canOwn(action, type) {
                return middleware('canOwn', action, type);
            },
            canAny(action, type) {
                return middleware('canAny', action, type);
            },
            cannot(action, type) {
                return middleware('cannot', action, type);
            },
            cannotAny(action, type) {
                return middleware('cannotAny', action, type);
            },
            cannotOwn(action, type) {
                return middleware('cannotOwn', action, type);
            }
        };
    },
    permOr(callback) {
        return (req, res, next) => {
            if (callback(req.user.perm)) {
                next();
            } else {
                const err = new Error('권한이 없습니다.');
                err.status = 403;
                throw err;
            }
        };
    },
    async getRoleNames() {
        return roles.roleNames();
    },
    async createRole({ name }) {
        let newtag;
        do {
            newtag = (await (0, _randomNumberCsprng2.default)(0x100, 0x99999)).toString(16);
        } while (roles.hasRole(newtag));

        roles.setRole({ tag: newtag, name, perm: {} });
        const newrole = roles.export(newtag);

        const newroledoc = (0, _Role2.default)({
            tag: newtag,
            name: newrole.name,
            perm: newrole.perm
        });
        await newroledoc.save();

        return newrole;
    },
    async removeRole(roletag) {
        // db에 저장된 role 정보 가져오기
        const dbrole = await _Role2.default.findOne().where('tag').equals(roletag);

        // 해당 role을 가진 모든 유저 가져오기
        const users = await _User2.default.find({ roles: roletag }).select('username roles');

        // 해당 role을 유저에서 제거
        for (let user of users) {
            const idx = user.roles.indexOf(roletag);
            if (idx < 0) {
                throw new Error('Remove role error');
            }
            user.roles.splice(idx, 1);
            await user.save();
        }

        // db에서 role 제거
        await dbrole.remove();

        // 메모리의 role 제거
        roles.removeRole(roletag);
    },
    async updateRole(roletag) {
        const dbrole = await _Role2.default.findOne().where('tag').equals(roletag);

        const newrole = roles.export(roletag);
        dbrole.name = newrole.name;
        dbrole.perm = newrole.perm;

        await dbrole.save();
    },
    async loadRoles() {
        const roleobjs = await _Role2.default.find();
        let hasDefault = false;
        roleobjs.forEach(role => {
            if (role.tag === 'default') {
                hasDefault = true;
            }
            roles.setRole({
                tag: role.tag,
                name: role.name,
                perm: role.perm
            });
        });
        if (!hasDefault) {
            (0, _default.setDefaultRole)(roles);
            const newrole = roles.export('default');
            const newroledoc = (0, _Role2.default)({
                tag: newrole.tag,
                name: newrole.name,
                perm: newrole.perm
            });
            await newroledoc.save();
        }
        (0, _default.setAdminRole)(roles);
    },
    async getUserRoles(username) {
        const user = await _User2.default.findOne().where('username').equals(username).select('roles');
        return user.roles;
    }
};

module.exports = role;
//# sourceMappingURL=index.js.map