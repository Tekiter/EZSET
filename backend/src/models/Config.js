import mongoose from 'mongoose'

const configSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    value: {
        type: mongoose.Schema.Types.Mixed,
    },
})

export default mongoose.model('config', configSchema)
