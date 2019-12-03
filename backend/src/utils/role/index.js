import RoleModel from '../../models/Role'
import { RoleSystem } from '../../libs/role'
import random from 'random-number-csprng'

const roles = new RoleSystem()

const role = {
    roles,
    async getRoleMiddleware(req, res, next) {
        if (req.user) {
            next()
        } else {
            next()
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
    },
}

module.exports = role
