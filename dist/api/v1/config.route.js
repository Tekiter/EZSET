"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const api_1 = require("../../utils/api");
const auth_1 = require("../../utils/auth");
const role_1 = require("../../utils/role");
const role_2 = require("../../utils/role");
const express_validator_1 = require("express-validator");
const config_1 = require("../../utils/config");
const router = express_1.Router();
router.loginNotRequired = true;
const configNames = ['groupName', 'usePreUser', 'theme'];
const changeableConfigs = [
    {
        key: 'groupName',
        check: express_validator_1.body('groupName').isString(),
    },
    {
        key: 'usePreUser',
        check: express_validator_1.body('usePreUser')
            .isBoolean()
            .toBoolean(),
    },
    {
        key: 'theme',
        check: express_validator_1.body('theme').custom(value => {
            if (!value) {
                return false;
            }
            return true;
        }),
    },
];
/**
 * @api {get} /config 서버 설정 가져오기
 * @apiDescription 서버의 기본 정보를 가져옴
 * @apiName ViewConfig
 * @apiGroup Config
 */
router.get('/', api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = {};
    for (let configName of configNames) {
        configs[configName] = yield config_1.getConfig(configName);
    }
    res.json(Object.assign({}, configs));
})));
/**
 * @api {get} /config/admin 서버 설정 가져오기 (어드민)
 * @apiDescription 서버의 모든 설정 정보를 가져옴
 * @apiName ViewAdminConfig
 * @apiGroup Config
 */
router.get('/admin', [auth_1.loginRequired, role_1.getRoleMiddleware, role_2.perm('serverConfig').can('change')], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const configs = {};
    for (let configName of configNames) {
        configs[configName] = yield config_1.getConfig(configName);
    }
    res.json(Object.assign({}, configs));
})));
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
router.patch('/admin', [
    auth_1.loginRequired,
    role_1.getRoleMiddleware,
    role_2.perm('serverConfig').can('change'),
    changeableConfigs.map(config => config.check.optional()),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    for (let { key } of changeableConfigs) {
        if (req.body[key] != undefined) {
            yield config_1.setConfig(key, req.body[key]);
        }
    }
    res.status(200).end();
})));
/**
 * @api {get} /config/reset 서버 설정 초기화
 * @apiDescription 서버의 모든 설정 정보를 초기화
 * @apiName ResetConfig
 * @apiGroup Config
 */
router.post('/reset', [
    auth_1.loginRequired,
    role_1.getRoleMiddleware,
    role_2.perm('serverConfig').can('change'),
    api_1.validateParams,
], api_1.asyncRoute((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield config_1.setDefaultConfigs();
    res.end();
})));
exports.default = router;
//# sourceMappingURL=config.route.js.map