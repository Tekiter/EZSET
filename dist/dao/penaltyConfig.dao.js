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
exports.PenaltyConfigDao = void 0;
const PenaltyConfig_1 = __importDefault(require("../models/Penalty/PenaltyConfig"));
class PenaltyConfigDao {
}
exports.PenaltyConfigDao = PenaltyConfigDao;
PenaltyConfigDao.createPenaltyConfig = (key, value) => __awaiter(void 0, void 0, void 0, function* () {
    const penaltyConfig = new PenaltyConfig_1.default({
        key,
        value,
    });
    return yield penaltyConfig.save();
});
PenaltyConfigDao.deletePenaltyConfig = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PenaltyConfig_1.default.deleteOne({
        _id,
    });
});
PenaltyConfigDao.getPenaltyConfig = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PenaltyConfig_1.default.findOne({
        _id,
    });
});
PenaltyConfigDao.getPenaltyConfigs = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield PenaltyConfig_1.default.find({});
});
PenaltyConfigDao.updatePenaltyConfig = (_id, value) => __awaiter(void 0, void 0, void 0, function* () {
    return yield PenaltyConfig_1.default.findOneAndUpdate({ _id }, { value }, { new: true });
});
//# sourceMappingURL=penaltyConfig.dao.js.map