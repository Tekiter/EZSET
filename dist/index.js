'use strict';

var _init = require('./init');

var _init2 = _interopRequireDefault(_init);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const { PORT = 8080, DATABASE_URI, SOCKET_PORT = 5050, APM_SERVER_URL } = process.env; // /* eslint-disable no-console */

(0, _init2.default)({
    PORT,
    DATABASE_URI,
    SOCKET_PORT,
    APM_SERVER_URL
});
//# sourceMappingURL=index.js.map