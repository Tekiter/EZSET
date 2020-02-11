var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ScheduleSchema = new Schema({
    start: {
        type: Date,
    },
    end: {
        type: Date,
    },
    type: {
        type: String,
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
