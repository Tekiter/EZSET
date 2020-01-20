var mongoose = require('mongoose')
var Schema = mongoose.Schema

const absence_UserSchema = new mongoose.Schema({
    days: {
        type: String,
    },
    reason: {
        type: String,
    },
    approval: {
        type: String,
    },
})
const absenceUser = mongoose.model('absenceuser', absence_UserSchema)

var absenceUserSchema = new Schema({
    name: {
        type: String,
    },
    reasons: [absence_UserSchema],
})

absenceUserSchema.methods.addReason = function(days, reason, approval) {
    this.reasons.push(
        new absenceUser({
            days,
            reason,
            approval,
        })
    )
    return this.save()
}

module.exports = mongoose.model('absence_reason_User', absenceUserSchema)
