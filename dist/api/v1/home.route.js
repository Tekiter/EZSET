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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../../utils/api");
const config_1 = require("../../utils/config");
// import { perm } from '../../utils/role'
const express_validator_1 = require("express-validator");
const router = express_1.Router();
/**
 * @api {get} /home/simple Simple 홈 화면
 * @apiDescription Simple 홈 화면의 내용을 가져옴
 * @apiName ViewSimpleHome
 * @apiGroup Home
 * @apiSuccess {Number} 200
 *
 * @apiSuccessExample {json} Success-Response:
 *      HTTP/1.1 200 OK
 *      {"content":"홈화면 내용"}
 */
router.get('/simple', [], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const content = yield config_1.getConfig('homeSimpleContent', '');
    res.json({ content });
})));
/**
 * @api {patch} /home/simple Simple 홈 화면 변경
 * @apiDescription Simple 홈 화면의 내용을 변경
 * @apiName EditSimpleHome
 * @apiGroup Home
 * @apiParam {String} content 바꿀 홈 화면의 내용
 * @apiParamExample {json} Request-Example:
 * {"content":"홈화면 내용"}
 */
router.patch('/simple', [
    // perm('manageHome').can('update'),
    express_validator_1.body('content').isString(),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.setConfig('homeSimpleContent', req.body.content);
    res.end();
})));
exports.default = router;
//# sourceMappingURL=home.route.js.map