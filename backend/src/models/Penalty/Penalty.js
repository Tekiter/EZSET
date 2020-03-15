import mongoose from 'mongoose'

const penaltySchema = new mongoose.Schema({
    type: {
        type: String,
    },
    username: {
        type: String,
    },
    date: {
        type: Date,
    },
    description: {
        type: String,
    },
})

export default mongoose.model('penalty', penaltySchema)