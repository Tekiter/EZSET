import Router from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import Schedule from '../../models/Schedule'
import { perm } from '../../utils/role'
//import { param, body } from 'express-validator'
import { body } from 'express-validator'
var moment = require('moment')
const router = Router()

/**
 * @api {get} /schedule/read 일정 조회
 * @apiDescription schedule Collection 에서 모든 일정을 조회 한다.
 * @apiName read
 * @apiGroup schedule
 * @apiPermission schedule.can.read
 *
 * @apiSuccess {Array} array 일정 객체 배열을 반환한다.
 * @apiSuccess {String} title 일정 제목
 * @apiSuccess {String} content 일정 내용
 * @apiSuccess {String} color 일정 색상코드
 * @apiSuccess {String} start 일정 시작 날짜
 * @apiSuccess {String} end 일정 종료 날짜
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 *      {
 *          [
 *              {
 *                  "_id": "5e453f4400ee863e3c84f1ee",
 *                  "title": "스터디",
 *                  "content": "스터디",
 *                  "color": "#2196F3FF",
 *                  "start": "2020-02-26T00:00:00.000Z",
 *                  "end": "2020-02-26T00:00:00.000Z",
 *                  "__v": 0
 *                },
 *                {
 *                  "_id": "5e453f4400ee863e3c84f1ef",
 *                  "title": "스터디",
 *                  "content": "스터디",
 *                  "color": "#2196F3FF",
 *                  "start": "2020-02-28T00:00:00.000Z",
 *                  "end": "2020-02-28T00:00:00.000Z",
 *                  "__v": 0
 *                },
 *                {
 *                  "_id": "5e453f6900ee863e3c84f1f0",
 *                  "title": "Hash Code Online Qualification Round 2020",
 *                  "content": "Hash Code Online Qualification Round 2020",
 *                  "color": "#FFA726FF",
 *                  "start": "2020-02-21T00:00:00.000Z",
 *                  "end": "2020-02-21T00:00:00.000Z",
 *                  "__v": 0
 *               }
 *          ]
 *      }
 */
router.get(
    '/read', [perm('schedule').can('read')],
    asyncRoute(async function(req, res) {
        const schedule = await Schedule.find()
        res.json(schedule)
    })
)

/**
 * @api {post} /schedule/write 일정 추가
 * @apiDescription 일정을 추가한다. 연속된 날짜의 일정일 경우 <code>start</code>,<code>end</code>를 처리하여 하나의 일정으로 만들어 준다.
 * @apiName write
 * @apiGroup schedule
 * @apiPermission schedule.can.update
 *
 *
 * @apiParam {String} title 일정 제목
 * @apiParam {String} content 일정 내용
 * @apiParam {String} color 일정 색상
 * @apiParam {Array} dayList 날짜들을 담은 배열
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *          {
 * 	            "dayList":["2020-02-11","2020-02-14","2020-02-15","2020-02-19"],
 * 	            "title":"스터디",
 * 	            "content":"시니어 스터디",
 *              "color":"red"
 *          }
 *      }
 *
 *
 * @apiSuccess {Number} 200 종료 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 */
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
/**
 * @api {post} /schedule/delete 일정 삭제
 * @apiDescription 일정을 삭제한다.
 * @apiName delete
 * @apiGroup schedule
 * @apiPermission schedule.can.update
 *
 *
 * @apiParam {String} title 일정 제목
 * @apiParam {String} content 일정 내용
 * @apiParam {String} color 일정 색상
 * @apiParam {String} start 일정 시작 날짜
 * @apiParam {String} end 일정 종료 날짜
 *
 * @apiParamExample {json} Request-Example:
 *      {
 *         {
 *              "title": "Hash Code Online Qualification Round 2020",
 *              "content": "Hash Code Online Qualification Round 2020",
 *              "color": "#FFA726FF",
 *              "start": "2020-02-21",
 *              "end": "2020-02-21",
 *          }
 *      }
 *
 *
 * @apiSuccess {Number} 200 종료 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *       HTTP/1.1 200 OK
 */
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