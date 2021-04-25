import mongoose from 'mongoose'
const Schema = mongoose.Schema

const attendanceSchema  = new Schema({
    username: {
        type: String,
        required : true
    },
    realname: {
        type: String,
        required : true
    },
    date: {
        type: Date,
        required : true
    },
    state:{
        type: String,
        required : true
    }
})

module.exports = mongoose.model('attendance', attendanceSchema)
