import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import OfficialAbsence from '../../models/officialAbsenceReason'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
const router = Router()
var moment = require('moment')

//사용자가 결석예약 일들을 선택하면 프론트에서 list 형태로 백에 전달
router.post(
    '/absenceBook',
    [validateParams],
    asyncRoute(async function(req, res) {
        var Name = req.user.username
        var Reason = req.body.Reason
        var dayList = req.body.dayList
        var approval = 'No'
        try {
            //백에서 list안의 원소를 각 날짜별로 결석 내용 저장 officialabsencereason
            for (var k in dayList) {
                var cursor = new OfficialAbsence()
                cursor.name = Name
                cursor.day = dayList[k]
                cursor.reason = Reason
                cursor.approval = approval
                cursor.save()
            }
            res.json(200)
        } catch (err) {
            res.status(501).json(err)
        }
    })
)

//officialAbsences Collection에서 자신의 공결 현황을 전부 가지고 옴
//AttendanceManagMonthUser 페이지에서 사용
router.get(
    '/absenceUserData',
    [perm('attendance').canOwn('read')],
    asyncRoute(async function(req, res) {
        try {
            const officialAbsence = await OfficialAbsence.find()
                .where('name')
                .equals(req.user.username)
            res.json(officialAbsence)
        } catch (err) {
            res.status(501).json()
        }
    })
)

//officialAbsences Collection에서 일 단위 공결 현황을 전부 가지고 옴
//param : day
//AttendanceManageDay 페이지에서 사용
router.get(
    '/absenceUsersData/:day',
    [perm('absence').canOwn('read'), param('day').isString(), validateParams],
    asyncRoute(async function(req, res) {
        try {
            const officialAbsence = await OfficialAbsence.find()
                .where('day')
                .equals(req.params.day)
            res.status(200).json(officialAbsence)
        } catch (err) {
            res.status(501).json()
        }
    })
)

//사용자의 공결 신청 내역 삭제
//body : reason
//AttendanceManagMonth 페이지에서 사용
router.post(
    '/deleteAbsenceUser',
    [
        perm('absence').canOwn('delete'),
        body('reason').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        try {
            await OfficialAbsence.deleteMany({
                name: req.user.username,
                reason: req.body.reason,
            })
            res.status(200).json()
        } catch (err) {
            res.status(501).json()
        }
    })
)

router.get(
    '/officialAbsenceList',
    asyncRoute(async function(req, res) {
        try {
            const cursor_No = await OfficialAbsence.find({
                day: { $gte: moment().format('YYYY-MM-DD') },
                approval: 'No',
            }).sort({ name: 1 })
            const cursor_Yes = await OfficialAbsence.find({
                day: { $gte: moment().format('YYYY-MM-DD') },
                approval: 'Yes',
            }).sort({ name: 1 })
            res.json({ noanswer: cursor_No, yesanswer: cursor_Yes })
        } catch (err) {
            res.status(501).json()
        }
    })
)

export default router
