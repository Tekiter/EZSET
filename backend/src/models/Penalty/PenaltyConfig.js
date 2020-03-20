import mongoose from 'mongoose'

const penaltyConfigSchema = new mongoose.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true,
    },
    value: {
        type: Number,
    },
})

export default mongoose.model('penaltyConfig', penaltyConfigSchema)
