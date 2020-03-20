'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const GroupSchema = new _mongoose2.default.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    //폴더면 true 그룹이면 false
    isfolder: {
        type: Boolean,
        required: true
    },
    //상위 그룹의 id 저장
    parent: {
        type: _mongoose2.default.SchemaTypes.ObjectId
    },
    //하위 그룹혹은 폴더의 id 저장
    children: [{ type: _mongoose2.default.SchemaTypes.ObjectId }]
});

exports.default = _mongoose2.default.model('FileboxGroup', GroupSchema);
//# sourceMappingURL=Group.js.map