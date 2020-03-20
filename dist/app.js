'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _morgan = require('morgan');

var _morgan2 = _interopRequireDefault(_morgan);

var _bodyParser = require('body-parser');

var _bodyParser2 = _interopRequireDefault(_bodyParser);

var _connectHistoryApiFallback = require('connect-history-api-fallback');

var _connectHistoryApiFallback2 = _interopRequireDefault(_connectHistoryApiFallback);

var _v = require('./api/v1');

var _v2 = _interopRequireDefault(_v);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const app = (0, _express2.default)();
app.disable('x-powered-by');

app.use((0, _morgan2.default)('dev', {
    skip: () => app.get('env') === 'test'
}));
app.use(_bodyParser2.default.json({ limit: '11mb' }));
app.use(_bodyParser2.default.urlencoded({
    extended: false,
    limit: '10mb'
}));
app.use('/api/v1', _v2.default);

app.use('/api/v1/*', (req, res, next) => {
    const err = new Error('올바르지 않은 API 접근입니다.');
    err.status = 404;
    next(err);
});

app.use((0, _connectHistoryApiFallback2.default)({}));
app.use(_express2.default.static(_path2.default.join(__dirname, '../public')));

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// Error handler
app.use((err, req, res, next) => {
    // eslint-disable-line no-unused-vars
    res.status(err.status || 500).json({
        message: err.message
    });
});

exports.default = app;
//# sourceMappingURL=app.js.map