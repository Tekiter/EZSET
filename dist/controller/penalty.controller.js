'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PenaltyController = undefined;

var _penalty = require('../service/penalty.service');

var _Response = require('../models/Response');

class PenaltyController {}
exports.PenaltyController = PenaltyController;

PenaltyController.createPenalty = async (req, res, next) => {
    try {
        const result = await _penalty.PenaltyService.createPenalty(req.body);

        return res.status(201).json(new _Response.Response(201, 'create Penalty success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyController.deletePenalty = async (req, res, next) => {
    try {
        const result = await _penalty.PenaltyService.deletePenalty(req.params);

        return res.status(200).json(new _Response.Response(200, 'delete Penalty success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyController.getPenaltys = async (req, res, next) => {
    try {
        const result = await _penalty.PenaltyService.getPenaltys(req);

        return res.status(200).json(new _Response.Response(200, 'get Penalty success', result));
    } catch (err) {
        next(err);
    }
};

PenaltyController.getPenalty = async (req, res, next) => {
    try {
        const result = await _penalty.PenaltyService.getPenalty(req);

        return res.status(200).json(new _Response.Response(200, 'get Penalty success', result));
    } catch (err) {
        next(err);
    }
};
//# sourceMappingURL=penalty.controller.js.map