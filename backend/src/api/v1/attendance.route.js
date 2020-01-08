import Router from 'express'
import { asyncRoute } from '../../utils/api'
import random from 'random-number-csprng'
import User from '../../models/User'

const AttendanceDay = require('../../models/AttendanceDay')
const AttendanceUser = require('../../models/AttendanceUser')
const router = Router()
var moment = require('moment')
var ranNum = random(100, 999)

//state,name
router.post(
    '/attendanceWrite',
    asyncRoute(async function(req, res) {
        if (ranNum != req.body.code) {
            res.json({
                message: 'wrongCode!',
                result: 0,
            })
        }
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username
        try {
            var cursor_Day = await AttendanceDay.findOne()
                .where('day')
                .equals(Date)
            if (!cursor_Day) {
                var attendanceDay = new AttendanceDay()
                attendanceDay.day = Date
                attendanceDay.addStatus(Name, req.body.state)
            } else {
                cursor_Day.addStatus(Name, req.body.state)
            }
        } catch (err) {
            res.status(501).json(err)
        }
        try {
            var cursor_User = await AttendanceUser.findOne()
                .where('name')
                .equals(Name)
            if (!cursor_User) {
                var attendanceUser = new AttendanceUser()
                attendanceUser.name = Name
                attendanceUser.addStatus(Date, req.body.state)
                res.json({ result: 1 })
            } else {
                cursor_User.addStatus(Date, req.body.state)
                res.json({ result: 1 })
            }
        } catch (err) {
            res.status(501).json(err)
        }
    })
)

router.get(
    '/attendanceCheck',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username
        try {
            const cursor = await AttendanceDay.find({
                day: Date,
                'status.name': Name,
            })
            if (cursor != '') {
                res.json(1)
            } else {
                res.json(0)
            }
        } catch (err) {
            res.status(501).json(err)
        }
    })
)

//관리자가 시작버튼을 눌렀을경우
//관리자는 출석상태 다른 모든 유저는 결석상태로 업데이트됨
router.get(
    '/startAttendance',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        //get Userlist in User collection
        const userList = await User.find().select('username')
        //create db - AttendanceDay
        var attendanceDay = new AttendanceDay()
        attendanceDay.day = Date
        for (var k in userList) {
            var cursor_Day = await AttendanceDay.findOne()
                .where('day')
                .equals(Date)

            var state = 'absence'
            if (req.user.username == userList[k].username) state = 'attendance'
            if (!cursor_Day) {
                var attendanceDay = new AttendanceDay()
                attendanceDay.day = Date
                attendanceDay.addStatus(userList[k].username, state)
            } else {
                cursor_Day.addStatus(userList[k].username, state)
            }
            //create db - AttendanceUser
            var cursor_User = await AttendanceUser.findOne()
                .where('name')
                .equals(userList[k].username)

            state = 'absence'
            if (req.user.username == userList[k].username) state = 'attendance'
            if (!cursor_User) {
                var attendanceUser = new AttendanceUser()
                attendanceUser.name = userList[k].username
                attendanceUser.addStatus(Date, state)
            } else {
                cursor_User.addStatus(Date, state)
            }
        }
        //Generate Code
        try {
            ranNum = await random(100, 999)
            res.json({ code: ranNum })
        } catch (err) {
            res.status(501).json
        }
    })
)

router.get(
    '/attendanceState/:day',
    asyncRoute(async function(req, res) {
        var Day = req.params.day
        try {
            const cur = await AttendanceDay.find({
                day: Day,
            })
            res.json(cur)
        } catch (err) {
            res.status(501).json
        }
    })
)
export default router
