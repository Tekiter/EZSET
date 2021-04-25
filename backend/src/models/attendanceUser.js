import mongoose from 'mongoose'
var Schema = mongoose.Schema

const datestatusSchema = new mongoose.Schema({
    date: {
        type: String,
    },
    state: {
        type: String,
    },
})
const DateStatus = mongoose.model('dateStatus', datestatusSchema)

var attendanceUserSchema = new Schema({
    name: {
        type: String,
    },
    status: [datestatusSchema],
})

attendanceUserSchema.methods.addStatus = function(date, state) {
    this.status.push(
        new DateStatus({
            date,
            state,
        })
    )
    return this.save()
}

module.exports = mongoose.model('attendanceUser', attendanceUserSchema)
