import mongoose from 'mongoose'
import userSchema from './schema/UserSchema'

export default mongoose.model('User', userSchema)
