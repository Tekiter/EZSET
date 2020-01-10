import Router from 'express'
import { asyncRoute } from '../../utils/api'
import random from 'random-number-csprng'
import User from '../../models/User'
import AttendanceDay from '../../models/attendanceDay'
import AttendanceUser from '../../models/attendanceUser'
import { perm } from '../../utils/role'
const router = Router()
var moment = require('moment')
var ranNum = random(100, 999)

//사용자가 출석코드를 입력했을 경우 서버에서 생성한 코드와 사용자 입력코드가 일치한다면 db에 출석상태로 업데이트
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
            AttendanceDay.findOneAndUpdate(
                {
                    day: Date,
                    'status.name': Name,
                },
                { 'status.$.state': 'attendance' },
                function(err, doc) {}
            )
        } catch (err) {
            res.status(501).json(err)
        }
        try {
            AttendanceUser.findOneAndUpdate(
                {
                    name: Name,
                    'status.date': Date,
                },
                { 'status.$.state': 'attendance' },
                function(err, doc) {}
            )
            res.json({ result: 1 })
        } catch (err) {
            res.status(501).json(err)
        }
    })
)

//출석 후 다시 출석하기 페이지에 접근시 이미 출석했음을 체크하는 API
//출석을 했다면 1을 하지않았다면 0을 반환
router.get(
    '/attendanceCheck',
    [perm('attendance').can('att')],
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username
        try {
            const cursor = await AttendanceDay.find({
                day: Date,
                status: { $elemMatch: { name: Name, state: 'attendance' } },
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

//관리자가 시작버튼을 눌렀을경우 관리자는 출석상태 다른 모든 유저는 결석상태로 업데이트됨
//attendanceDays, attendanceUsers Collection에 시작버튼을 누른 관리자를 제외한 모두를 '결석'상태로 초기화한 Document가 생성됨
router.get(
    '/startAttendance',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        //get Userlist in User collection
        const userList = await User.find().select('username')
        // const id = await AttendanceDay.find({
        //         day: Date,
        //     }).select('_id')
        //console.log(id)
        //create db - AttendanceDay
        var attendanceDay = new AttendanceDay()
        attendanceDay.day = Date

        for (var k in userList) {
            //     var q = { _id: id, 'status.name': userList[k].username },
            //         update1 = {
            //             $addToSet: {
            //                 status: {
            //                     name: userList[k].username,
            //                     state: 'absence',
            //                 },
            //             },
            //         },
            //         options = { upsert: true }

            //     AttendanceDay.findOneAndUpdate(q, update1, options, function(
            //         err,
            //         res
            //     ) {
            //         console.log(err)
            //     })

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
        //Generate Attendance Code and return
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

router.put(
    '/attendanceStateUpdate/:day',
    asyncRoute(async function(req, res) {
        var Day = req.params.day
        try {
            const cur = await AttendanceDay.findOne({
                day: Day,
                Name: req.body.name,
            })
            cur.state = req.body.state
        } catch (err) {
            //console.log(err)
            res.status(501).json
        }
    })
)

router.get(
    '/attendanceUserList',
    asyncRoute(async function(req, res) {
        try {
            const userList = await User.find().select('username')
            res.json(userList)
        } catch (err) {
            //console.log(err)
            res.status(501).json
        }
    })
)
export default router
