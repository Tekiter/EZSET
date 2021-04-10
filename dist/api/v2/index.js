'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _express = require('express');

var _auth = require('../../utils/auth');

var _role = require('../../utils/role');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const router = (0, _express.Router)();
const indexJs = _path2.default.basename(__filename);

_fs2.default.readdirSync(__dirname).filter(file => file.indexOf('.') !== 0 && file !== indexJs && file.slice(-9) === '.route.js').forEach(routeFile => {
    const subrouter = require(`./${routeFile}`).default;
    const middlewares = [];

    if (!subrouter || !subrouter.use) {
        const err = Error(`Invalid router file '${routeFile}'`);
        throw err;
    }

    if (!subrouter.loginNotRequired) {
        middlewares.push(_auth.loginRequired);
        middlewares.push(_role.getRoleMiddleware);
    }

    router.use(`/${routeFile.split('.')[0]}`, middlewares, subrouter);
});

exports.default = router;
//# sourceMappingURL=index.js.map