'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PenaltyConfigController = undefined;

var _penaltyConfig = require('../service/penaltyConfig.service');

var _Response = require('../models/Response');

class PenaltyConfigController {}
exports.PenaltyConfigController = PenaltyConfigController;

PenaltyConfigController.createPenaltyConfig = async (req, res, next) => {
    try {
        const result = await _penaltyConfig.PenaltyConfigService.createPenaltyConfig(req);

        return res.status(201).json(new _Response.Response(201, 'create Penalty success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyConfigController.deletePenaltyConfig = async (req, res, next) => {
    try {
        const result = await _penaltyConfig.PenaltyConfigService.deletePenaltyConfig(req);

        return res.status(200).json(new _Response.Response(200, 'delete Penalty success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyConfigController.getPenaltyConfigs = async (req, res, next) => {
    try {
        const result = await _penaltyConfig.PenaltyConfigService.getPenaltyConfigs();

        return res.status(200).json(new _Response.Response(200, 'get PenaltyConfigs success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyConfigController.updatePenaltyConfig = async (req, res, next) => {
    try {
        const result = await _penaltyConfig.PenaltyConfigService.updatePenaltyConfig(req);

        return res.status(200).json(new _Response.Response(200, 'update PenaltyConfig success', result));
    } catch (err) {
        next(err);
    }
};
//# sourceMappingURL=penaltyConfig.controller.js.map