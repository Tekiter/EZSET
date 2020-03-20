'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const Schema = _mongoose2.default.Schema;

let boardSchema = new Schema({
    title: String,
    isAnonymous: {
        type: Boolean,
        default: false
    }
});

boardSchema.plugin(_mongooseAutoIncrement2.default.plugin, {
    model: 'board',
    startAt: 1
});
module.exports = _mongoose2.default.model('board', boardSchema);
//# sourceMappingURL=Board.js.map