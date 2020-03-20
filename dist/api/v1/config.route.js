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

/**
 * @api {get} /config 서버 설정 가져오기
 * @apiDescription 서버의 기본 정보를 가져옴
 * @apiName ViewConfig
 * @apiGroup Config
 */
router.get('/', (0, _api.asyncRoute)(async (req, res) => {
    const configs = {};

    for (let configName of configNames) {
        configs[configName] = await (0, _config.getConfig)(configName);
    }

    res.json(_extends({}, configs));
}));

/**
 * @api {get} /config/admin 서버 설정 가져오기 (어드민)
 * @apiDescription 서버의 모든 설정 정보를 가져옴
 * @apiName ViewAdminConfig
 * @apiGroup Config
 */
router.get('/admin', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change')], (0, _api.asyncRoute)(async (req, res) => {
    const configs = {};

    for (let configName of configNames) {
        configs[configName] = await (0, _config.getConfig)(configName);
    }

    res.json(_extends({}, configs));
}));

/**
 * @api {patch} /config/admin 서버 설정 변경 (어드민)
 * @apiDescription 변경 가능한 서버의 설정 정보를 변경한다. body에 Object 로 설정값의 key: value 쌍을 넣으면 반영된다.
 * @apiName ChangeConfig
 * @apiGroup Config
 * @apiParam {String} key 바꿀 설정의 값
 * @apiParamExample {json} Request-Example:
 * {"groupName":"EZSET","usePreUser":false}
 *
 */
router.patch('/admin', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change'), changeableConfigs.map(config => config.check.optional()), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    for (let _ref of changeableConfigs) {
        let { key } = _ref;

        if (req.body[key] != undefined) {
            await (0, _config.setConfig)(key, req.body[key]);
        }
    }

    res.status(200).end();
}));

/**
 * @api {get} /config/reset 서버 설정 초기화
 * @apiDescription 서버의 모든 설정 정보를 초기화
 * @apiName ResetConfig
 * @apiGroup Config
 */
router.post('/reset', [_auth.loginRequired, _role.getRoleMiddleware, (0, _role.perm)('serverConfig').can('change'), _api.validateParams], (0, _api.asyncRoute)(async (req, res) => {
    await (0, _config.setDefaultConfigs)();
    res.end();
}));

exports.default = router;
//# sourceMappingURL=config.route.js.map