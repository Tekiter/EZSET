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
        await UserDAO.createUser(form)
    }

    static async createPreUser(info: RegisterRequest): Promise<void> {
        const { username, password, realname, email } = info

        const form = {
            username: username,
            password_hash: hashPassword(password),
            info: {
                realname: realname,
                email: email,
            },
        }
        await PreUserDAO.createPreUser(form)
    }

    static async deleteUser(username: string): Promise<void> {
        await UserDAO.deleteUser(username)
    }

    static async isDuplicateUsername(username: string): Promise<boolean> {
        const userExists = await UserDAO.isUserExists(username)
        const preUserExists = await PreUserDAO.isUserExists(username)

        return userExists && preUserExists
    }
}
