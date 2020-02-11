import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import Schedule from '../../models/Schedule'
import { perm } from '../../utils/role'
//import { param, body } from 'express-validator'
import { body } from 'express-validator'
const router = Router()

//schedule Collection 에서 모든 일정을 가져옴
// schedule 페이지에서 사용
router.get(
    '/read',
    [perm('schedule').can('read')],
    asyncRoute(async function(req, res) {
        const schedule = await Schedule.find()
        res.json(schedule)
    })
)

//관리자가 일정을 추가함
//body : daylist(array), type(string), title(string), content(string), color(string)
// schedule 페이지에서 사용
router.post(
    '/write',
    [
        perm('schedule').can('create'),
        body('dayList').isArray(),
        body('type').isString(),
        body('title').isString(),
        body('content').isString(),
        body('color').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        //날짜 배열을 기준으로 순회하면서 저장
        for (var k in req.body.dayList) {
            var schedule = new Schedule()
            schedule.type = req.body.type
            ;(schedule.start = req.body.dayList[k].start),
                (schedule.end = req.body.dayList[k].end),
                (schedule.title = req.body.title)
            schedule.content = req.body.content
            schedule.color = req.body.color
            await schedule.save()
        }
        res.end()
    })
)

//관리자가 일정을 삭제함
//body : day(String), type(string), title(string), content(string), color(string)
// schedule 페이지에서 사용
router.post(
    '/delete',
    [
        perm('schedule').can('delete'),
        body('start').isString(),
        body('end').isString(),
        body('type').isString(),
        body('title').isString(),
        body('content').isString(),
        body('color').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await Schedule.deleteOne({
            start: req.body.start,
            end: req.body.end,
            type: teq.body.type,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
        })
        res.end()
    })
)

export default router
