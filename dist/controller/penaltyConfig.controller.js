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
exports.PenaltyConfigController = void 0;
const penaltyConfig_service_1 = require("../service/penaltyConfig.service");
const Response_1 = require("../models/Response");
class PenaltyConfigController {
}
exports.PenaltyConfigController = PenaltyConfigController;
PenaltyConfigController.createPenaltyConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penaltyConfig_service_1.PenaltyConfigService.createPenaltyConfig(req);
        return res
            .status(201)
            .json(new Response_1.Response(201, 'create Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyConfigController.deletePenaltyConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penaltyConfig_service_1.PenaltyConfigService.deletePenaltyConfig(req);
        return res
            .status(200)
            .json(new Response_1.Response(200, 'delete Penalty success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyConfigController.getPenaltyConfigs = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penaltyConfig_service_1.PenaltyConfigService.getPenaltyConfigs();
        return res
            .status(200)
            .json(new Response_1.Response(200, 'get PenaltyConfigs success', result));
    }
    catch (err) {
        next(err);
    }
});
PenaltyConfigController.updatePenaltyConfig = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield penaltyConfig_service_1.PenaltyConfigService.updatePenaltyConfig(req);
        return res
            .status(200)
            .json(new Response_1.Response(200, 'update PenaltyConfig success', result));
    }
    catch (err) {
        next(err);
    }
});
//# sourceMappingURL=penaltyConfig.controller.js.map