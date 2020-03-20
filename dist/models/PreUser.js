'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _UserSchema = require('./schema/UserSchema');

var _UserSchema2 = _interopRequireDefault(_UserSchema);

var _User = require('./User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_UserSchema2.default.methods.accept = async function () {
    const user = new _User2.default({
        username: this.username,
        password_hash: this.password_hash,
        info: this.info
    });
    await user.save();
};

exports.default = _mongoose2.default.model('PreUser', _UserSchema2.default);
//# sourceMappingURL=PreUser.js.map