import mongoose from 'mongoose'
var Schema = mongoose.Schema

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    state: {
        type: String,
    },
})
const Status = mongoose.model('status', statusSchema)

var attendanceDaySchema = new Schema({
    day: {
        type: String,
        unique: true,
    },
    status: [statusSchema],
})

attendanceDaySchema.methods.addStatus = function(name, state) {
    this.status.push(
        new Status({
            name,
            state,
        })
    )
    return this.save()
}
module.exports = mongoose.model('attendanceDay', attendanceDaySchema)
