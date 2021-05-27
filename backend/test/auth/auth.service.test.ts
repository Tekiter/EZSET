import dotenv from 'dotenv'
import { initialize } from '../../src/utils/database'

import { AuthService } from '../../src/service/auth.service'
import { checkToken } from '../../src/utils/auth'

dotenv.config()
beforeAll(async () => {
    await initialize(process.env.DATABASE_URI + '')
})

describe('Create Auth Token', () => {
    it('should success on correct username/password', async () => {
        const res = await AuthService.createAuthToken({
            username: 'admin',
            password: 'admin',
        })
        expect(res.success).toBeTruthy()
        if (res.success) {
            const token = await checkToken(res.token)
            expect(token.username).toBe('admin')
        }
    })

    it('should fail on invalid username/password', async () => {
        let res = await AuthService.createAuthToken({
            username: 'admin',
            password: 'zzzz',
        })
        expect(res.success).toBeFalsy()

        res = await AuthService.createAuthToken({ username: 'a', password: '' })
        expect(res.success).toBeFalsy()
    })
})
