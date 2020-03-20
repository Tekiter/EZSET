'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const configSchema = new _mongoose2.default.Schema({
    key: {
        type: String,
        unique: true,
        trim: true,
        index: true
    },
    value: {
        type: _mongoose2.default.Schema.Types.Mixed
    }
});

exports.default = _mongoose2.default.model('config', configSchema);
//# sourceMappingURL=Config.js.map