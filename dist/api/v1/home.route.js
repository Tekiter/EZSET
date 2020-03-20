'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _api = require('../../utils/api');

var _config = require('../../utils/config');

var _expressValidator = require('express-validator');

const router = (0, _express.Router)();
// import { perm } from '../../utils/role'


router.get('/simple', [], (0, _api.asyncRoute)(async (req, res) => {
    const content = await (0, _config.getConfig)('homeSimpleContent', '');
    res.json({ content });
}));

router.patch('/simple', [
// perm('manageHome').can('update'),
(0, _expressValidator.body)('content').isString(), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    await (0, _config.setConfig)('homeSimpleContent', req.body.content);

    res.end();
}));

exports.default = router;
//# sourceMappingURL=home.route.js.map