var mongoose = require('mongoose')
var Schema = mongoose.Schema

var officialAbsenceSchema = new Schema({
    name: {
        type: String,
    },
    day: {
        type: Date,
    },
    reason: {
        type: String,
    },
    approval: {
        type: String,
    },
})

module.exports = mongoose.model('officialabsencereason', officialAbsenceSchema)
