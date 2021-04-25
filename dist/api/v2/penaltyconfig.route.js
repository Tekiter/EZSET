"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
const api_1 = require("../../utils/api");
const role_1 = require("../../utils/role");
const express_validator_1 = require("express-validator");
const penaltyConfig_controller_1 = require("../../controller/penaltyConfig.controller");
router.post('/', [
    role_1.perm('penalty').can('update'),
    express_validator_1.body('key').isString(),
    express_validator_1.body('value').isNumeric(),
    api_1.validateParams,
], penaltyConfig_controller_1.PenaltyConfigController.createPenaltyConfig);
router.delete('/:_id', [role_1.perm('penalty').can('update'), express_validator_1.param('_id').isString(), api_1.validateParams], penaltyConfig_controller_1.PenaltyConfigController.deletePenaltyConfig);
router.get('/', [role_1.perm('penalty').can('read'), api_1.validateParams], penaltyConfig_controller_1.PenaltyConfigController.getPenaltyConfigs);
router.patch('/:_id', [
    role_1.perm('penalty').can('update'),
    express_validator_1.param('_id').isString(),
    express_validator_1.body('value').isNumeric(),
    api_1.validateParams,
], penaltyConfig_controller_1.PenaltyConfigController.updatePenaltyConfig);
exports.default = router;
//# sourceMappingURL=penaltyconfig.route.js.map