'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const penaltySchema = new _mongoose2.default.Schema({
    type_id: {
        type: String,
        index: true
    },
    type: {
        type: String,
        trim: true
    },
    username: {
        type: String,
        trim: true
    },
    date: {
        type: Date,
        trim: true
    },
    description: {
        type: String,
        trim: true
    }
});

exports.default = _mongoose2.default.model('penalty', penaltySchema);
//# sourceMappingURL=Penalty.js.map