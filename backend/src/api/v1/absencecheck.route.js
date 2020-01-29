import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import OfficialAbsence from '../../models/officialAbsenceReason'
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
export default router
