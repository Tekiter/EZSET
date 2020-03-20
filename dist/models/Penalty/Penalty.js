'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const penaltySchema = new _mongoose2.default.Schema({
    type: {
        type: String
    },
    username: {
        type: String
    },
    date: {
        type: Date
    },
    description: {
        type: String
    }
});

exports.default = _mongoose2.default.model('penalty', penaltySchema);
//# sourceMappingURL=Penalty.js.map