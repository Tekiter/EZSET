var mongoose = require('mongoose')
var Schema = mongoose.Schema

const statusSchema = new mongoose.Schema({
    name: {
        type: String,
    },
    state: {
        type: String,
    },
})

var attendanceDaySchema = new Schema({
    day: {
        type: String,
    },
    status: [statusSchema],
})

attendanceDaySchema.methods.addStatus = function(name, state) {
    // this.status.push(new statusSchema({ name, state }))
    return this.save()
}
module.exports = mongoose.model('attendanceDay', attendanceDaySchema)
