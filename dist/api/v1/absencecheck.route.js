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
const officialAbsenceReason_1 = __importDefault(require("../../models/officialAbsenceReason"));
const role_1 = require("../../utils/role");
const user_1 = require("../../utils/user");
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
const router = express_1.default();
/**
 * @api {post} /absencecheck/absenceBook/ 공결예약
 * @apiDescription 사용자가 결석예약 날짜들을 선택하면 프론트에서 list 형태로 back에 전달하고 db에 해당 정보를 날짜별로 각각 저장한다.
 * @apiName BookedOfficialAbsence
 * @apiGroup OfficialAbsence
 * @apiPermission absence.canOwn'create')
 *
 * @apiParam {Array} dayList 공결이 예약된 날짜
 * @apiParam {String} Reason 공결 신청 사유
 *
 * @apiParamExample {json} Example usage:
 * {
 *  "dayList": [2020-03-02, 2020-03-05],
 *  "Reason": "가족여행"
 * }
 */
router.post('/absenceBook', [
    role_1.perm('absence').canOwn('create'),
    express_validator_1.body('dayList').isArray(),
    express_validator_1.body('Reason').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var Name = req.user.username;
        var Reason = req.body.Reason;
        var dayList = req.body.dayList;
        var approval = false;
        try {
            //백에서 list안의 원소를 각 날짜별로 결석 내용 저장 officialabsencereason
            for (var k in dayList) {
                var cursor = new officialAbsenceReason_1.default();
                cursor.name = Name;
                cursor.day = dayList[k];
                cursor.reason = Reason;
                cursor.approval = approval;
                cursor.save();
            }
            res.json(200);
        }
        catch (err) {
            res.status(501).json(err);
        }
    });
}));
//AttendanceManagMonthUser 페이지에서 사용
/**
 * @api {get} /absencecheck/absenceUserData/ 공결 현황
 * @apiDescription officialAbsences Collection에서 자신(로그인한 사용자)의 공결 현황을 전부 가지고 옴
 * @apiName OfficialAbsenceStates
 * @apiGroup OfficialAbsence
 * @apiPermission attendance.canOwn('read')
 *
 * @apiSuccess {object} object
 *
 * @apiSuccessExample {json} Request-Response:
 * [
 *  {
 *  "_id": "5e3a6d318368e4cbe88a52bc",
 * "name": "admin",
 * "day": "2020-02-12T00:00:00.000Z",
 * "reason": "여행",
 * "approval": true,
 * "__v": 0
 * }
 * ,
 * {
 * "_id": "5e61e45fa48a7b2d508566c0",
 * "name": "admin",
 * "day": "2020-03-06T00:00:00.000Z",
 * "reason": "코로나19로 인해 결석합니다",
 * "approval": false,
 * "__v": 0
 * }
 * ]
 */
router.get('/absenceUserData', [role_1.perm('attendance').canOwn('read')], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const officialAbsence = yield officialAbsenceReason_1.default.find()
                .where('name')
                .equals(req.user.username);
            res.json(officialAbsence);
        }
        catch (err) {
            res.status(501).json();
        }
    });
}));
//AttendanceManageDay 페이지에서 사용
/**
 * @api {get} /absencecheck/absenceUsersData/:day 일별공결현황
 * @apiDescription officialAbsences Collection에서 day에 해당되는 일 단위 공결 현황을 전부 가지고 옴
 * @apiName OfficialAbsenceDayStates
 * @apiGroup OfficialAbsence
 * @apiPermission absence.canOwn('read')
 *
 * @apiParam {String} day 출석한 날짜
 * @apiParamExample {json} Example usage:
 * {
 *  http://localhost:5000/api/v1/absencecheck/absenceusersdata/2020-03-06
 * }
 *
 * @apiSuccess {object} object
 *
 * @apiSuccessExample {json} Request-Response:
 * [
 * {
 *   "_id": "5e61e45fa48a7b2d508566c0",
 * "name": "admin",
 * "day": "2020-03-06T00:00:00.000Z",
 * "reason": "코로나19로 인해 결석합니다",
 * "approval": false,
 * "__v": 0
 * }
 * ]
 */
router.get('/absenceUsersData/:day', [role_1.perm('absence').canOwn('read'), express_validator_1.param('day').isString(), api_1.validateParams], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const officialAbsence = yield officialAbsenceReason_1.default.find()
                .where('day')
                .equals(req.params.day);
            res.status(200).json(officialAbsence);
        }
        catch (err) {
            res.status(501).json();
        }
    });
}));
//AttendanceManagMonthUser 페이지에서 사용
/**
 * @api {delete} /absencecheck/deleteAbsenceUser/ 공결 신청 취소
 * @apiDescription 사용자의 공결 신청 내역 삭제
 * @apiName DeleteOfficialAbsence
 * @apiGroup OfficialAbsence
 * @apiPermission absence.canOwn('delete')
 *
 * @apiParam {String} reason 공결 신청 사유
 * @apiParam {String} day 신청 날짜
 *
 * @apiParamExample {json} Request-Response:
 * {
 *  "reason": "가족여행",
 * "day": "2020-03-11"
 * }
 */
router.post('/deleteAbsenceUser', [
    role_1.perm('absence').canOwn('delete'),
    express_validator_1.body('reason').isString(),
    express_validator_1.body('day').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield officialAbsenceReason_1.default.deleteOne({
                name: req.user.username,
                reason: req.body.reason,
                day: req.body.day,
            });
            res.status(200).json();
        }
        catch (err) {
            res.status(501).json();
        }
    });
}));
//OfficialAbsenceAccept 페이지에서 사용
/**
 * @api {get} /absencecheck/officialAbsenceList 공결신청 리스트
 * @apiDescription 오늘날짜 이후의 공결신청 리스트 반환
 * @apiName OfficialAbsenceList
 * @apiGroup OfficialAbsence
 * @apiPermission absence.can('update')
 *
 *
 * @apiSuccess {array} noanswer 공결신청 승인 안 된 리스트
 * @apiSuccess {array} yesanswer 공결신청 승인 된 리스트
 *
 * @apiSuccessExample {json} Request-Response:
 * {
 * "noanswer":[
 * {"_id": "5e46479c9a8e6a2b403531d2", "name": "admin", "day": "2020-03-17T00:00:00.000Z",…},
 * {"_id": "5e46479c9a8e6a2b403531d3", "name": "admin", "day": "2020-03-19T00:00:00.000Z",…}
 * ],
 * yesanswer":[
 * {"_id": "5e61f4aa0ce72701e8f91a74", "name": "helloworld", "day": "2020-03-11T00:00:00.000Z",…}
 * ]
 * }
 */
router.get('/officialAbsenceList', [role_1.perm('absence').can('update'), api_1.validateParams], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cursor_No = yield officialAbsenceReason_1.default.find({
                day: { $gte: moment_1.default().format('YYYY-MM-DD') },
                approval: false,
            }).sort({ name: 1 });
            const cursor_Yes = yield officialAbsenceReason_1.default.find({
                day: { $gte: moment_1.default().format('YYYY-MM-DD') },
                approval: true,
            }).sort({ name: 1 });
            const convertAb = (curlist) => __awaiter(this, void 0, void 0, function* () {
                const newlist = [];
                for (let cur of curlist) {
                    newlist.push({
                        name: cur.name,
                        realname: yield user_1.getRealname(cur.name),
                        day: cur.day,
                        reason: cur.reason,
                        approval: cur.approval,
                    });
                }
                return newlist;
            });
            res.json({
                noanswer: yield convertAb(cursor_No),
                yesanswer: yield convertAb(cursor_Yes),
            });
        }
        catch (err) {
            res.status(501).json();
        }
    });
}));
//body : name(String), day(String), approval(Boolean)
//OfficialAbsenceAccept 페이지에서 사용
/**
 * @api {post} /absencecheck/deleteAbsenceUser/ 공결 승인, 승인 취소
 * @apiDescription 공결 승인된, 승인안된 내역 저장
 * @apiName OfficialAbsenceAccept
 * @apiGroup OfficialAbsence
 * @apiPermission absence.can('update')
 *
 * @apiParam {String} name 신청한사람
 * @apiParam {String} day 신청 날짜
 * @apiParam {Boolean} approval 승인여부(true일 경우 승인, false일 경우 승인안됨)
 *
 * @apiParamExample {json} Request-Response:
 * {
 *  "name": "admin",
 *  "day": "2020-03-11",
 *  "approval": true
 * }
 */
router.post('/officialAbsenceAccept', [
    role_1.perm('absence').can('update'),
    express_validator_1.body('name').isString(),
    express_validator_1.body('day').isString(),
    express_validator_1.body('approval').isBoolean(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const cursor = yield officialAbsenceReason_1.default.findOneAndUpdate({
                name: req.body.name,
                day: req.body.day,
            }, { approval: req.body.approval }, function (err, doc) { });
            res.json(cursor);
        }
        catch (err) {
            res.status(501).json();
        }
    });
}));
exports.default = router;
//# sourceMappingURL=absencecheck.route.js.map