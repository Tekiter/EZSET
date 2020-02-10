var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ScheduleSchema = new Schema({
    day: {
        type: String,
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
})

module.exports = mongoose.model('schedule', ScheduleSchema)
