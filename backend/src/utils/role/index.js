import random from 'random-number-csprng'

import ac from './access'
import roleDatabase from './database'
import defaultRoles from './default'

import Role from '../../models/Role'

// const roleNamesCache = {}

// function getRoleNames(rolenums) {
//     return Promise.all(
//         [...rolenums].map(async rolenum => {
//             if (roleNamesCache.rolenum) {
//                 return roleNamesCache.rolenum
//             } else {
//                 const role = await Role.findById(rolenum)
//                 roleNamesCache[rolenum] = role.name
//                 return role.name
//             }
//         })
//     )
// }

// function convertRoleNames(rolenums) {
//     return [...rolenums].map(rolenum => `perm_${rolenum}`)
// }

const role = {
    async initialize() {
        const roles = await roleDatabase.loadRoles()
        ac.setGrants({
            ...defaultRoles,
            ...roles,
        })
        // console.log(ac.getGrants())
    },
    async createRole(name, extend = 'user') {
        let newtag
        do {
            newtag = await random(1, 0x1000)
        } while (ac.hasRole(newtag))
        dbrole = new Role({
            tag: newtag.toString(16),
            name: name,
            extend: extend,
        })
        await dbrole.save()
        ac.grant(newtag).extend(extend)
    },

    async getPermission(req, res, next) {
        const user = req.user

        // const roles = convertRoleNames(user.roles)

        req.permission = ac.can(user.roles)

        next()
    },
}

module.exports = role
