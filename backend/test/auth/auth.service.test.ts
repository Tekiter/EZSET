import dotenv from 'dotenv'
import { initialize } from '../../src/utils/database'

import { AuthService } from '../../src/service/auth.service'
import { UserService } from '../../src/service/user.service'
import { checkToken } from '../../src/utils/auth'

const TEST_USERNAME = 'testuser1'
const TEST_PASSWORD = 'testpassword1'

dotenv.config()
beforeAll(async () => {
    await initialize(process.env.DATABASE_URI + '')
    if (await UserService.isDuplicateUsername('testuser')) {
        await UserService.deleteUser('')
    }
    await UserService.createUser({
        username: TEST_USERNAME,
        password: TEST_PASSWORD,
        email: 'abc@abc.com',
        realname: 'realname',
    })
})

afterAll(async () => {
    await UserService.deleteUser(TEST_USERNAME)
})

describe('Create Auth Token', () => {
    it('should success on correct username/password', async () => {
        const res = await AuthService.createAuthToken({
            username: TEST_USERNAME,
            password: TEST_PASSWORD,
        })
        expect(res.success).toBeTruthy()
        if (res.success) {
            const token = await checkToken(res.token)
            expect(token.username).toBe(TEST_USERNAME)
        }
    })

    it('should fail on invalid username', async () => {
        const res = await AuthService.createAuthToken({
            username: 'a',
            password: 'zzzzzzzz',
        })
        expect(res.success).toBeFalsy()
    })

    it('should fail on invalid password', async () => {
        const res = await AuthService.createAuthToken({
            username: TEST_USERNAME,
            password: 'zzzzzzzz',
        })
        expect(res.success).toBeFalsy()
    })
})
