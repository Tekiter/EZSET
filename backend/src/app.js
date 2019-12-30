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
io.on('connection', function(socket) {
    console.log('Connect from Client: ' + socket.id)
    socket.on('attendance', function(data) {
        console.log('message from Client: ' + data.flag + " " + data.socket_id)
        var rtnMessage = {
            flag: data.flag,
            num: Math.floor(Math.random() * (999 - 100) + 100)
        };
        socket.broadcast.emit('attendance', rtnMessage);
    });
})
server.listen(3001, function() {
    console.log('socket io server listening on port 3001')
})

export default app