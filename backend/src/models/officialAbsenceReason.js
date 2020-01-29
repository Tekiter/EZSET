var mongoose = require('mongoose')
var Schema = mongoose.Schema

var officialAbsenceSchema = new Schema({
    name: {
        type: String,
    },
    day: {
        type: String,
    },
    reason: {
        type: String,
    },
    approval: {
        type: String,
    },
})

module.exports = mongoose.model('officialabsencereason', officialAbsenceSchema)
