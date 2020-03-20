'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _Penalty = require('../../models/Penalty/Penalty');

var _Penalty2 = _interopRequireDefault(_Penalty);

var _PenaltyConfig = require('../../models/Penalty/PenaltyConfig');

var _PenaltyConfig2 = _interopRequireDefault(_PenaltyConfig);

var _attendanceUser = require('../../models/attendanceUser');

var _attendanceUser2 = _interopRequireDefault(_attendanceUser);

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express2.default)();
var moment = require('moment');

/**
 * @api {get} /penalty/read/:username 상벌점 조회
 * @apiDescription 사용자의 상벌점 조회
 * @apiName penaltyRead
 * @apiGroup Penalty
 * @apiPermission penalty.can.read
 *
 * @apiParam {String} username 조회할 사용자의 아이디
 * @apiParam {String} start_date 기간 조회 시작 날짜
 * @apiParam {String} end_date 기간 조회 종료 날짜
 *
 * @apiSuccess {Array} - 사용자의 상벌점 항목을 배열로 반환
 * @apiSuccess {String} type 상벌점 항목의 타입
 * @apiSuccess {String} date 상벌점 항목이 기록된 날짜
 * @apiSuccess {String} description 상벌점 항목의 설명
 * @apiSuccess {Number} point 상벌점 항목의 점수
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          [{
 *              type:"지각",
 *              date:"2020-03-19",
 *              description:"지각",
 *              point:-1
 *          }]
 *      }
 */
router.get('/read/:username', [(0, _role.perm)('penalty').can('read'), (0, _expressValidator.param)('username').isString(), (0, _expressValidator.query)('start_date').isString(), (0, _expressValidator.query)('end_date').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    var result = [];
    var attendanceUser = await _attendanceUser2.default.findOne({
        name: req.params.username
    }).select({ _id: 0, __v: 0, name: 0 });

    var penaltyConfig = await _PenaltyConfig2.default.find();

    attendanceUser.status.forEach(element => {
        if (moment(element.date) >= moment(req.query.start_date) && moment(element.date) <= moment(req.query.end_date)) {
            if (element.state == 'late') {
                var Val = penaltyConfig.find((item, idx) => {
                    return item.key === '지각';
                });
                result.push({
                    username: req.params.username,
                    type: '지각',
                    date: moment(element.date).format('YYYY-MM-DD'),
                    description: '지각',
                    point: Val.value
                });
            }
            if (element.state == 'absence') {
                var val = penaltyConfig.find((item, idx) => {
                    return item.key === '결석';
                });
                result.push({
                    username: req.params.username,
                    type: '결석',
                    date: moment(element.date).format('YYYY-MM-DD'),
                    description: '결석',
                    point: val.value
                });
            }
        }
    });

    var penalty = await _Penalty2.default.find({
        username: req.params.username,
        date: {
            $gte: moment(req.query.start_date).format('YYYY-MM-DD'),
            $lte: moment(req.query.end_date).format('YYYY-MM-DD')
        }
    });

    penalty.forEach(element => {
        var val = penaltyConfig.find((item, idx) => {
            return item.key === element.type;
        });
        result.push({
            username: req.params.username,
            type: element.type,
            date: moment(element.date).format('YYYY-MM-DD'),
            description: element.description,
            point: val.value
        });
    });

    res.json(result);
}));

/**
 * @api {post} /penalty/write/ 상벌점 쓰기
 * @apiDescription 사용자의 상벌점 기록
 * @apiName penaltyWrite
 * @apiGroup Penalty
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} username 조회할 사용자의 아이디
 * @apiParam {String} type 상벌점 항목 타입
 * @apiParam {String} description 상벌점 항목 설명
 * @apiParam {String} date 상벌점 항목 부여 날짜
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          username : "admin",
 *          type : "과제 지각",
 *          description : "과제 지각"
 *          date : "2020-03-19"
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post('/write', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('type').isString(), (0, _expressValidator.body)('date').isString(), (0, _expressValidator.body)('username').isString(), (0, _expressValidator.body)('description').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    var penalty = new _Penalty2.default();
    penalty.type = req.body.type;
    penalty.username = req.body.username;
    penalty.date = req.body.date;
    penalty.description = req.body.description;

    await penalty.save();

    res.end();
}));

/**
 * @api {post} /penalty/delete/ 상벌점 삭제
 * @apiDescription 사용자의 상벌점 삭제
 * @apiName penaltyDelete
 * @apiGroup Penalty
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} username 조회할 사용자의 아이디
 * @apiParam {String} type 상벌점 항목 타입
 * @apiParam {String} description 상벌점 항목 설명
 * @apiParam {String} date 상벌점 항목 부여 날짜
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          username : "admin",
 *          type : "과제 지각",
 *          description : "과제 지각"
 *          date : "2020-03-19"
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post('/delete/', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('username').isString(), (0, _expressValidator.body)('date').isString(), (0, _expressValidator.body)('type').isString(), (0, _expressValidator.body)('description').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    await _Penalty2.default.findOneAndDelete({
        type: req.body.type,
        username: req.body.username,
        date: req.body.date,
        description: req.body.description
    });
    res.end();
}));

exports.default = router;
//# sourceMappingURL=penalty.route.js.map