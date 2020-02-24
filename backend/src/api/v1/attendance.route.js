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
var startUser = ''
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

        await AttendanceDay.findOneAndUpdate(
            {
                day: Date,
                'status.name': Name,
            },
            { 'status.$.state': 'attendance' },
            function(err, doc) {}
        )

        await AttendanceUser.findOneAndUpdate(
            {
                name: Name,
                'status.date': Date,
            },
            { 'status.$.state': 'attendance' },
            function(err, doc) {}
        )
        res.json({ result: 1 })
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

//출석 시작 후 관리자가 새로고침을 했을때 출석번호를 유지하기 위함
//Attendance 페이지에서 사용
router.get(
    '/attendanceCheckAdmin',
    [perm('attendance').can('update')],
    asyncRoute(async function(req, res) {
        if (startUser == req.user.username) res.json(ranNum)
        else res.json(0)
    })
)
//출석 종료 후 초기화
//Attendance 페이지에서 사용
router.post(
    '/attendanceCheckEnd',
    [perm('attendance').can('update')],
    asyncRoute(async function(req, res) {
        startUser = ''
        ranNum = -1
        res.end()
    })
)

//관리자가 시작버튼을 눌렀을경우 관리자는 출석상태 다른 모든 유저는 결석상태로 업데이트됨
//attendanceDays, attendanceUsers Collection에 시작버튼을 누른 관리자를 제외한 모두를 '결석'상태로 초기화한 Document가 생성됨
//Attendance 페이지에서 사용
router.post(
    '/startAttendance',
    [perm('attendance').can('update')],
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
            startUser = req.user.username
            res.json({ code: ranNum })
        } catch (err) {
            res.status(501).json()
        }
    })
)

//날짜를 param으로 받아와서 그 날짜에 해당하는 객체를 반환(그 날짜에 출석한 사람들의 정보가 모두 담겨 있음)
//param : day(String)
//AttendanceManageDay 페이지에서 사용
router.get(
    '/attendanceState/:day',
    [param('day').isString(), perm('attendance').can('update'), validateParams],
    asyncRoute(async function(req, res) {
        const cur = await AttendanceDay.findOne({
            day: req.params.day,
        }).select({ _id: 0, __v: 0, day: 0 })
        if (cur != null) res.json(cur)
        else res.status(404).json()
    })
)

//AttendanceManageDay 페이지에서 사용자의 출석정보를 변경하면 db에 업데이트 시켜준다.
//body : state(String), name(String)
//param : day(String)
//AttendanceManageDay 페이지에서 사용
router.post(
    '/attendancestateupdate/:day',
    [
        perm('attendance').can('update'),
        param('day').isString(),
        body('state').isString(),
        body('name').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var Day = req.params.day

        await AttendanceDay.findOneAndUpdate(
            {
                day: Day,
                'status.name': req.body.name,
            },
            { 'status.$.state': req.body.state },
            function(err, doc) {}
        )

        await AttendanceUser.findOneAndUpdate(
            {
                name: req.body.name,
                'status.date': Day,
            },
            { 'status.$.state': req.body.state },
            function(err, doc) {}
        )
        res.end()
    })
)

//users Collection에서 모든 사용자를 가져옴
//AttendnaceManageDay 페이지에서 사용
router.get(
    '/attendanceUserList',
    [perm('attendance').can('update')],
    asyncRoute(async function(req, res) {
        const userList = await User.find().select('username')
        res.json(userList)
    })
)

//attendanceDay Collection에서 모든 정보를 가져옴
//AttendanceManageMonth페이지에서 사용
router.get(
    '/attendanceDayList',
    [perm('attendance').can('update')],
    asyncRoute(async function(req, res) {
        const attendnaceDayList = await AttendanceDay.find()
        res.json(attendnaceDayList)
    })
)

//attendanceUser Collection에서 모든 정보를 가져옴
// AttendanceManageMonth페이지에서 사용
router.get(
    '/attendanceUserListData',
    [perm('attendance').can('update')],
    asyncRoute(async function(req, res) {
        const attendnaceUser = await AttendanceUser.find()
        res.json(attendnaceUser)
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
    '/attendanceNUserData',
    [perm('attendance').can('update'), body('day').isString(), validateParams],
    asyncRoute(async function(req, res) {
        const result = []
        const Users = await User.find().select('username')
        const attendanceDay = await AttendanceDay.findOne()
            .where('day')
            .equals(req.body.day)
            .select({ _id: 0, __v: 0, day: 0 })
        if (attendanceDay != null) {
            Users.forEach(element => {
                if (
                    attendanceDay.status.filter(function(e) {
                        return e.name === element.username
                    }).length == 0
                )
                    result.push(element.username)
            })
            res.json(result)
        } else res.status(404).json()
    })
)

// manage/user
// 출석 대상인 유저들을 가져옴
router.get(
    '/manage/user',
    [perm('attendance').can('update'), validateParams],
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
    [perm('attendance').can('update'), body('users').isArray(), validateParams],
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
    [
        perm('attendance').can('update'),
        param('username').custom(checkUsername),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)
        user.attable = false
        await user.save()

        res.end()
    })
)

// 출석 대상이 아닌 사용자의 출석기록 추가
// addUsersRecords
// body : users
router.put(
    '/addUsersRecords',
    [
        perm('attendance').can('update'),
        body('users').isArray(),
        body('day').isString(),
        validateParams,
    ],
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

        for (let user of req.body.users) {
            const cursor_Day = await AttendanceDay.findOne()
                .where('day')
                .equals(req.body.day)
            if (cursor_Day) cursor_Day.addStatus(user, 'absence')

            const cursor_User = await AttendanceUser.findOne()
                .where('name')
                .equals(user)

            if (!cursor_User) {
                var attendanceUser = new AttendanceUser()
                attendanceUser.name = user
                attendanceUser.addStatus(req.body.day, 'absence')
            } else {
                cursor_User.addStatus(req.body.day, 'absence')
            }
        }
        res.end()
    })
)
export default router
