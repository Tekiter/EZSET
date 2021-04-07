'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _database = require('./utils/database');

var _database2 = _interopRequireDefault(_database);

var _app = require('./app');

var _app2 = _interopRequireDefault(_app);

var _initialization = require('./utils/initialization');

var _initialization2 = _interopRequireDefault(_initialization);

var _socket = require('./utils/socket');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-console */
exports.default = async function initApp({ PORT, DATABASE_URI, SOCKET_PORT, APM_SERVER_URL }) {
    try {
        //elastic apm
        try {
            const apm = require('elastic-apm-node').start({
                serviceName: 'ezset_test',
                serverUrl: APM_SERVER_URL,
                captureBody: 'all',
                usePathAsTransactionName: true
            });
            console.log("Successfully connected to elastic-apm-server");
        } catch (err) {
            throw err;
        }

        if (!DATABASE_URI) {
            const err = new Error('Environment Variable "DATABASE_URL" has not been set.');
            throw err;
        }
        await _database2.default.initialize(DATABASE_URI);
        console.log('Successfully connected to database');

        await _initialization2.default.initialize();
        await (0, _socket.initSocket)(_app2.default, SOCKET_PORT);

        _app2.default.listen(PORT, () => console.log(`Listening on port ${PORT}`));
    } catch (error) {
        console.log('Failed to initialize');
        console.error(error);
    }
};
//# sourceMappingURL=init.js.map