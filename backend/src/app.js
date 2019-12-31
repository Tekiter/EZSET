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
var curState = {
    flag: false,
    output_attendance_code: ''
}
io.on('connection', function(socket) {
    socket.emit('connection', curState);
    //console.log('[socket.io]Start Page: ' + socket.id + " " + curState.flag + " " + curState.output_attendance_code)
    socket.on('attendance', function(data) {
        //console.log('message from Client: ' + data.flag + " " + data.output_attendance_code)
        curState.flag = data.flag
        curState.output_attendance_code = data.output_attendance_code
            //console.log('message from Client: ' + curState.flag + " " + curState.Output_attendance_code)
        var rtnMessage = {
            flag: data.flag,
            output_attendance_code: data.output_attendance_code
        };
        socket.broadcast.emit('attendance', rtnMessage);
        //console.log("[socket.io]" + curState.flag);
    });
    setInterval(function() {
        if (curState.flag == true) {
            socket.emit('attendance', curState);
        }
    }, 2000)
})
server.listen(3001, function() {
    console.log('[socket io] server listening on port 3001')
})

export default app