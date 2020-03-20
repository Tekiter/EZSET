'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MaterialSchema = new _mongoose2.default.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    author: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: false,
        trim: true
    },
    created_date: {
        type: Date,
        default: Date.now
    },
    //업로드한 파일의 id 저장
    files: [{ type: _mongoose2.default.SchemaTypes.ObjectId }],
    //상위 폴더의 id 저장 (부모)
    parent: {
        type: _mongoose2.default.SchemaTypes.ObjectId,
        required: true
    }
});

exports.default = _mongoose2.default.model('FileboxMaterial', MaterialSchema);
//# sourceMappingURL=Material.js.map