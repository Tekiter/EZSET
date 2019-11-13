import random from 'random-number-csprng'
import config from '../utils/config'
import User from '../models/User'
import role from '../utils/role'

const initialization = {
    async createSuperAdmin() {
        const exists = User.findOne()
            .where('username')
            .equals('admin')
        if (exists) {
            console.log('Removing existing admin account...') // eslint-disable-line no-console
            await exists.remove()
        }

        const rndNum = await random(11111, 99999)
        const admin = new User({
            username: 'admin',
            password: 'admin_' + rndNum,
        })
        const result = await admin.save()
        config.setConfig('superAdmin', result.username)

        console.log(`Superadmin created (admin/admin_${rndNum})`) // eslint-disable-line no-console
    },
    async initialize() {
        const isFirstStart = !(await config.configAvailable())
        if (isFirstStart) {
            console.log('Initialization detected.') // eslint-disable-line no-console
            await initialization.createSuperAdmin()

            config.setConfig('groupName', 'EZSET')
        }

        await role.initialize()
    },
}

module.exports.default = initialization
module.exports = initialization
