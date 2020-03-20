'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _officialAbsenceReason = require('../../models/officialAbsenceReason');

var _officialAbsenceReason2 = _interopRequireDefault(_officialAbsenceReason);

var _role = require('../../utils/role');

var _user = require('../../utils/user');

var _expressValidator = require('express-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express2.default)();
var moment = require('moment');

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
router.post('/absenceBook', [(0, _role.perm)('absence').canOwn('create'), (0, _expressValidator.body)('dayList').isArray(), (0, _expressValidator.body)('Reason').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    var Name = req.user.username;
    var Reason = req.body.Reason;
    var dayList = req.body.dayList;
    var approval = false;
    try {
        //백에서 list안의 원소를 각 날짜별로 결석 내용 저장 officialabsencereason
        for (var k in dayList) {
            var cursor = new _officialAbsenceReason2.default();
            cursor.name = Name;
            cursor.day = dayList[k];
            cursor.reason = Reason;
            cursor.approval = approval;
            cursor.save();
        }
        res.json(200);
    } catch (err) {
        res.status(501).json(err);
    }
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
router.get('/absenceUserData', [(0, _role.perm)('attendance').canOwn('read')], (0, _api.asyncRoute)(async function (req, res) {
    try {
        const officialAbsence = await _officialAbsenceReason2.default.find().where('name').equals(req.user.username);
        res.json(officialAbsence);
    } catch (err) {
        res.status(501).json();
    }
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
router.get('/absenceUsersData/:day', [(0, _role.perm)('absence').canOwn('read'), (0, _expressValidator.param)('day').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    try {
        const officialAbsence = await _officialAbsenceReason2.default.find().where('day').equals(req.params.day);
        res.status(200).json(officialAbsence);
    } catch (err) {
        res.status(501).json();
    }
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
router.post('/deleteAbsenceUser', [(0, _role.perm)('absence').canOwn('delete'), (0, _expressValidator.body)('reason').isString(), (0, _expressValidator.body)('day').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    try {
        await _officialAbsenceReason2.default.deleteOne({
            name: req.user.username,
            reason: req.body.reason,
            day: req.body.day
        });
        res.status(200).json();
    } catch (err) {
        res.status(501).json();
    }
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
router.get('/officialAbsenceList', [(0, _role.perm)('absence').can('update'), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    try {
        const cursor_No = await _officialAbsenceReason2.default.find({
            day: { $gte: moment().format('YYYY-MM-DD') },
            approval: false
        }).sort({ name: 1 });
        const cursor_Yes = await _officialAbsenceReason2.default.find({
            day: { $gte: moment().format('YYYY-MM-DD') },
            approval: true
        }).sort({ name: 1 });

        const convertAb = async curlist => {
            const newlist = [];
            for (let cur of curlist) {
                newlist.push({
                    name: cur.name,
                    realname: await (0, _user.getRealname)(cur.name),
                    day: cur.day,
                    reason: cur.reason,
                    approval: cur.approval
                });
            }
            return newlist;
        };

        res.json({
            noanswer: await convertAb(cursor_No),
            yesanswer: await convertAb(cursor_Yes)
        });
    } catch (err) {
        res.status(501).json();
    }
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
router.post('/officialAbsenceAccept', [(0, _role.perm)('absence').can('update'), (0, _expressValidator.body)('name').isString(), (0, _expressValidator.body)('day').isString(), (0, _expressValidator.body)('approval').isBoolean(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    try {
        const cursor = await _officialAbsenceReason2.default.findOneAndUpdate({
            name: req.body.name,
            day: req.body.day
        }, { approval: req.body.approval }, function (err, doc) {});
        res.json(cursor);
    } catch (err) {
        res.status(501).json();
    }
}));

exports.default = router;
//# sourceMappingURL=absencecheck.route.js.map