import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema

let boardSchema = new Schema({
    title: String,
    isAnonymous: {
        type: Boolean,
        default: false,
    },
})

boardSchema.plugin(autoIncrement.plugin, {
    model: 'board',
    startAt: 1,
})
module.exports = mongoose.model('board', boardSchema)
