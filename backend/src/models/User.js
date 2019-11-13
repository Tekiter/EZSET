import mongoose from 'mongoose'
import autoIncerment from 'mongoose-auto-increment'
import auth from '../utils/auth'

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true,
    },
    password_hash: {
        type: String,
        required: true,
    },
    info: {
        realname: {
            type: String,
            trim: true,
        },
    },
    roles: { type: [String] },
})

userSchema
    .virtual('password')
    .get(function() {
        return this.password_hash
    })
    .set(function(value) {
        this.password_hash = auth.hashPassword(value)
    })

userSchema.methods.checkPassword = function(password) {
    return auth.checkPassword(password, this.password_hash)
}

userSchema.plugin(autoIncerment.plugin, {
    model: 'User',
    field: 'seq',
})
export default mongoose.model('User', userSchema)
