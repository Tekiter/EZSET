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
const express_1 = require("express");
const api_1 = require("../../utils/api");
const role_1 = require("../../utils/role");
const express_validator_1 = require("express-validator");
const PreUser_1 = __importDefault(require("../../models/PreUser"));
const router = express_1.Router();
// 승인 대기중인 유저 목록 가져오기
router.get('/', [role_1.perm('managePreusers').can('access')], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield PreUser_1.default.find();
    res.json({
        users: users.map(user => {
            return {
                username: user.username,
                timestamp: user.timestamp,
                realname: user.info.realname,
                email: user.info.email,
            };
        }),
    });
})));
// 유저를 정회원으로 승인
router.post('/:username', [
    role_1.perm('managePreusers').can('access'),
    express_validator_1.param('username').isString(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield PreUser_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 존재하지 않습니다.');
        err.status = 400;
        throw err;
    }
    yield user.accept();
    yield user.remove();
    res.end();
})));
// 유저 승인 거절
router.delete('/:username', [
    role_1.perm('managePreusers').can('access'),
    express_validator_1.param('username').isString(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield PreUser_1.default.findOne()
        .where('username')
        .equals(req.params.username);
    if (!user) {
        const err = new Error('해당 유저가 존재하지 않습니다.');
        err.status = 400;
        throw err;
    }
    yield user.remove();
    res.end();
})));
exports.default = router;
//# sourceMappingURL=preuser.route.js.map