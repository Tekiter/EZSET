//socket io to Attendance
export const io = undefined

export async function initSocket(app, SOCKET_PORT) {
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)

    //Attendance State
    var curState = {
        flag: false,
    }
    //connect event
    io.on('connection', function(socket) {
        socket.on('join', function(data) {
            socket.join(data.roomName)
            io.to('attendance').emit('attendance', curState)
        })
        //attendance event lisner
        socket.on('attendance', function(data) {
            curState.flag = data.flag
            var msg = {
                flag: data.flag,
            }
            //broadcast changed state
            io.to('attendance').emit('attendance', msg)
        })
        //setTimeout 3m when attendance start
        socket.on('start', function(data) {
            setTimeout(function() {
                if (curState.flag == true) {
                    var msg = {
                        flag: false,
                    }
                    curState.flag = false
                    socket.broadcast.to('attendance').emit('attendance', msg)
                }
            }, 300000)
        })
    })
    //start socket.io server
    server.listen(SOCKET_PORT, function() {
        console.log(`[socket io] server listening on port ${SOCKET_PORT}`) // eslint-disable-line no-console
    })
}
