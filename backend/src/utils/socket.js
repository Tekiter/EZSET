//socket io to Attendance

export const io = undefined

export async function initSocket(app, SOCKET_PORT) {
    const server = require('http').createServer(app)
    const io = require('socket.io')(server)

    //Attendance State
    var curState = {
        flag: false,
        output_attendance_code: '',
    }

    //connect event
    io.on('connection', function(socket) {
        socket.on('join', function(data) {
            socket.join(data.roomName)
            // console.log(
            //     '[socket.io] ' +
            //     socket.id +
            //     'user join conneted room : ' +
            //     data.roomName
            // )
        })
        //disconnect event
        socket.on('disconnect', () => {
            // console.log('[socket.io] ' + socket.id + 'user disconnected')
        })
        //attendance event lisner
        socket.on('attendance', function(data) {
            curState.flag = data.flag
            curState.output_attendance_code = data.output_attendance_code
            if (curState.flag == true)
                if (curState.flag == false)
                    // console.log(
                    //     '[socket.io] Attendance start : ' +
                    //     curState.output_attendance_code
                    // )
                    // console.log('[socket.io] Attendance end')
                    var rtnMessage = {
                        flag: data.flag,
                        output_attendance_code: data.output_attendance_code,
                    }
            //broadcast changed state
            socket.broadcast.to('attendance').emit('attendance', rtnMessage)
        })
        //connect after attendance start
        setInterval(function() {
            if (curState.flag == true) {
                socket.to('attendance').emit('attendance', curState)
            }
        }, 1000)
    })
    //start socket.io server
    server.listen(SOCKET_PORT, function() {
        //console.log(`[socket io] server listening on port ${SOCKET_PORT}`)
    })
}
