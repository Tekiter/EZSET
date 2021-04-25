"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const api_1 = require("../../utils/api");
const Schedule_1 = __importDefault(require("../../models/Schedule"));
const role_1 = require("../../utils/role");
//import { param, body } from 'express-validator'
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
const router = express_1.default();
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
router.get('/read', [role_1.perm('schedule').can('read')], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const schedule = yield Schedule_1.default.find();
        res.json(schedule);
    });
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
router.post('/write', [
    role_1.perm('schedule').can('update'),
    express_validator_1.body('dayList').isArray(),
    express_validator_1.body('title').isString(),
    express_validator_1.body('content').isString(),
    express_validator_1.body('color').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var dayArray = req.body.dayList.sort();
        //날짜 배열을 기준으로 순회하면서 저장
        var schedule = new Schedule_1.default();
        for (var k in dayArray) {
            if (k == 0) {
                schedule.title = req.body.title;
                schedule.content = req.body.content;
                schedule.color = req.body.color;
                schedule.start = dayArray[0];
                schedule.end = dayArray[0];
                if (1 == req.body.dayList.length)
                    schedule.save();
                continue;
            }
            if (moment_1.default(schedule.end)
                .add(1, 'days')
                .format('YYYY-MM-DD') ==
                moment_1.default(req.body.dayList[k]).format('YYYY-MM-DD')) {
                schedule.end = dayArray[k];
            }
            else {
                yield schedule.save();
                schedule = new Schedule_1.default();
                schedule.title = req.body.title;
                schedule.content = req.body.content;
                schedule.color = req.body.color;
                schedule.start = dayArray[k];
                schedule.end = dayArray[k];
            }
            if (k == req.body.dayList.length - 1) {
                yield schedule.save();
            }
        }
        res.end();
    });
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
router.post('/delete', [
    role_1.perm('schedule').can('update'),
    express_validator_1.body('start').isString(),
    express_validator_1.body('end').isString(),
    express_validator_1.body('title').isString(),
    express_validator_1.body('content').isString(),
    express_validator_1.body('color').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Schedule_1.default.deleteOne({
            start: req.body.start,
            end: req.body.end,
            title: req.body.title,
            content: req.body.content,
            color: req.body.color,
        });
        res.end();
    });
}));
exports.default = router;
//# sourceMappingURL=schedule.route.js.map