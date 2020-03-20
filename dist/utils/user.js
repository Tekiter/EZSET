'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.getRealname = getRealname;

var _User = require('../models/User');

var _User2 = _interopRequireDefault(_User);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getRealname(username) {
    const res = await _User2.default.findOne().where('username').equals(username).cache(60);
    if (res) {
        return res.info.realname || '';
    } else {
        return '';
    }
}
//# sourceMappingURL=user.js.map