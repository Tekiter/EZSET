import express from 'express'
import path from 'path'
import logger from 'morgan'
import bodyParser from 'body-parser'

import v1API from './api/v1'

const app = express()
app.disable('x-powered-by')

app.use(
    logger('dev', {
        skip: () => app.get('env') === 'test',
    })
)
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(express.static(path.join(__dirname, '../public')))

app.use('/api/v1', v1API)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found')
    err.status = 404
    next(err)
})


// Error handler
app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    res.status(err.status || 500).json({
        message: err.message
    })
})


//socket io to Attendance
var server = require('http').createServer(app);
var io = require('socket.io')(server);
//connection event handler
var curFlag = false
var curOutput_attendance_code = ''
io.on('connection', function(socket) {
    var curState = {
        flag: this.curFlag,
        output_attendance_code: this.curOutput_attendance_code,
    }
    socket.emit('create', curState);
    console.log('[socket.io]Start Page: ' + socket.id + " " + curFlag + " " + curOutput_attendance_code)
    socket.on('attendance', function(data) {
        console.log('message from Client: ' + data.flag + " " + data.output_attendance_code)

        curFlag = data.flag
        curOutput_attendance_code = data.output_attendance_code
        console.log('message from Client: ' + curFlag + " " + curOutput_attendance_code)
        var rtnMessage = {
            flag: data.flag,
            output_attendance_code: data.output_attendance_code
        };
        socket.broadcast.emit('attendance', rtnMessage);
        console.log("[socket.io]" + curFlag);
    });
})
server.listen(3001, function() {
    console.log('[socket io] server listening on port 3001')
})

export default app