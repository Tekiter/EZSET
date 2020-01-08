import RoleModel from '../../models/Role'
import { RoleSystem } from '../../libs/role'
import random from 'random-number-csprng'
import { setDefaultRole, setAdminRole } from './default'
import User from '../../models/User'

const roles = new RoleSystem()

const role = {
    roles,
    async getRoleMiddleware(req, res, next) {
        if (req.user) {
            const user = await User.findOne()
                .where('username')
                .equals(req.user.username)
                .select('roles')
                .cache(60, 'USER-ROLE-' + req.user.username)
            req.user.perm = roles.createPermChecker(user.roles)
            next()
        } else {
            next()
        }
    },
    perm(resource, params) {
        const middleware = (verb, action, type) => {
            return (req, res, next) => {
                if (req.user.perm(resource, params)[verb](action, type)) {
                    next()
                } else {
                    const err = new Error('권한이 없습니다.')
                    err.status = 403
                    throw err
                }
            }
        }

        return {
            can(action, type) {
                return middleware('can', action, type)
            },
            canOwn(action, type) {
                return middleware('canOwn', action, type)
            },
            canAny(action, type) {
                return middleware('canAny', action, type)
            },
            cannot(action, type) {
                return middleware('cannot', action, type)
            },
            cannotAny(action, type) {
                return middleware('cannotAny', action, type)
            },
            cannotOwn(action, type) {
                return middleware('cannotOwn', action, type)
            },
        }
    },
    async getRoleNames() {
        return roles.roleNames()
    },
    async createRole({ name }) {
        let newtag
        do {
            newtag = (await random(0x100, 0x99999)).toString(16)
        } while (roles.hasRole(newtag))

        roles.setRole({ tag: newtag, name, perm: {} })
        const newrole = roles.export(newtag)

        const newroledoc = RoleModel({
            tag: newtag,
            name: newrole.name,
            perm: newrole.perm,
        })
        await newroledoc.save()

        return newrole
    },
    async loadRoles() {
        const roleobjs = await RoleModel.find()
        roleobjs.forEach(role => {
            roles.setRole({
                tag: role.tag,
                name: role.name,
                perm: role.perm,
            })
        })
        setDefaultRole(roles)
        setAdminRole(roles)
    },
}

module.exports = role
