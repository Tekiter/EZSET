'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.PenaltyDao = undefined;

var _Penalty = require('../models/Penalty/Penalty');

var _Penalty2 = _interopRequireDefault(_Penalty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PenaltyDao {}
exports.PenaltyDao = PenaltyDao;

PenaltyDao.createPenalty = async (username, type, description, date) => {
    const penalty = new _Penalty2.default({
        username,
        type,
        description,
        date
    });
    return await penalty.save();
};

PenaltyDao.getPenaltys = async (start, end) => {
    return await _Penalty2.default.find({
        date: {
            $gte: start,
            $lt: end
        }
    });
};

PenaltyDao.getPenalty = async (username, start, end) => {
    return await _Penalty2.default.find({
        username,
        date: {
            $gte: start,
            $lt: end
        }
    });
};

PenaltyDao.deletePenalty = async _id => {
    return await _Penalty2.default.deleteOne({
        _id
    });
};
//# sourceMappingURL=penalty.dao.js.map