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
            newtag = await random(1, 0xffff)
        } while (ac.hasRole(newtag))
        newtag = newtag.toString(16)
        ac.grant(newtag)
        ac.extendRole(newtag, extend)

        const dbrole = new Role({
            tag: newtag,
            name: name,
            extend: extend,
        })
        await dbrole.save()
    },
    async getRoles() {
        const roletags = ac.getRoles()

        // const result = []

        const result = await Promise.all(
            roletags.map(async tag => {
                let name = tag
                if (!Object.keys(defaultRoles).includes(tag)) {
                    const roledata = await Role.findOne()
                        .where('tag')
                        .equals(tag)
                    name = roledata.name
                }

                return {
                    tag,
                    name,
                }
            })
        )

        return result
    },
    async getPermission(req, res, next) {
        try {
            const user = req.user

            // const roles = convertRoleNames(user.roles)

            if (!user.roles) {
                user.roles = ['user']
            }

            req.permission = ac.can(user.roles)

            next()
        } catch (err) {
            res.status(500).json({ message: 'unexpected error' })
        }
    },
}

module.exports = role
export default role
