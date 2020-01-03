var mongoose = require('mongoose')
var Schema = mongoose.Schema

const statusSchema = new mongoose.Schema({
    date: {
        type: Date,
    },
    state: {
        type: String,
    },
})

var attendanceUserSchema = new Schema({
    name: {
        type: String,
    },
    status: [statusSchema],
})

module.exports = mongoose.model('attendanceUser', attendanceUserSchema)
