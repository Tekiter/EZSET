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
const Penalty_1 = __importDefault(require("../../models/Penalty/Penalty"));
const PenaltyConfig_1 = __importDefault(require("../../models/Penalty/PenaltyConfig"));
const attendanceUser_1 = __importDefault(require("../../models/attendanceUser"));
const role_1 = require("../../utils/role");
const express_validator_1 = require("express-validator");
const moment_1 = __importDefault(require("moment"));
const router = express_1.default();
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
router.get('/read/:username', [
    role_1.perm('penalty').can('read'),
    express_validator_1.param('username').isString(),
    express_validator_1.query('start_date').isString(),
    express_validator_1.query('end_date').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = [];
        var attendanceUser = yield attendanceUser_1.default.findOne({
            name: req.params.username,
        }).select({ _id: 0, __v: 0, name: 0 });
        var penaltyConfig = yield PenaltyConfig_1.default.find();
        if (attendanceUser != null) {
            attendanceUser.status.forEach(element => {
                if (moment_1.default(element.date) >= moment_1.default(req.query.start_date) &&
                    moment_1.default(element.date) <= moment_1.default(req.query.end_date)) {
                    if (element.state == 'late') {
                        var Val = penaltyConfig.find((item, idx) => {
                            return item.key === '지각';
                        });
                        result.push({
                            type_id: Val._id,
                            username: req.params.username,
                            type: '지각',
                            date: moment_1.default(element.date).format('YYYY-MM-DD'),
                            description: '지각',
                            point: Val.value,
                        });
                    }
                    if (element.state == 'absence') {
                        var val = penaltyConfig.find((item, idx) => {
                            return item.key === '결석';
                        });
                        result.push({
                            type_id: val._id,
                            username: req.params.username,
                            type: '결석',
                            date: moment_1.default(element.date).format('YYYY-MM-DD'),
                            description: '결석',
                            point: val.value,
                        });
                    }
                }
            });
        }
        var penalty = yield Penalty_1.default.find({
            username: req.params.username,
            date: {
                $gte: moment_1.default(req.query.start_date).format('YYYY-MM-DD'),
                $lte: moment_1.default(req.query.end_date).format('YYYY-MM-DD'),
            },
        });
        penalty.forEach(element => {
            var val = penaltyConfig.find((item, idx) => {
                return item.key === element.type;
            });
            result.push({
                type_id: val._id,
                username: req.params.username,
                type: element.type,
                date: moment_1.default(element.date).format('YYYY-MM-DD'),
                description: element.description,
                point: val.value,
            });
        });
        res.json(result);
    });
}));
/**
 * @api {get} /penalty/read 상벌점 전체 조회
 * @apiDescription 전체 상벌점 조회
 * @apiName penaltyReadAll
 * @apiGroup Penalty
 * @apiPermission penalty.can.read
 *
 *
 * @apiSuccess {Array} - 사용자의 상벌점 항목을 배열로 반환
 * @apiSuccess {String} type 상벌점 항목의 타입
 * @apiSuccess {String} username 상벌점 항목의 사용자
 * @apiSuccess {String} date 상벌점 항목이 기록된 날짜
 * @apiSuccess {String} description 상벌점 항목의 설명
 * @apiSuccess {Number} point 상벌점 항목의 점수
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {
 *          [{
 *              type:"지각",
 *              username:"admin"
 *              date:"2020-03-19",
 *              description:"지각",
 *              point:-1
 *          }]
 *      }
 */
router.get('/read', [role_1.perm('penalty').can('read'), api_1.validateParams], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var result = [];
        var attendanceUser = yield attendanceUser_1.default.find();
        var penaltyConfig = yield PenaltyConfig_1.default.find();
        if (attendanceUser != null) {
            attendanceUser.forEach(user => {
                user.status.forEach(element => {
                    if (element.state == 'late') {
                        var Val = penaltyConfig.find((item, idx) => {
                            return item.key === '지각';
                        });
                        result.push({
                            type_id: Val._id,
                            username: user.name,
                            type: '지각',
                            date: moment_1.default(element.date).format('YYYY-MM-DD'),
                            description: '지각',
                            point: Val.value,
                        });
                    }
                    if (element.state == 'absence') {
                        var val = penaltyConfig.find((item, idx) => {
                            return item.key === '결석';
                        });
                        result.push({
                            type_id: val._id,
                            username: user.name,
                            type: '결석',
                            date: moment_1.default(element.date).format('YYYY-MM-DD'),
                            description: '결석',
                            point: val.value,
                        });
                    }
                });
            });
        }
        var penalty = yield Penalty_1.default.find();
        penalty.forEach(element => {
            var val = penaltyConfig.find((item, idx) => {
                return item.key === element.type;
            });
            result.push({
                type_id: val._id,
                username: element.username,
                type: element.type,
                date: moment_1.default(element.date).format('YYYY-MM-DD'),
                description: element.description,
                point: val.value,
            });
        });
        res.json(result);
    });
}));
/**
 * @api {post} /penalty/write/ 상벌점 쓰기
 * @apiDescription 사용자의 상벌점 기록
 * @apiName penaltyWrite
 * @apiGroup Penalty
 * @apiPermission penalty.can.update
 *
 * @apiParam {array} users 입력할 사용자들의 아이디 배열
 * @apiParam {String} type 상벌점 항목 타입
 * @apiParam {String} description 상벌점 항목 설명
 * @apiParam {String} date 상벌점 항목 부여 날짜
 *
 * @apiParamExample {post} Request-Example:
 *      {
 *          users : {"admin","test01"},
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
router.post('/write', [
    role_1.perm('penalty').can('update'),
    express_validator_1.body('type_id').isString(),
    express_validator_1.body('type').isString(),
    express_validator_1.body('date').isString(),
    express_validator_1.body('users').isArray(),
    express_validator_1.body('description').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        req.body.users.forEach((username) => __awaiter(this, void 0, void 0, function* () {
            var penalty = new Penalty_1.default();
            penalty.type_id = req.body.type_id;
            penalty.type = req.body.type;
            penalty.username = username;
            penalty.date = req.body.date;
            penalty.description = req.body.description;
            yield penalty.save();
        }));
        res.end();
    });
}));
/**
 * @api {delete} /penalty/delete 상벌점 삭제
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
 * @apiParamExample {delete} Request-Example:
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
router.delete('/delete', [
    role_1.perm('penalty').can('update'),
    express_validator_1.query('username').isString(),
    express_validator_1.query('date').isString(),
    express_validator_1.query('type').isString(),
    express_validator_1.query('description').isString(),
    api_1.validateParams,
], api_1.asyncRoute(function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        yield Penalty_1.default.findOneAndDelete({
            type: req.query.type,
            username: req.query.username,
            date: req.query.date,
            description: req.query.description,
        });
        res.end();
    });
}));
exports.default = router;
//# sourceMappingURL=penalty.route.js.map