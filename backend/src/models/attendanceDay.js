var mongoose = require('mongoose')
var Schema = mongoose.Schema

const statusSchema = new mongoose.Schema({
    name: {
        type: Date,
    },
    state: {
        type: String,
    },
})

var attendanceDaySchema = new Schema({
    day: {
        type: Date,
    },
    status: [statusSchema],
})

module.exports = mongoose.model('attendanceDay', attendanceDaySchema)
