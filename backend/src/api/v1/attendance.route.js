import Router from 'express'
import { asyncRoute, validateParams, checkUsername } from '../../utils/api'
import random from 'random-number-csprng'
import User from '../../models/User'
import AttendanceDay from '../../models/attendanceDay'
import AttendanceUser from '../../models/attendanceUser'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
const router = Router()
var moment = require('moment')
var ranNum = random(100, 999)

//사용자가 출석코드를 입력했을 경우 서버에서 생성한 코드와 사용자 입력코드가 일치한다면 db에 출석상태로 업데이트
//body : code
//Attendance 페이지에서 사용
router.post(
    '/attendanceWrite',
    [perm('attendance').can('att')],
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
//Attendance 페이지에서 사용
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
//Attendance 페이지에서 사용
router.get(
    '/startAttendance',
    [perm('attendance').can('start')],
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        //get Userlist in User collection
        const userList = await User.find({
            attable: true,
        }).select('username')
        //create db - AttendanceDay
        var attendanceDay = new AttendanceDay()
        attendanceDay.day = Date

        const cnt = await AttendanceDay.find()
            .where('day')
            .equals(Date)
            .count()

        if (cnt == 0) {
            for (var k in userList) {
                var cursor_Day = await AttendanceDay.findOne()
                    .where('day')
                    .equals(Date)
                var state = 'absence'
                if (req.user.username == userList[k].username)
                    state = 'attendance'
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
                if (req.user.username == userList[k].username)
                    state = 'attendance'
                if (!cursor_User) {
                    var attendanceUser = new AttendanceUser()
                    attendanceUser.name = userList[k].username
                    attendanceUser.addStatus(Date, state)
                } else {
                    cursor_User.addStatus(Date, state)
                }
            }
        }
        //Generate Attendance Code and return
        try {
            ranNum = await random(100, 999)
            res.json({ code: ranNum })
        } catch (err) {
            res.status(501).json()
        }
    })
)

router.get(
    '/attendanceState/:day',
    [param('day').isString(), validateParams],
    asyncRoute(async function(req, res) {
        var Day = req.params.day
        try {
            const cur = await AttendanceDay.find({
                day: Day,
            }).select({ _id: 0, __v: 0, day: 0 })
            res.json(cur)
        } catch (err) {
            cres.status(501).json()
        }
    })
)

router.post(
    '/attendancestateupdate/:day',
    [
        perm('attendance').can('read'),
        param('day').isString(),
        body('state').isString(),
        body('name').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var Day = req.params.day
        try {
            const cur = await AttendanceDay.findOneAndUpdate(
                {
                    day: Day,
                    'status.name': req.body.name,
                },
                { 'status.$.state': req.body.state },
                function(err, doc) {}
            )
            res.json(cur)
            const cur_user = await AttendanceUser.findOneAndUpdate(
                {
                    name: req.body.name,
                    'status.date': Day,
                },
                { 'status.$.state': req.body.state },
                function(err, doc) {}
            )
            res.json(cur_user)
        } catch (err) {
            //console.log(err)
            res.status(501).json()
        }
    })
)

//users Collection에서 모든 사용자를 가져옴
//AttendnaceManageDay 페이지에서 사용
router.get(
    '/attendanceUserList',
    [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        try {
            const userList = await User.find().select('username')
            res.json(userList)
        } catch (err) {
            res.status(501).json()
        }
    })
)

//attendanceDay Collection에서 모든 정보를 가져옴
//AttendanceManageMonth페이지에서 사용
router.get(
    '/attendanceDayList',
    [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        try {
            const attendnaceDayList = await AttendanceDay.find()
            res.json(attendnaceDayList)
        } catch (err) {
            res.status(501).json()
        }
    })
)

//attendanceUser Collection에서 모든 정보를 가져옴
// AttendanceManageMonth페이지에서 사용
router.get(
    '/attendanceUserListData',
    [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        try {
            const attendnaceUser = await AttendanceUser.find()
            res.json(attendnaceUser)
        } catch (err) {
            res.status(501).json()
        }
    })
)

//attendanceUser Collection에서 현재 접속중인 사용자의 정보만 가져옴
// AttendanceManageMonthUser페이지에서 사용
router.get(
    '/attendanceUserData',
    [perm('attendance').canOwn('read')],
    asyncRoute(async function(req, res) {
        const attendnaceUser = await AttendanceUser.find()
            .where('name')
            .equals(req.user.username)
        res.json(attendnaceUser)
    })
)

//attendanceDay Collection에서 출석 정보가 없는 유저를 가져옴
// AttendanceManageDay 페이지에서사용
router.post(
    '/attendanceNUserData:day',
    [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        const reslut = ''
        const Users = await User.find()
        const attendnaceDay = await AttendanceDay.find()

        // Users.forEach(element => {
        //     if (!attendnaceDay.status.includes(element)) result.push('element')
        // })
        //console.log(attendnaceDay)
        res.json(attendnaceDay.status)
    })
)

// manage/user
// 출석 대상인 유저들을 가져옴
router.get(
    '/manage/user',
    [validateParams],
    asyncRoute(async function(req, res) {
        const users = await User.find()
            .where('attable')
            .equals(true)
            .sort('username')
            .select('username info')

        const excludedUsers = await User.find()
            .where('attable')
            .ne(true)
            .sort('username')
            .select('username info')

        res.json({
            attableUsers: users.map(user => {
                return {
                    username: user.username,
                    realname: user.info.realname,
                }
            }),
            excludedUsers: excludedUsers.map(user => {
                return {
                    username: user.username,
                    realname: user.info.realname,
                }
            }),
        })
    })
)

// manage/user
// 출석 대상인 유저들을 추가 등록
router.put(
    '/manage/user',
    [body('users').isArray(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            for (let user of req.body.users) {
                await checkUsername(user)
            }
        } catch (error) {
            const err = new Error('존재하지 않는 유저입니다.')
            err.status = 400
            throw err
        }

        for (let username of req.body.users) {
            const user = await User.findOne()
                .where('username')
                .equals(username)
            user.attable = true
            await user.save()
        }

        res.end()
    })
)

// manage/user/:username
// 출석 대상인 유저 삭제
router.delete(
    '/manage/user/:username',
    [param('username').custom(checkUsername), validateParams],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)
        user.attable = false
        await user.save()

        res.end()
    })
)

export default router
