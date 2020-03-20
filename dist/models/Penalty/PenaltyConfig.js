'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const penaltyConfigSchema = new _mongoose2.default.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true
    },
    value: {
        type: Number
    }
});

exports.default = _mongoose2.default.model('penaltyConfig', penaltyConfigSchema);
//# sourceMappingURL=PenaltyConfig.js.map