var mongoose = require('mongoose')
var Schema = mongoose.Schema

var attendanceDaySchema = new Schema({
    attendance_date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('attendanceDay', attendanceDaySchema)
