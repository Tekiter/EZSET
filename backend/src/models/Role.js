import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'

const roleSchema = new mongoose.Schema({
    name: { type: String, trim: true },
    permissions: {},
})

roleSchema.plugin(autoIncrement.plugin, {
    model: 'role',
    startAt: 0,
})
export default mongoose.model('role', roleSchema)
