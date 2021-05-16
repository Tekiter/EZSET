import { PreUserDAO } from '../dao/preUser.dao'
import { UserDAO } from '../dao/user.dao'
import { checkPassword, createAccessToken } from '../utils/auth'

interface AuthRequest {
    username: string
    password: string
}

type AuthFailReason = 'STATE_PREUSER' | 'INVALID'

interface AuthInfoFail {
    success: false
    reason: AuthFailReason
}

interface AuthInfoSuccess {
    success: true
    token: string
}

type AuthInfoResult = AuthInfoFail | AuthInfoSuccess

export class AuthService {
    static async createAuthToken(info: AuthRequest): Promise<AuthInfoResult> {
        const user = await UserDAO.getUserByUsername(info.username)
        if (
            user === null ||
            !checkPassword(info.password, user.password_hash)
        ) {
            const preuser = await PreUserDAO.getPreUserByUsername(info.username)
            if (preuser !== null) {
                return { success: false, reason: 'STATE_PREUSER' }
            }

            return { success: false, reason: 'INVALID' }
        }

        const token = await createAccessToken({
            username: user.username,
            roles: user.roles ?? [],
        })

        return {
            success: true,
            token: token,
        }
    }
}
