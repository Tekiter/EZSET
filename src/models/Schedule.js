import mongoose from 'mongoose'
var Schema = mongoose.Schema

var ScheduleSchema = new Schema({
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    title: {
        type: String,
    },
    content: {
        type: String,
    },
    color: {
        type: String,
    },
})

module.exports = mongoose.model('schedule', ScheduleSchema)
