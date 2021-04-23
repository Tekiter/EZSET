import mongoose from 'mongoose'
import autoIncerment from 'mongoose-auto-increment'
import auth from '../utils/auth'

export interface UserDocument extends mongoose.Document {
    username: string
    password_hash: string
    info: any
    roles: Array<string>
    attable: boolean
    timestamp: Date
    seq: number
}

export interface UserModel extends mongoose.Model<UserDocument> {
    checkPassword(password: string): boolean
}

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
    .get(function(this: UserDocument) {
        return this.password_hash
    })
    .set(function(this: UserDocument, value: string) {
        this.password_hash = auth.hashPassword(value)
    })

userSchema.methods.checkPassword = function(password: string) {
    return auth.checkPassword(password, this.password_hash)
}

userSchema.plugin(autoIncerment.plugin, {
    model: 'User',
    field: 'seq',
})

export default mongoose.model<UserDocument, UserModel>('User', userSchema)
