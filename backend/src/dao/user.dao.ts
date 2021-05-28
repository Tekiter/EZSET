import User, { UserDocument } from '../models/User'

export interface UserData {
    username: string
    password_hash: string
    info: {
        realname: string
        email: string
    }
}

export class UserDAO {
    static async getUserByUsername(
        username: string
    ): Promise<UserDocument | null> {
        return await User.findOne({ username: username }).exec()
    }
    static async isUserExists(username: string): Promise<boolean> {
        return (await User.count({ username: username }).exec()) > 0
    }

    static async createUser(userData: UserData): Promise<UserDocument> {
        // return await User.create(userData)
        const user = new User(userData)
        return await user.save()
    }

    static async deleteUser(username: string): Promise<void> {
        await User.deleteOne({ username: username }).exec()
    }
}
