'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// import autoIncrement from 'mongoose-auto-increment'

const roleSchema = new _mongoose2.default.Schema({
    tag: { type: String, trim: true, required: true, unique: true },
    name: { type: String, trim: true, required: true },
    perm: { type: _mongoose2.default.Schema.Types.Mixed, default: {} }
});

// roleSchema.plugin(autoIncrement.plugin, {
//     model: 'role',
//     startAt: 0,
// })
exports.default = _mongoose2.default.model('role', roleSchema);
//# sourceMappingURL=Role.js.map