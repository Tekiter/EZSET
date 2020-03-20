'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _PenaltyConfig = require('../../models/Penalty/PenaltyConfig');

var _PenaltyConfig2 = _interopRequireDefault(_PenaltyConfig);

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express2.default)();

/**
 * @api {get} /penaltyconfig/read/ 상벌점 항목 조회
 * @apiDescription 사용자의 상벌점 항목 조회
 * @apiName penaltyconfigRead
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.read
 *
 * @apiSuccess {Array} - 상벌점 항목을 배열로 반환
 * @apiSuccess {String} type 상벌점 항목의 이름
 * @apiSuccess {Number} value 상벌점 항목의 점수
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
router.get('/read', [(0, _role.perm)('penalty').can('read')], (0, _api.asyncRoute)(async function (req, res) {
    const cursor = await _PenaltyConfig2.default.find();
    res.json(cursor);
}));

/**
 * @api {post} /penaltyconfig/write/ 상벌점 항목 생성
 * @apiDescription 상벌점 항목 생성
 * @apiName penaltyconfigWrite
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 * @apiParam {String} value 상벌점 점수
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *          value : "-1"
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post('/write', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('key').isString(), (0, _expressValidator.body)('value').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    const cnt = await _PenaltyConfig2.default.find().where('key').equals(req.body.key).count();
    if (cnt > 0) return res.status(406).json();
    var penaltyConfig = new _PenaltyConfig2.default();
    penaltyConfig.key = req.body.key;
    penaltyConfig.value = req.body.value;
    penaltyConfig.save();
    res.end();
}));

/**
 * @api {post} /penaltyconfig/delete/ 상벌점 항목 삭제
 * @apiDescription 상벌점 항목 삭제
 * @apiName penaltyconfigDelete
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post('/delete', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('key').isString(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    if (req.body.key == '지각') {
        const err = new Error('지각 항목은 삭제할 수 없습니다.');
        err.status = 400;
        throw err;
    }
    if (req.body.key == '결석') {
        const err = new Error('결석 항목은 삭제할 수 없습니다.');
        err.status = 400;
        throw err;
    }
    await _PenaltyConfig2.default.findOneAndDelete({
        key: req.body.key
    });
    res.end();
}));

/**
 * @api {post} /penaltyconfig/update/ 상벌점 항목 수정
 * @apiDescription 상벌점 항목의 점수 수정
 * @apiName penaltyconfigUpdate
 * @apiGroup PenaltyConfig
 * @apiPermission penalty.can.update
 *
 * @apiParam {String} key 상벌점 항목 이름
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          key : "과제 지각",
 *          value : -1
 *      }
 *
 * @apiSuccess {200} code 기록 성공시 코드
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 */
router.post('/update', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('key').isString(), (0, _expressValidator.body)('value').isNumeric(), _api.validateParams], (0, _api.asyncRoute)(async function (req, res) {
    await _PenaltyConfig2.default.findOneAndUpdate({
        key: req.body.key
    }, {
        value: req.body.value
    });
    res.end();
}));
exports.default = router;
//# sourceMappingURL=penaltyconfig.route.js.map