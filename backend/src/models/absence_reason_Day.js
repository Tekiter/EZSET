var mongoose = require('mongoose')
var Schema = mongoose.Schema

const absence_DaySchema = new mongoose.Schema({
    name: {
        type: String,
    },
    reason: {
        type: String,
    },
    approval: {
        type: String,
    },
})
const absenceDay = mongoose.model('absenceday', absence_DaySchema)

var absenceDaySchema = new Schema({
    Date: {
        type: String,
    },
    reasons: [absence_DaySchema],
})

absenceDaySchema.methods.addReason = function(name, reason, approval) {
    this.reasons.push(
        new absenceDay({
            name,
            reason,
            approval,
        })
    )
    return this.save()
}

module.exports = mongoose.model('absence_reason_Day', absenceDaySchema)
