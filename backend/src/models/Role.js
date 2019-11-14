import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const roleSchema = new mongoose.Schema({
    tag: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    extend: { type: [String], default: ['user'] },
    permissions: { type: mongoose.Schema.Types.Mixed, default: {} },
})

roleSchema.plugin(autoIncrement.plugin, {
    model: 'role',
    startAt: 0,
})
export default mongoose.model('role', roleSchema)
