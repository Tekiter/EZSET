'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

var _penaltyConfig = require('../../controller/penaltyConfig.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('key').isString(), (0, _expressValidator.body)('value').isNumeric(), _api.validateParams], _penaltyConfig.PenaltyConfigController.createPenaltyConfig);

router.delete('/:_id', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.param)('_id').isString(), _api.validateParams], _penaltyConfig.PenaltyConfigController.deletePenaltyConfig);

router.get('/', [(0, _role.perm)('penalty').can('read'), _api.validateParams], _penaltyConfig.PenaltyConfigController.getPenaltyConfigs);

router.patch('/:_id', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.param)('_id').isString(), (0, _expressValidator.body)('value').isNumeric(), _api.validateParams], _penaltyConfig.PenaltyConfigController.updatePenaltyConfig);

exports.default = router;
//# sourceMappingURL=penaltyconfig.route.js.map