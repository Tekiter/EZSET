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
const penalty_controller_1 = require("../../controller/penalty.controller");
router.post('/', [
    role_1.perm('penalty').can('update'),
    express_validator_1.body('type').isString(),
    express_validator_1.body('date').isString(),
    express_validator_1.body('users').isArray(),
    express_validator_1.body('description').isString(),
    api_1.validateParams,
], penalty_controller_1.PenaltyController.createPenalty);
router.delete('/:_id', [role_1.perm('penalty').can('update'), express_validator_1.param('_id').isString(), api_1.validateParams], penalty_controller_1.PenaltyController.deletePenalty);
router.get('/', [role_1.perm('penalty').can('read'), api_1.validateParams], penalty_controller_1.PenaltyController.getPenaltys);
router.get('/:username', [role_1.perm('penalty').can('read'), express_validator_1.param('username').isString(), api_1.validateParams], penalty_controller_1.PenaltyController.getPenalty);
exports.default = router;
//# sourceMappingURL=penalty.route.js.map