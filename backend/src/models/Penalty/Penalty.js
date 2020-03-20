import mongoose from 'mongoose'

const penaltySchema = new mongoose.Schema({
    type_id: {
        type: String,
        index: true,
    },
    type: {
        type: String,
        trim: true,
    },
    username: {
        type: String,
        trim: true,
    },
    date: {
        type: Date,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
})

export default mongoose.model('penalty', penaltySchema)