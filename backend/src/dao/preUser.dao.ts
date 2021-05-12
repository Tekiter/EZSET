import PreUser, { PreUserDocument } from '../models/PreUser'
import { UserData } from './user.dao'

export class PreUserDAO {
    static async getPreUserByUsername(
        username: string
    ): Promise<PreUserDocument | null> {
        return await PreUser.findOne({ username: username }).exec()
    }

    static async isUserExists(username: string): Promise<boolean> {
        return (await PreUser.count({ username: username }).exec()) > 0
    }

    static async createPreUser(userData: UserData): Promise<PreUserDocument> {
        return await PreUser.create(userData)
    }
}
