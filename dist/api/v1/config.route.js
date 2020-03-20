'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _express = require('express');

var _api = require('../../utils/api');

var _auth = require('../../utils/auth');

var _role = require('../../utils/role');

var _expressValidator = require('express-validator');

var _config = require('../../utils/config');

const router = (0, _express.Router)();
router.loginNotRequired = true;

const configNames = ['groupName', 'usePreUser', 'theme'];

const changeableConfigs = [{
    key: 'groupName',
    check: (0, _expressValidator.body)('groupName').isString()
}, {
    key: 'usePreUser',
    check: (0, _expressValidator.body)('usePreUser').isBoolean().toBoolean()
}, {
    key: 'theme',
    check: (0, _expressValidator.body)('theme').custom(value => {
        if (!value) {
            return false;
        }
        return true;
    })
}];

// 서버 설정을 가져온다.
router.get('/', (0, _api.asyncRoute)(async (req, res) => {
    const configs = {};

    for (let configName of configNames) {
        configs[configName] = await (0, _config.getConfig)(configName);
    }

    res.json(_extends({}, configs));
}));

// 서버 전체 설정을 가져온다.
router.get('/admin', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change')], (0, _api.asyncRoute)(async (req, res) => {
    const configs = {};

    for (let configName of configNames) {
        configs[configName] = await (0, _config.getConfig)(configName);
    }

    res.json(_extends({}, configs));
}));

// 변경 가능한 서버 설정들을 수정한다.
// body에 Object 로 key: value 쌍을 넣으면 반영된다.
router.patch('/admin', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change'), changeableConfigs.map(config => config.check.optional()), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    for (let _ref of changeableConfigs) {
        let { key } = _ref;

        if (req.body[key] != undefined) {
            await (0, _config.setConfig)(key, req.body[key]);
        }
    }

    res.status(200).end();
}));

router.post('/reset', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change'), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    await (0, _config.setDefaultConfigs)();
    res.end();
}));

exports.default = router;
//# sourceMappingURL=config.route.js.map