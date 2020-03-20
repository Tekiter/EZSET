'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _Schedule = require('../../models/Schedule');

var _Schedule2 = _interopRequireDefault(_Schedule);

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var moment = require('moment');
//import { param, body } from 'express-validator'

const router = (0, _express2.default)();

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
router.get('/read', [(0, _role.perm)('schedule').can('read')], (0, _api.asyncRoute)(async function (req, res) {
    const schedule = await _Schedule2.default.find();
    res.json(schedule);
}));

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
router.post('/write', [(0, _role.perm)('schedule').can('update'), (0, _expressValidator.body)('dayList').isArray(), (0, _expressValidator.body)('title').isString(), (0, _expressValidator.body)('content').isString(), (0, _expressValidator.body)('color').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    var dayArray = req.body.dayList.sort();
    //날짜 배열을 기준으로 순회하면서 저장
    var schedule = new _Schedule2.default();
    for (var k in dayArray) {
        if (k == 0) {
            schedule.title = req.body.title;
            schedule.content = req.body.content;
            schedule.color = req.body.color;
            schedule.start = dayArray[0];
            schedule.end = dayArray[0];
            if (1 == req.body.dayList.length) schedule.save();
            continue;
        }
        if (moment(schedule.end).add(1, 'days').format('YYYY-MM-DD') == moment(req.body.dayList[k]).format('YYYY-MM-DD')) {
            schedule.end = dayArray[k];
        } else {
            await schedule.save();
            schedule = new _Schedule2.default();
            schedule.title = req.body.title;
            schedule.content = req.body.content;
            schedule.color = req.body.color;
            schedule.start = dayArray[k];
            schedule.end = dayArray[k];
        }
        if (k == req.body.dayList.length - 1) {
            await schedule.save();
        }
    }
    res.end();
}));

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
router.post('/delete', [(0, _role.perm)('schedule').can('update'), (0, _expressValidator.body)('start').isString(), (0, _expressValidator.body)('end').isString(), (0, _expressValidator.body)('title').isString(), (0, _expressValidator.body)('content').isString(), (0, _expressValidator.body)('color').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    await _Schedule2.default.deleteOne({
        start: req.body.start,
        end: req.body.end,
        title: req.body.title,
        content: req.body.content,
        color: req.body.color
    });
    res.end();
}));

exports.default = router;
//# sourceMappingURL=schedule.route.js.map