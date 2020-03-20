'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _api = require('../../utils/api');

var _config = require('../../utils/config');

var _expressValidator = require('express-validator');

const router = (0, _express.Router)();

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

// import { perm } from '../../utils/role'
router.get('/simple', [], (0, _api.asyncRoute)(async (req, res) => {
    const content = await (0, _config.getConfig)('homeSimpleContent', '');
    res.json({ content });
}));

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
(0, _expressValidator.body)('content').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    await (0, _config.setConfig)('homeSimpleContent', req.body.content);

    res.end();
}));

exports.default = router;
//# sourceMappingURL=home.route.js.map