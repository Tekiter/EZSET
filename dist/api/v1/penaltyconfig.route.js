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
const PenaltyConfig_1 = __importDefault(require("../../models/Penalty/PenaltyConfig"));
const role_1 = require("../../utils/role");
const express_validator_1 = require("express-validator");
const Penalty_1 = __importDefault(require("../../models/Penalty/Penalty"));
const router = express_1.default();
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
router.get('/read', [role_1.perm('penalty').can('read')], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cursor = yield PenaltyConfig_1.default.find();
        res.json(cursor);
    });
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
router.post('/write', [
    role_1.perm('penalty').can('update'),
    express_validator_1.body('key').isString(),
    express_validator_1.body('value').isNumeric(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const cnt = yield PenaltyConfig_1.default.find()
            .where('key')
            .equals(req.body.key)
            .count();
        if (cnt > 0)
            return res.status(406).json();
        var penaltyConfig = new PenaltyConfig_1.default();
        penaltyConfig.key = req.body.key;
        penaltyConfig.value = req.body.value;
        penaltyConfig.save();
        res.end();
    });
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
router.delete('/:id', [
    role_1.perm('penalty').can('update'),
    express_validator_1.param('id').isString(),
    express_validator_1.query('key').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        if (req.query.key == '지각') {
            const err = new Error('지각 항목은 삭제할 수 없습니다.');
            err.status = 400;
            throw err;
        }
        if (req.query.key == '결석') {
            const err = new Error('결석 항목은 삭제할 수 없습니다.');
            err.status = 400;
            throw err;
        }
        yield Penalty_1.default.deleteMany({
            type_id: req.params.id,
        });
        yield PenaltyConfig_1.default.findOneAndDelete({
            _id: req.params.id,
        });
        res.end();
    });
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
router.post('/update', [
    role_1.perm('penalty').can('update'),
    express_validator_1.body('_id').isString(),
    express_validator_1.body('key').isString(),
    express_validator_1.body('value').isNumeric(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield PenaltyConfig_1.default.findOneAndUpdate({
            _id: req.body._id,
        }, {
            key: req.body.key,
            value: req.body.value,
        });
        res.end();
    });
}));
exports.default = router;
//# sourceMappingURL=penaltyconfig.route.js.map