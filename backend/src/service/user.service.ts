import { getConfig } from '../utils/config'
import { PreUserDAO } from '../dao/preUser.dao'
import { UserDAO } from '../dao/user.dao'
import { hashPassword } from '../utils/auth'

interface RegisterRequest {
    username: string
    password: string
    realname: string
    email: string
}

export class UserService {
    static async createUser(info: RegisterRequest): Promise<void> {
        const { username, password, realname, email } = info

        const form = {
            username: username,
            password_hash: hashPassword(password),
            info: {
                realname: realname,
                email: email,
            },
        }
        if ((await getConfig('usePreUser', false)) == true) {
            await PreUserDAO.createPreUser(form)
        } else {
            await UserDAO.createUser(form)
        }
    }

    static async isDuplicateUsername(username: string): Promise<boolean> {
        const userExists = await UserDAO.isUserExists(username)
        const preUserExists = await PreUserDAO.isUserExists(username)

        return userExists && preUserExists
    }
}
