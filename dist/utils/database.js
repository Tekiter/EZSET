'use strict';

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _cachegoose = require('cachegoose');

var _cachegoose2 = _interopRequireDefault(_cachegoose);

var _mongooseAutoIncrement = require('mongoose-auto-increment');

var _mongooseAutoIncrement2 = _interopRequireDefault(_mongooseAutoIncrement);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_mongooseAutoIncrement2.default.initialize(_mongoose2.default.connection);
(0, _cachegoose2.default)(_mongoose2.default);

const database = {
    initialize(DATABASE_URI) {
        return new Promise(function (resolve, reject) {
            _mongoose2.default.connect(DATABASE_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }, function (err, db) {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
    }
};

module.exports.default = database;
module.exports = database;
//# sourceMappingURL=database.js.map