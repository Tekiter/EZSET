import { UserDAO } from 'src/dao/user.dao'
import { checkPassword, createAccessToken } from 'src/utils/auth'

interface AuthRequest {
    username: string
    password: string
}

interface AuthInfoFail {
    success: false
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
            return { success: false }
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
