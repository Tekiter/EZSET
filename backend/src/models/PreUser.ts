import mongoose from 'mongoose'
import userSchema from './schema/UserSchema'

import User, { UserDocument } from './User'

export type PreUserDocument = UserDocument

userSchema.methods.accept = async function() {
    const user = new User({
        username: this.username,
        password_hash: this.password_hash,
        info: this.info,
    })
    await user.save()
}

export default mongoose.model<PreUserDocument>('PreUser', userSchema)
