import { configAvailable, setConfig, setDefaultConfigs } from '../utils/config'
import User from '../models/User'
import PenaltyConfig from '../models/Penalty/PenaltyConfig'
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
    async createDefaultPenalty() {
        console.log('Creating defalut penalty items...') // eslint-disable-line no-console
        const existLateConfig = await PenaltyConfig.findOne()
            .where('key')
            .equals('지각')
            .count()
        if (existLateConfig == 0) {
            const Late = new PenaltyConfig({
                key: '지각',
                value: -1,
            })
            await Late.save()
        }
        const existAbsenceConfig = await PenaltyConfig.findOne()
            .where('key')
            .equals('결석')
            .count()
        if (existAbsenceConfig == 0) {
            const Absence = new PenaltyConfig({
                key: '결석',
                value: -1,
            })
            await Absence.save()
        }
    },
    async initialize() {
        const isFirstStart = !(await configAvailable())
        if (isFirstStart) {
            console.log('Initialization detected.') // eslint-disable-line no-console
            await initialization.createSuperAdmin()

            await setDefaultConfigs()
        }
        await initialization.createDefaultPenalty()
        await role.loadRoles()
    },
}

export default initialization
