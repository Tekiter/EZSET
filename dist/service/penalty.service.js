'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PenaltyService = undefined;

var _penalty = require('../dao/penalty.dao');

var _Error = require('../models/Error');

class PenaltyService {}
exports.PenaltyService = PenaltyService;

PenaltyService.createPenalty = async req => {
    const { users, type, description, date } = req;
    try {
        let result = [];
        users.forEach(async username => {
            result.push((await _penalty.PenaltyDao.createPenalty(username, type, description, date)));
        });
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'Create Penalty fail');
    }
};

PenaltyService.deletePenalty = async req => {
    const { _id } = req;
    try {
        const result = await _penalty.PenaltyDao.deletePenalty(_id);
        if (result.n == 0) {
            throw new _Error.handleError(404, 'Penalty not found');
        }
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'Delete Penalty fail');
    }
};

PenaltyService.getPenaltys = async req => {
    const { start, end } = req.query;
    try {
        const result = await _penalty.PenaltyDao.getPenaltys(start, end);
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'Penalty not found');
    }
};

PenaltyService.getPenalty = async req => {
    const { username } = req.params;
    const { start, end } = req.query;
    try {
        const result = await _penalty.PenaltyDao.getPenalty(username, start, end);
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'Penalty not found');
    }
};
//# sourceMappingURL=penalty.service.js.map