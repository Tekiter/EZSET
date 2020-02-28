import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import Schedule from '../../models/Schedule'
import { perm } from '../../utils/role'
//import { param, body } from 'express-validator'
import { body } from 'express-validator'
var moment = require('moment')
const router = Router()

//schedule Collection 에서 모든 일정을 가져옴
// schedule 페이지에서 사용
router.get(
    '/read', [perm('schedule').can('read')],
    asyncRoute(async function(req, res) {
        const schedule = await Schedule.find()
        res.json(schedule)
    })
)

//관리자가 일정을 추가함
//body : daylist(array), type(string), title(string), content(string), color(string)
// schedule 페이지에서 사용
router.post(
    '/write', [
        perm('schedule').can('update'),
        body('dayList').isArray(),
        body('title').isString(),
        body('content').isString(),
        body('color').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var dayArray = req.body.dayList.sort()
            //날짜 배열을 기준으로 순회하면서 저장
        var schedule = new Schedule()
        for (var k in dayArray) {
            if (k == 0) {
                schedule.title = req.body.title
                schedule.content = req.body.content
                schedule.color = req.body.color
                schedule.start = dayArray[0]
                schedule.end = dayArray[0]
                if (1 == req.body.dayList.length) schedule.save()
                continue
            }
            if (
                moment(schedule.end)
                .add(1, 'days')
                .format('YYYY-MM-DD') ==
                moment(req.body.dayList[k]).format('YYYY-MM-DD')
            ) {
                schedule.end = dayArray[k]
            } else {
                await schedule.save()
                schedule = new Schedule()
                schedule.title = req.body.title
                schedule.content = req.body.content
                schedule.color = req.body.color
                schedule.start = dayArray[k]
                schedule.end = dayArray[k]
            }
            if (k == req.body.dayList.length - 1) {
                await schedule.save()
            }
        }
        res.end()
    })
)

//관리자가 일정을 삭제함
//body : day(String), type(string), title(string), content(string), color(string)
// schedule 페이지에서 사용
router.post(
    '/delete', [
        perm('schedule').can('update'),
        body('start').isString(),
        body('end').isString(),
        body('title').isString(),
        body('content').isString(),
        body('color').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await Schedule.deleteOne({
            start: req.body.start,
            end: req.body.end,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
        })
        res.end()
    })
)

export default router