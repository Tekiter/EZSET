import { configAvailable, setConfig, setDefaultConfigs } from '../utils/config'
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

        const admin = new User({
            username: 'admin',
            password: 'admin',
            info: {
                realname: '관리자',
            },
            roles: ['admin'],
        })
        const result = await admin.save()
        await setConfig('superAdmin', result.username)

        console.log(`Superadmin created (admin/admin)`) // eslint-disable-line no-console
    },
    async initialize() {
        const isFirstStart = !(await configAvailable())
        if (isFirstStart) {
            console.log('Initialization detected.') // eslint-disable-line no-console
            await initialization.createSuperAdmin()

            await setDefaultConfigs()
        }

        await role.loadRoles()
    },
}

module.exports.default = initialization
module.exports = initialization
