import assert from 'assert'
// import random from 'random-number-csprng'

import ac from './access'
import Role from '../../models/Role'
import defaultRoles from '../../utils/role/default'

const roledatabase = {
    async loadRoles() {
        const roles = await Role.find()

        const grantObj = {}

        roles.forEach(role => {
            const obj = {
                ...role.permissions,
            }

            // if (role.extend) {
            //     obj['$extend'] = role.extend
            // }
            grantObj[role.tag] = obj
        })

        return grantObj
    },
    async saveRoles() {
        const grantObj = ac.getGrants()
        const tags = Object.keys(grantObj)
        const excepts = Object.keys(defaultRoles)
        for (tag of tags) {
            if (excepts.includes(tag)) {
                continue
            }
            await roledatabase.saveRole(tag, grantObj[tag])
        }
    },
    async saveRole(tag, role) {
        let dbrole = await Role.findOne()
            .where('tag')
            .equals(tag)

        // if (!dbrole) {
        //     let newtag
        //     do {
        //         newtag = await random(1,0x1000)
        //     } while ((await Role.count().where('tag').equals(newtag)) == 0)
        //     dbrole = new Role({tag: newtag, name:name})
        // }

        assert(!!dbrole)

        dbrole.permissions = role
        await dbrole.save()
    },
}

// module.exports = roledatabase
// module.exports.default = roledatabase
export default roledatabase
