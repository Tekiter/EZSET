'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _api = require('../../utils/api');

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

var _penalty = require('../../controller/penalty.controller');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

router.post('/', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.body)('type_id').isString(), (0, _expressValidator.body)('type').isString(), (0, _expressValidator.body)('date').isString(), (0, _expressValidator.body)('users').isArray(), (0, _expressValidator.body)('description').isString(), _api.validateParams], _penalty.PenaltyController.createPenalty);

router.delete('/:_id', [(0, _role.perm)('penalty').can('update'), (0, _expressValidator.param)('_id').isString(), _api.validateParams], _penalty.PenaltyController.deletePenalty);

router.get('/', [(0, _role.perm)('penalty').can('read'), _api.validateParams], _penalty.PenaltyController.getPenaltys);

router.get('/:username', [(0, _role.perm)('penalty').can('read'), (0, _expressValidator.param)('username').isString(), _api.validateParams], _penalty.PenaltyController.getPenalty);
exports.default = router;
//# sourceMappingURL=penalty.route.js.map