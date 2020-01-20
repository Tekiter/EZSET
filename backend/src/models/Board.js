import mongoose from 'mongoose'
import autoIncrement from 'mongoose-auto-increment'
const Schema = mongoose.Schema

let boardSchema = new Schema({
    title: String,
})

boardSchema.plugin(autoIncrement.plugin, 'board')
module.exports = mongoose.model('board', boardSchema)
