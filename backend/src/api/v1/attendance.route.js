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

/**
 * @api {post} /attendance/attendanceWrite/ 출석 요청
 * @apiDescription 사용자가 자신이 입력한 코드로 출석요청을 보냄. 서버에서 생성한 출석코드와 일치한다면 출석 처리
 * @apiName attendanceWrite
 * @apiGroup AttendanceCheck
 * @apiPermission can.att
 *
 * @apiParam {Number} code 사용자가 입력한 출석번호
 * @apiParamExample {post} Request-Example:
 *      {
 *          "code":129
 *      }
 * @apiSuccess {Number} 1 서버가 생성한 번호와 사용자가 입력한 번호가 일치함.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *           "result":1
 *      }
 * @apiSuccess {Number} 0 서버가 생성한 번호와 사용자가 입력한 번호가 일치하지 않음.
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *      {
 *          "result":0
 *      }
 *
 * @apiError {Number} 404 게시물 제목 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404 Not Found
 *       {
 *          "error": "제목오류"
 *        }
 */
router.post(
    '/attendanceWrite', [perm('attendance').can('att')],
    asyncRoute(async function(req, res) {
        if (ranNum != req.body.code) {
            res.json({
                message: 'wrongCode!',
                result: 0,
            })
        }
        var Date = moment().format('YYYYMMDD')
        var Name = req.user.username

        await AttendanceDay.findOneAndUpdate({
                day: Date,
                'status.name': Name,
            }, { 'status.$.state': 'attendance' },
            function(err, doc) {}
        )

        await AttendanceUser.findOneAndUpdate({
                name: Name,
                'status.date': Date,
            }, { 'status.$.state': 'attendance' },
            function(err, doc) {}
        )
        res.json({ result: 1 })
    })
)

/**
 * @api {get} /attendance/attendanceCheck/ 출석유무 체크
 * @apiDescription 현재 날짜에 사용자의 출석 상태가 `attendance`상태인지 체크
 * @apiName attendanceCheck
 * @apiGroup AttendanceCheck
 * @apiPermission can.att
 *
 * @apiSuccess {Number} 1 당일 사용자의 출석상태가 `출석` 상태임.
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *           1
 *      }
 * @apiSuccess {Number} 0 당일 사용자의 출석상태가 `출석` 상태가 아님.
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *      {
 *          0
 *      }
 */
router.get(
    '/attendanceCheck', [perm('attendance').can('att')],
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

/**
 * @api {get} /attendance/attendanceCheckAdmin/ 서버 출석 코드 전송
 * @apiName attendanceCheckAdmin
 * @apiDescription 출석을 시작한 관리자가 출석 진행중에 페이지를 새로고침 했을 때 서버에서 생성한 출석 코드를 전송
 * @apiGroup AttendanceCheck
 * @apiPermission can.att
 *
 * @apiSuccess {Number} ranNum 출석을 시작한 관리자의 요청일 경우
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *           129
 *      }
 * @apiSuccess {Number} 0 출석을 시작한 관리자의 요청이 아닐 경우
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *      {
 *          0
 *      }
 */

router.get(
    '/attendanceCheckAdmin', [perm('attendance').can('att')],
    asyncRoute(async function(req, res) {
        if (startUser == req.user.username) res.json(ranNum)
        else res.json(0)
    })
)

/**
 * @api {post} /attendance/attendanceCheckEnd/ 출석 종료
 * @apiName attendanceCheckEnd
 * @apiDescription 출석 종료시 서버에서 생성했던 출석 코드(ranNum)와 출석시작했던 관리자 아이디(startUser) 값을 초기화
 * @apiGroup AttendanceCheck
 * @apiPermission can.att
 *
 * @apiSuccess {Number} 200 정상 처리되었을 경우
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *
 */
router.post(
    '/attendanceCheckEnd', [perm('attendance').can('att')],
    asyncRoute(async function(req, res) {
        startUser = ''
        ranNum = -1
        res.end()
    })
)

/**
 * @api {post} /attendance/startAttendance/ 출석 시작
 * @apiName startAttendance
 * @apiDescription 출석시작버튼을 눌렀을경우 관리자는 출석상태로 다른 모든 유저는 결석상태로 업데이트함
 * @apiGroup AttendanceCheck
 * @apiPermission can.start
 *
 * @apiSuccess {Number} ranNum 서버에서 생성한 3자리 출석코드 반환
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          "code": ranNum
 *      }
 *
 */
router.post(
    '/startAttendance', [perm('attendance').can('start')],
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

/**
 * @api {get} /attendanceState/:day 일별 출석현황 반환
 * @apiDescription 특정 일자의 출석현황을 반환
 * @apiName attendanceState
 * @apiGroup AttendanceCheck
 * @apiPermission can.read
 *
 * @apiParam {String} day 반환하고 싶은 날짜, YYYYMMDD 형태
 * @apiParamExample {get} Request-Example:
 *      {
 *         "day":"20200304"
 *      }
 * @apiSuccess {Object} status 해당 일자의 출결 정보 객체
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *           {
 *               "status": [
 *                           {
 *                           "_id": "5e5f4886c785712d2c55b022",
 *                            "name": "admin",
 *                            "state": "attendance"
 *                          },
 *                           {
 *                            "_id": "5e5f4886c785712d2c55b026",
 *                            "name": "user0001",
 *                            "state": "attendance"
 *                          },
 *                          {
 *                            "_id": "5e5f4886c785712d2c55b02a",
 *                            "name": "user0002",
 *                            "state": "attendance"
 *                          },
 *                        ]
 *            }
 * @apiError {Number} 404 해당 일자에 출결정보 없음
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 404 Not Found
 */
router.get(
    '/attendanceState/:day', [param('day').isString(), perm('attendance').can('read'), validateParams],
    asyncRoute(async function(req, res) {
        const cur = await AttendanceDay.findOne({
            day: req.params.day,
        }).select({ _id: 0, __v: 0, day: 0 })
        if (cur != null) res.json(cur)
        else res.status(404).json()
    })
)

/**
 * @api {post} /attendancestateupdate/:day 출석 상태 업데이트
 * @apiDescription <code>day</code>날짜에 <code>name</code>이라는 아이디를 가진 사용자의 출석 상태를 <code>state</code>로 업데이트
 * @apiName attendancestateupdate
 * @apiGroup AttendanceCheck
 * @apiPermission can.read
 *
 * @apiParam {String} day 업데이트할 날짜, YYYYMMDD 형태
 * @apiParam {String} state 업데이트할 상태 (<code>attendance</code>,<code>absence</code>,<code>late</code>,<code>offical_absence</code>)중 하나
 * @apiParam {String} name 업데이트할 사용자 아이디
 * @apiParamExample {json} Request-Example:
 *      {
 *          "day":"20200304",
 *          "state":"late",
 *          "name":"hschoi1104"
 *      }
 * @apiSuccess {Object} object 바꾼 상태의 객체 반환
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          체크해보기
 *      }
 */
router.post(
    '/attendancestateupdate/:day', [
        perm('attendance').can('read'),
        param('day').isString(),
        body('state').isString(),
        body('name').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var Day = req.params.day

        const cur = await AttendanceDay.findOneAndUpdate({
                day: Day,
                'status.name': req.body.name,
            }, { 'status.$.state': req.body.state },
            function(err, doc) {}
        )
        res.json(cur)
        const cur_user = await AttendanceUser.findOneAndUpdate({
                name: req.body.name,
                'status.date': Day,
            }, { 'status.$.state': req.body.state },
            function(err, doc) {}
        )
        res.json(cur_user)
    })
)

/**
 * @api {get} /attendance/attendanceUserList/ 사용자 리스트 반환
 * @apiDescription 전체 사용자 리스트를 반환
 * @apiName attendanceUserList
 * @apiGroup AttendanceCheck
 * @apiPermission can.read
 *
 * @apiSuccess {Array} data 전체 사용자정보 객체 배열
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *          {
 *              [
 *                    {
 *                       "_id": "5e1ff2fc39c8d12194bd55f4",
 *                       "username": "admin"
 *                   },
 *                   {
 *                      "_id": "5e1ff395b7ee260ffc203de2",
 *                      "username": "user0001"
 *                   },
 *                   {
 *                      "_id": "5e1ff3b3b7ee260ffc203de3",
 *                      "username": "user0002"
 *                   },
 *               ]
 *          }
 */
router.get(
    '/attendanceUserList', [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        const userList = await User.find().select('username')
        res.json(userList)
    })
)

/**
 * @api {get} /attendance/attendanceDayList/ 전체 일별 출결현황 반환
 * @apiDescription 전체 일별 출결현황 반환
 * @apiName attendanceDayList
 * @apiGroup AttendanceCheck
 * @apiPermission can.read
 *
 * @apiSuccess {Array} data 전체 일별 출결현황 객체 배열
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  [
 *  {
 *    "_id": "5e1ff40db7ee260ffc203de5",
 *    "status": [
 *      {
 *        "_id": "5e1ff40db7ee260ffc203de6",
 *        "name": "admin",
 *        "state": "late"
 *      },
 *      {
 *        "_id": "5e1ff40db7ee260ffc203deb",
 *        "name": "user0001",
 *        "state": "attendance"
 *      },
 *      {
 *        "_id": "5e1ff40db7ee260ffc203df0",
 *        "name": "user0002",
 *        "state": "attendance"
 *      }
 *    ],
 *    "day": "20200115",
 *    "__v": 2
 *  },
 *  {
 *    "_id": "5e1ff480b7ee260ffc203df6",
 *    "status": [
 *      {
 *        "_id": "5e1ff480b7ee260ffc203df7",
 *        "name": "admin",
 *        "state": "attendance"
 *      },
 *      {
 *        "_id": "5e1ff480b7ee260ffc203dfb",
 *        "name": "user0001",
 *        "state": "official_absence"
 *      },
 *      {
 *        "_id": "5e1ff480b7ee260ffc203dff",
 *        "name": "user0002",
 *        "state": "attendance"
 *      },
 *      {
 *        "_id": "5e3bec45e9ce0e0968a5e781",
 *        "name": "user0004",
 *        "state": "absence"
 *      }
 *    ],
 *    "day": "20200116",
 *    "__v": 3
 *  },
 * ]
 *}
 */
router.get(
    '/attendanceDayList', [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        const attendnaceDayList = await AttendanceDay.find()
        res.json(attendnaceDayList)
    })
)

/**
 * @api {get} /attendance/attendanceUserListData/ 사용자별 출결현황 반환
 * @apiDescription 사용자별 출결현황 반환
 * @apiName attendanceUserListData
 * @apiGroup AttendanceCheck
 * @apiPermission can.read
 *
 * @apiSuccess {Object} data 전체 사용자별 출결현황 객체 배열
 *
 * @apiSuccessExample {json} Success-Response:
 * HTTP/1.1 200 OK
 * [
 *  {
 *    "_id": "5e1ff40db7ee260ffc203de8",
 *    "status": [
 *      {
 *        "_id": "5e1ff40db7ee260ffc203de9",
 *        "date": "20200115",
 *        "state": "late"
 *      },
 *      {
 *        "_id": "5e1ff480b7ee260ffc203df9",
 *        "date": "20200116",
 *        "state": "attendance"
 *      },
 *    ],
 *    "name": "admin",
 *    "__v": 27
 *  },
 *  {
 *    "_id": "5e1ff40db7ee260ffc203ded",
 *    "status": [
 *      {
 *        "_id": "5e1ff40db7ee260ffc203dee",
 *        "date": "20200115",
 *        "state": "attendance"
 *      },
 *      {
 *        "_id": "5e1ff480b7ee260ffc203dfd",
 *        "date": "20200116",
 *        "state": "official_absence"
 *      },
 *    ],
 *    "name": "user0001",
 *    "__v": 27
 *  },
 *]
 */
router.get(
    '/attendanceUserListData', [perm('attendance').can('read')],
    asyncRoute(async function(req, res) {
        const attendnaceUser = await AttendanceUser.find()
        res.json(attendnaceUser)
    })
)

//attendanceUser Collection에서 현재 접속중인 사용자의 정보만 가져옴
// AttendanceManageMonthUser페이지에서 사용
router.get(
    '/attendanceUserData', [perm('attendance').canOwn('read')],
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
    '/attendanceNUserData', [perm('attendance').can('read'), body('day').isString(), validateParams],
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
    '/manage/user', [validateParams],
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
    '/manage/user', [body('users').isArray(), validateParams],
    asyncRoute(async(req, res) => {
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
    '/manage/user/:username', [param('username').custom(checkUsername), validateParams],
    asyncRoute(async(req, res) => {
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
    '/addUsersRecords', [
        perm('attendance').can('update'),
        body('users').isArray(),
        body('day').isString(),
        validateParams,
    ],
    asyncRoute(async(req, res) => {
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