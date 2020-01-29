import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import AbsenceReasonDay from '../../models/absenceReasonDay'
import AbsenceReasonUser from '../../models/absenceReasonUser'
//import { perm } from '../../utils/role'
//import { param, body } from 'express-validator'
const router = Router()

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
            //백에서 list안의 원소를 각 날짜별로 결석 내용 저장 absence_reason_Day
            for (var k in dayList) {
                var cursor_Day = await AbsenceReasonDay.findOne()
                    .where('date')
                    .equals(dayList[k])
                if (!cursor_Day) {
                    var absenceBook_Day = new AbsenceReasonDay()
                    absenceBook_Day.date = dayList[k]
                    absenceBook_Day.addReason(Name, Reason, approval)
                } else {
                    cursor_Day.addReason(Name, Reason, approval)
                }
            }
            //백에서 list 형태를 모두 이어 string으로 만들어 absence_reason_User에 저장
            var cursor_User = await AbsenceReasonUser.findOne()
                .where('name')
                .equals(Name)
            if (!cursor_User) {
                var absenceBook_User = new AbsenceReasonUser()
                absenceBook_User.name = Name
                absenceBook_User.addReason(dayList, Reason, approval)
            } else {
                cursor_User.addReason(dayList, Reason, approval)
            }
            res.json(200)
        } catch (err) {
            res.status(501).json(err)
        }
    })
)
export default router
