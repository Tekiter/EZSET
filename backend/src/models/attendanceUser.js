var mongoose = require('mongoose')
var Schema = mongoose.Schema

const statusSchema = new mongoose.Schema({
    date: {
        type: String,
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

attendanceUserSchema.methods.addStatusSchema = function(date, state) {
    this.status.push(new statusSchema({ date, state }))
    return this.save()
}

module.exports = mongoose.model('attendanceUser', attendanceUserSchema)
