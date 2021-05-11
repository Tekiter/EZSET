import PreUser, { PreUserDocument } from '../models/PreUser'

export class PreUserDAO {
    static async getPreUserByUsername(
        username: string
    ): Promise<PreUserDocument | null> {
        return await PreUser.findOne({ username: username }).exec()
    }
}
