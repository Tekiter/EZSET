import mongoose from 'mongoose'

const roleSchema = new mongoose.Schema({
    name: { type: String, trim: true },
})

export default mongoose.model('role', roleSchema)
