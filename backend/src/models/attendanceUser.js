var mongoose = require('mongoose')
var Schema = mongoose.Schema

var attendanceUserSchema = new Schema({
    attendance_date: {
        type: Date,
        default: Date.now,
    },
})

module.exports = mongoose.model('attendanceUser', attendanceUserSchema)
