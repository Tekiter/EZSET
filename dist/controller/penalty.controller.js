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
exports.PenaltyController = void 0;
const penalty_service_1 = require("../service/penalty.service");
const Response_1 = require("../models/Response");
class PenaltyController {
}
exports.PenaltyController = PenaltyController;
PenaltyController.createPenalty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penalty_service_1.PenaltyService.createPenalty(req.body);
        return res
            .status(201)
            .json(new Response_1.Response(201, 'create Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyController.deletePenalty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penalty_service_1.PenaltyService.deletePenalty(req.params);
        return res
            .status(200)
            .json(new Response_1.Response(200, 'delete Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyController.getPenaltys = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penalty_service_1.PenaltyService.getPenaltys(req);
        return res
            .status(200)
            .json(new Response_1.Response(200, 'get Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyController.getPenalty = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penalty_service_1.PenaltyService.getPenalty(req);
        return res
            .status(200)
            .json(new Response_1.Response(200, 'get Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=penalty.controller.js.map