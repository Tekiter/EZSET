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

//Attendance State
var curState = {
    flag: false,
    output_attendance_code: ''
}

//connect event
io.on('connection', function(socket) {
        socket.on('join', function(data) {
            socket.join(data.roomName)
            console.log('[socket.io] ' + socket.id + 'user join conneted room : ' + data.roomName);
        });
        //disconnect event
        socket.on('disconnect', () => {
            console.log('[socket.io] ' + socket.id + 'user disconnected');
        });
        //attendance event lisner
        socket.on('attendance', function(data) {
            curState.flag = data.flag
            curState.output_attendance_code = data.output_attendance_code
            if (curState.flag == true) console.log('[socket.io] Attendance start : ' + curState.output_attendance_code);
            if (curState.flag == false) console.log('[socket.io] Attendance end');
            var rtnMessage = {
                flag: data.flag,
                output_attendance_code: data.output_attendance_code
            };
            //broadcast changed state
            socket.broadcast.to('attendance').emit('attendance', rtnMessage);
        });
        //connect after attendance start
        setInterval(function() {
            if (curState.flag == true) {
                socket.to('attendance').emit('attendance', curState);
            }
        }, 1000)
    })
    //start socket.io server
server.listen(3001, function() {
    console.log('[socket io] server listening on port 3001')
})

export default app