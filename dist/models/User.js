'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

var _UserSchema = require('./schema/UserSchema');

var _UserSchema2 = _interopRequireDefault(_UserSchema);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_UserSchema2.default.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'User',
    field: 'seq'
});

exports.default = _mongoose2.default.model('User', _UserSchema2.default);
//# sourceMappingURL=User.js.map