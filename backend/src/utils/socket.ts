import express from 'express'
import http from 'http'
import sio from 'socket.io'

//socket io to Attendance
export const io = undefined

export async function initSocket(
    app: express.Express,
    SOCKET_PORT: string
): Promise<void> {
    const server = http.createServer(app)
    const io = sio(server, { origins: '*:*' })

    //Attendance State
    const curState = {
        flag: false,
        time: 180000,
    }
    //connect event
    io.on('connection', function(socket) {
        socket.on('join', function(data) {
            socket.join(data.roomName)
            io.to(socket.id).emit('attendance', curState)
        })
        //attendance event lisner
        socket.on('attendance', function(data) {
            curState.flag = data.flag
            if (!data.flag) curState.time = 18000
            const msg = {
                flag: data.flag,
                time: curState.time,
            }
            //broadcast changed state
            // socket.broadcast.to('attendance').emit('attendance', msg)
            io.to('attendance').emit('attendance', msg)
        })
        //setTimeout 3m when attendance start

        socket.on('start', function() {
            curState.time = 180000
            const timerID = setInterval(function() {
                if (curState.flag == false) {
                    clearInterval(timerID)
                    curState.time = 180000
                }
                curState.time -= 1000
                if (curState.time == 0) {
                    clearInterval(timerID)
                    if (curState.flag == true) {
                        const msg = {
                            flag: false,
                        }
                        curState.flag = false
                        io.to('attendance').emit('attendance', msg)
                    }
                }
            }, 1000)
        })
    })
    //start socket.io server
    server.listen(SOCKET_PORT, function() {
        console.log(`[socket io] server listening on port ${SOCKET_PORT}`) // eslint-disable-line no-console
    })
}
