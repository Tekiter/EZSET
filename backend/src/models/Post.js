import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema

let postSchema = new Schema({
    board: {
        type: Number,
        ref: 'board',
    },
    title: {
        type: String,
        required: [true, 'post title required'],
    },
    content: {
        type: String,
        required: [true, 'post title required'],
    },
    author: {
        type: String,
        required: [true, 'post writer required'],
    },
})

postSchema.plugin(autoIncrement.plugin, 'post')
module.exports = mongoose.model('post', postSchema)
