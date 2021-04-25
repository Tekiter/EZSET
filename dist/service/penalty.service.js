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
exports.PenaltyService = void 0;
const penalty_dao_1 = require("../dao/penalty.dao");
const Error_1 = require("../models/Error");
class PenaltyService {
}
exports.PenaltyService = PenaltyService;
PenaltyService.createPenalty = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { users, type, description, date } = req;
    try {
        let result = [];
        users.forEach((username) => __awaiter(void 0, void 0, void 0, function* () {
            result.push(yield penalty_dao_1.PenaltyDao.createPenalty(username, type, description, date));
        }));
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'Create Penalty fail');
    }
});
PenaltyService.deletePenalty = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req;
    try {
        const result = yield penalty_dao_1.PenaltyDao.deletePenalty(_id);
        if (result.n == 0) {
            throw new Error_1.handleError(404, 'Penalty not found');
        }
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'Delete Penalty fail');
    }
});
PenaltyService.getPenaltys = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { start, end } = req.query;
    try {
        const result = yield penalty_dao_1.PenaltyDao.getPenaltys(start, end);
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'Penalty not found');
    }
});
PenaltyService.getPenalty = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const { username } = req.params;
    const { start, end } = req.query;
    try {
        const result = yield penalty_dao_1.PenaltyDao.getPenalty(username, start, end);
        return result;
    }
    catch (err) {
        throw new Error_1.handleError(404, 'Penalty not found');
    }
});
//# sourceMappingURL=penalty.service.js.map