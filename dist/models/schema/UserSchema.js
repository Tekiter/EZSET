'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _auth = require('../../utils/auth');

var _auth2 = _interopRequireDefault(_auth);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const userSchema = new _mongoose2.default.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        index: true
    },
    password_hash: {
        type: String,
        required: true
    },
    info: {
        type: _mongoose2.default.Schema.Types.Mixed,
        default: {}
    },
    roles: {
        type: [String]
    },

    // 출석 대상 유저인지 표시
    attable: {
        type: Boolean,
        default: true
    },

    timestamp: {
        type: Date,
        default: Date.now
    }
});

userSchema.virtual('password').get(function () {
    return this.password_hash;
}).set(function (value) {
    this.password_hash = _auth2.default.hashPassword(value);
});

userSchema.methods.checkPassword = function (password) {
    return _auth2.default.checkPassword(password, this.password_hash);
};

exports.default = userSchema;
//# sourceMappingURL=UserSchema.js.map