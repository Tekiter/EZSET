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
    permOr(callback) {
        return (req, res, next) => {
            console.log(callback(req.user.perm))
            if (callback(req.user.perm)) {
                next()
            } else {
                const err = new Error('권한이 없습니다.')
                err.status = 403
                throw err
            }
        }
    },
    async getRoleNames() {
        return roles.roleNames().sort((a, b) => a.name.localeCompare(b.name))
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
    async removeRole(roletag) {
        // db에 저장된 role 정보 가져오기
        const dbrole = await RoleModel.findOne()
            .where('tag')
            .equals(roletag)

        // 해당 role을 가진 모든 유저 가져오기
        const users = await User.find({ roles: roletag }).select(
            'username roles'
        )

        // 해당 role을 유저에서 제거
        for (let user of users) {
            const idx = user.roles.indexOf(roletag)
            if (idx < 0) {
                throw new Error('Remove role error')
            }
            user.roles.splice(idx, 1)
            await user.save()
        }

        // db에서 role 제거
        await dbrole.remove()

        // 메모리의 role 제거
        roles.removeRole(roletag)
    },
    async updateRole(roletag) {
        const dbrole = await RoleModel.findOne()
            .where('tag')
            .equals(roletag)

        const newrole = roles.export(roletag)
        dbrole.name = newrole.name
        dbrole.perm = newrole.perm

        await dbrole.save()
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
    async getUserRoles(username) {
        const user = await User.findOne()
            .where('username')
            .equals(username)
            .select('roles')
        return user.roles
    },
}

module.exports = role
