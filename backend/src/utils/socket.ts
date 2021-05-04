import express from 'express'
import http from 'http'
import sio from 'socket.io'
import { AttendanceDao } from './../dao/attendance.dao'
import moment from 'moment'
import User from './../models/User'

//socket io to Attendance
export const io = undefined

export async function initSocket(
    app: express.Express,
    SOCKET_PORT: string
): Promise<void> {
    const att = {
        flag: false,
        starter: '',
        time: 0,
        code: -404,
        list: new Set(),
    }
    const server = http.createServer(app)
    const io = sio(server, { origins: '*:*' })
    let timerID
    io.on('connection', function(socket) {
        socket.on('join', async function(data) {
            socket.join(data.roomName)

            io.to(socket.id).emit('init', {
                flag: att.flag,
                starter: att.starter,
                time: att.time,
                result: att.list.has(data.user),
            })
            io.to(socket.id).emit('health', true)
            if (att.flag == true && att.starter == data.user) {
                io.to(socket.id).emit('admin', {
                    code: att.code,
                })
            }
        })
        socket.on('check', async function(data) {
            if (att.code == data.code) {
                if (att.list.has(data.user) == true)
                    io.to(socket.id).emit('result', 'already')
                else {
                    att.list.add(data.user)
                    const user = await User.findOne({ username: data.user })
                    AttendanceDao.createAttendance(
                        data.user,
                        user!.info.realname,
                        'attendance',
                        moment().format('YYYY-MM-DD')
                    )
                    io.to(socket.id).emit('result', 'success')
                }
            } else {
                if (data.code == -1) {
                    if (att.list.has(data.user) == true)
                        io.to(socket.id).emit('result', 'already')
                    else io.to(socket.id).emit('result', 'prepare')
                } else io.to(socket.id).emit('result', 'fail')
            }
        })

        socket.on('start', async function(data) {
            try {
                const userlist = await AttendanceDao.getAttendanceByDate(
                    moment().format('YYYY-MM-DD')
                )

                const { code, starter } = data
                att.time = 180000
                att.code = code
                att.flag = true
                att.starter = starter
                att.list = new Set()

                userlist.forEach(user => {
                    if (user.state == 'attendance') att.list.add(user.username)
                })

                const user = await User.findOne({ username: starter })
                AttendanceDao.createAttendance(
                    starter,
                    user!.info.realname,
                    'attendance',
                    moment().format('YYYY-MM-DD')
                )

                io.to('attendance').emit('state', {
                    flag: true,
                    starter,
                })

                timerID = setInterval(async function() {
                    att.time -= 1000
                    if (att.time <= 0) {
                        att.time = 0
                        att.code = -404
                        att.flag = false
                        att.starter = ''
                        att.list = new Set()

                        io.to('attendance').emit('state', {
                            flag: false,
                            starter: null,
                        })
                        clearInterval(timerID)
                    }
                }, 1000)
            } catch (err) {
                console.log(err)
            }
        })

        socket.on('stop', async function() {
            try {
                clearInterval(timerID)
                io.to('attendance').emit('state', {
                    flag: false,
                    starter: null,
                })

                const userlist = await User.find({ attable: true })
                userlist.forEach(user => {
                    if (att.list.has(user.username) == false) {
                        AttendanceDao.createAttendance(
                            user.username,
                            user.info.realname,
                            'absence',
                            moment().format('YYYY-MM-DD')
                        )
                    }
                })
                att.time = 0
                att.code = -404
                att.flag = false
                att.starter = ''
                att.list = new Set()
            } catch (err) {
                console.log(err)
            }
        })
    })
    //start socket.io server
    server.listen(SOCKET_PORT, function() {
        console.log(`[socket io] server listening on port ${SOCKET_PORT}`) // eslint-disable-line no-console
    })
}
