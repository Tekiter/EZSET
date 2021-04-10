'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PenaltyConfigDao = undefined;

var _PenaltyConfig = require('../models/Penalty/PenaltyConfig');

var _PenaltyConfig2 = _interopRequireDefault(_PenaltyConfig);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PenaltyConfigDao {}
exports.PenaltyConfigDao = PenaltyConfigDao;

PenaltyConfigDao.createPenaltyConfig = async (key, value) => {
  const penaltyConfig = new _PenaltyConfig2.default({
    key,
    value
  });
  return await penaltyConfig.save();
};

PenaltyConfigDao.deletePenaltyConfig = async _id => {
  return await _PenaltyConfig2.default.deleteOne({
    _id
  });
};

PenaltyConfigDao.getPenaltyConfig = async _id => {
  return await _PenaltyConfig2.default.findOne({
    _id
  });
};

PenaltyConfigDao.getPenaltyConfigs = async () => {
  return await _PenaltyConfig2.default.find({});
};

PenaltyConfigDao.updatePenaltyConfig = async (_id, value) => {
  return await _PenaltyConfig2.default.findOneAndUpdate({ _id }, { value }, { new: true });
};
//# sourceMappingURL=penaltyConfig.dao.js.map