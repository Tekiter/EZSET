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
const Role_1 = __importDefault(require("../../models/Role"));
const role_1 = require("../../libs/role");
const random_number_csprng_1 = __importDefault(require("random-number-csprng"));
const default_1 = require("./default");
const User_1 = __importDefault(require("../../models/User"));
const roles = new role_1.RoleSystem();
const role = {
    roles,
    getRoleMiddleware(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            if (req.user) {
                const user = yield User_1.default.findOne()
                    .where('username')
                    .equals(req.user.username)
                    .select('roles')
                    .cache(60, 'USER-ROLE-' + req.user.username);
                req.user.perm = roles.createPermChecker(['default', ...user.roles]);
                next();
            }
            else {
                next();
            }
        });
    },
    perm(resource, params) {
        const middleware = (verb, action, type) => {
            return (req, res, next) => {
                if (req.user.perm(resource, params)[verb](action, type)) {
                    next();
                }
                else {
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
            },
        };
    },
    permOr(callback) {
        return (req, res, next) => {
            if (callback(req.user.perm)) {
                next();
            }
            else {
                const err = new Error('권한이 없습니다.');
                err.status = 403;
                throw err;
            }
        };
    },
    getRoleNames() {
        return __awaiter(this, void 0, void 0, function* () {
            return roles.roleNames();
        });
    },
    createRole({ name }) {
        return __awaiter(this, void 0, void 0, function* () {
            let newtag;
            do {
                newtag = (yield random_number_csprng_1.default(0x100, 0x99999)).toString(16);
            } while (roles.hasRole(newtag));
            roles.setRole({ tag: newtag, name, perm: {} });
            const newrole = roles.export(newtag);
            const newroledoc = Role_1.default({
                tag: newtag,
                name: newrole.name,
                perm: newrole.perm,
            });
            yield newroledoc.save();
            return newrole;
        });
    },
    removeRole(roletag) {
        return __awaiter(this, void 0, void 0, function* () {
            // db에 저장된 role 정보 가져오기
            const dbrole = yield Role_1.default.findOne()
                .where('tag')
                .equals(roletag);
            // 해당 role을 가진 모든 유저 가져오기
            const users = yield User_1.default.find({ roles: roletag }).select('username roles');
            // 해당 role을 유저에서 제거
            for (let user of users) {
                const idx = user.roles.indexOf(roletag);
                if (idx < 0) {
                    throw new Error('Remove role error');
                }
                user.roles.splice(idx, 1);
                yield user.save();
            }
            // db에서 role 제거
            yield dbrole.remove();
            // 메모리의 role 제거
            roles.removeRole(roletag);
        });
    },
    updateRole(roletag) {
        return __awaiter(this, void 0, void 0, function* () {
            const dbrole = yield Role_1.default.findOne()
                .where('tag')
                .equals(roletag);
            const newrole = roles.export(roletag);
            dbrole.name = newrole.name;
            dbrole.perm = newrole.perm;
            yield dbrole.save();
        });
    },
    loadRoles() {
        return __awaiter(this, void 0, void 0, function* () {
            const roleobjs = yield Role_1.default.find();
            let hasDefault = false;
            roleobjs.forEach(role => {
                if (role.tag === 'default') {
                    hasDefault = true;
                }
                roles.setRole({
                    tag: role.tag,
                    name: role.name,
                    perm: role.perm,
                });
            });
            if (!hasDefault) {
                default_1.setDefaultRole(roles);
                const newrole = roles.export('default');
                const newroledoc = Role_1.default({
                    tag: newrole.tag,
                    name: newrole.name,
                    perm: newrole.perm,
                });
                yield newroledoc.save();
            }
            default_1.setAdminRole(roles);
        });
    },
    getUserRoles(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.default.findOne()
                .where('username')
                .equals(username)
                .select('roles');
            return user.roles;
        });
    },
};
module.exports = role;
//# sourceMappingURL=index.js.map