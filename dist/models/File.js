'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const fileSchema = new _mongoose2.default.Schema({
    // 유저가 지정한 파일 이름
    filename: {
        type: String,
        required: true,
        trim: true
    },

    // 파일의 크기
    size: {
        type: Number
    },

    // 파일을 업로드 한 사람
    uploader: {
        type: String
    },

    // 파일의 mime 타입
    mimetype: {
        type: String
    },

    // 파일을 다운로드한 횟수
    hit: {
        type: Number,
        default: 0
    },

    // 파일을 업로드한 시간
    timestamp: {
        type: Date,
        default: Date.now
    },

    link: {
        target: {
            type: String
        },
        ref: {
            type: String
        }
    }
});

fileSchema.methods.increaseHit = function () {
    this.hit += 1;
    return this.save();
};

fileSchema.methods.hasLink = function () {
    if (this.link) {
        if (this.link.target) {
            return true;
        }
    }
    return false;
};

exports.default = _mongoose2.default.model('File', fileSchema);
//# sourceMappingURL=File.js.map