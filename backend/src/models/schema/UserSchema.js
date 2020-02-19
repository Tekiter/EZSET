import mongoose from 'mongoose'
import auth from '../../utils/auth'

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
        type: mongoose.Schema.Types.Mixed,
        default: {},
    },
    roles: {
        type: [String],
    },

    // 출석 대상 유저인지 표시
    attable: {
        type: Boolean,
        default: true,
    },

    timestamp: {
        type: Date,
        default: Date.now,
    },
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

export default userSchema
