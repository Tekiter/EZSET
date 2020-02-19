import mongoose from 'mongoose'
import autoIncerment from 'mongoose-auto-increment'
import userSchema from './schema/UserSchema'

userSchema.plugin(autoIncerment.plugin, {
    model: 'User',
    field: 'seq',
})

export default mongoose.model('User', userSchema)
