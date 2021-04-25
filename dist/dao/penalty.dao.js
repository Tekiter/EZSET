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
exports.PenaltyDao = void 0;
const Penalty_1 = __importDefault(require("../models/Penalty/Penalty"));
class PenaltyDao {
}
exports.PenaltyDao = PenaltyDao;
PenaltyDao.createPenalty = (username, type, description, date) => __awaiter(void 0, void 0, void 0, function* () {
    const penalty = new Penalty_1.default({
        username,
        type,
        description,
        date,
    });
    return yield penalty.save();
});
PenaltyDao.getPenaltys = (start, end) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Penalty_1.default.find({
        date: {
            $gte: start,
            $lt: end,
        },
    });
});
PenaltyDao.getPenalty = (username, start, end) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Penalty_1.default.find({
        username,
        date: {
            $gte: start,
            $lt: end,
        },
    });
});
PenaltyDao.deletePenalty = (_id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield Penalty_1.default.deleteOne({
        _id,
    });
});
PenaltyDao.deletePenaltys = (type_id) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(type_id);
    return yield Penalty_1.default.deleteMany({
        type_id,
    });
});
//# sourceMappingURL=penalty.dao.js.map