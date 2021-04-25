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
exports.PenaltyConfigService = void 0;
const penaltyConfig_dao_1 = require("../dao/penaltyConfig.dao");
const penalty_dao_1 = require("../dao/penalty.dao");
const Error_1 = require("../models/Error");
class PenaltyConfigService {
}
exports.PenaltyConfigService = PenaltyConfigService;
PenaltyConfigService.createPenaltyConfig = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { key, value } = req.body;
    try {
        const result = yield penaltyConfig_dao_1.PenaltyConfigDao.createPenaltyConfig(key, value);
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'Create PenaltyConfig fail');
    }
});
PenaltyConfigService.deletePenaltyConfig = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const type_id = _id;
    const penaltyConfig = yield penaltyConfig_dao_1.PenaltyConfigDao.getPenaltyConfig(_id);
    if (penaltyConfig.key == '지각' || penaltyConfig.key == '결석') {
        throw new Error_1.handleError(400, '삭제할 수 없는 항목입니다.');
    }
    try {
        const result = yield penaltyConfig_dao_1.PenaltyConfigDao.deletePenaltyConfig(_id);
        if (result.n == 0) {
            throw new Error_1.handleError(404, 'PenaltyConfig not found');
        }
        else {
            const res = yield penalty_dao_1.PenaltyDao.deletePenaltys(type_id);
            return res;
        }
    }
    catch (err) {
        throw new Error_1.handleError(404, 'delete PenaltyConfig fail');
    }
});
PenaltyConfigService.getPenaltyConfigs = (req) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penaltyConfig_dao_1.PenaltyConfigDao.getPenaltyConfigs();
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'PenaltyConfig not found');
    }
});
PenaltyConfigService.updatePenaltyConfig = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.params;
    const { value } = req.body;
    try {
        const penaltyConfig = yield penaltyConfig_dao_1.PenaltyConfigDao.getPenaltyConfig(_id);
        if (penaltyConfig === null) {
            throw new Error_1.handleError(404, 'PenaltyConfig not found');
        }
        const result = yield penaltyConfig_dao_1.PenaltyConfigDao.updatePenaltyConfig(_id, value);
        return result;
    }
    catch (err) {
        console.log(err);
        throw new Error_1.handleError(404, 'update PenaltyConfig fail');
    }
});
//# sourceMappingURL=penaltyConfig.service.js.map