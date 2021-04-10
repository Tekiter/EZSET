'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PenaltyConfigService = undefined;

var _penaltyConfig = require('../dao/penaltyConfig.dao');

var _penalty = require('../dao/penalty.dao');

var _Error = require('../models/Error');

class PenaltyConfigService {}
exports.PenaltyConfigService = PenaltyConfigService;

PenaltyConfigService.createPenaltyConfig = async req => {
    const { key, value } = req.body;
    try {
        const result = await _penaltyConfig.PenaltyConfigDao.createPenaltyConfig(key, value);
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'Create PenaltyConfig fail');
    }
};

PenaltyConfigService.deletePenaltyConfig = async req => {
    const { _id } = req.params;
    const type_id = _id;
    const penaltyConfig = await _penaltyConfig.PenaltyConfigDao.getPenaltyConfig(_id);

    if (penaltyConfig.key == '지각' || penaltyConfig.key == '결석') {
        throw new _Error.handleError(400, '삭제할 수 없는 항목입니다.');
    }

    try {
        const result = await _penaltyConfig.PenaltyConfigDao.deletePenaltyConfig(_id);
        if (result.n == 0) {
            throw new _Error.handleError(404, 'PenaltyConfig not found');
        } else {
            const res = await _penalty.PenaltyDao.deletePenaltys(type_id);
            return res;
        }
    } catch (err) {
        throw new _Error.handleError(404, 'delete PenaltyConfig fail');
    }
};

PenaltyConfigService.getPenaltyConfigs = async req => {
    try {
        const result = await _penaltyConfig.PenaltyConfigDao.getPenaltyConfigs();
        return result;
    } catch (err) {
        throw new _Error.handleError(404, 'PenaltyConfig not found');
    }
};

PenaltyConfigService.updatePenaltyConfig = async req => {
    const { _id } = req.params;
    const { value } = req.body;
    try {
        const penaltyConfig = await _penaltyConfig.PenaltyConfigDao.getPenaltyConfig(_id);
        if (penaltyConfig === null) {
            throw new _Error.handleError(404, 'PenaltyConfig not found');
        }
        const result = await _penaltyConfig.PenaltyConfigDao.updatePenaltyConfig(_id, value);
        return result;
    } catch (err) {
        console.log(err);
        throw new _Error.handleError(404, 'update PenaltyConfig fail');
    }
};
//# sourceMappingURL=penaltyConfig.service.js.map