import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { loginRequired } from '../../utils/auth'
import { getRoleMiddleware } from '../../utils/role'
import { perm } from '../../utils/role'
import { body } from 'express-validator'
import { getConfig, setConfig, setDefaultConfigs } from '../../utils/config'

const router = Router()
router.loginNotRequired = true

const configNames = ['groupName', 'usePreUser', 'theme']

const changeableConfigs = [
    {
        key: 'groupName',
        check: body('groupName').isString(),
    },
    {
        key: 'usePreUser',
        check: body('usePreUser')
            .isBoolean()
            .toBoolean(),
    },
    {
        key: 'theme',
        check: body('theme').custom(value => {
            if (!value) {
                return false
            }
            return true
        }),
    },
]

/**
 * @api {get} /config 서버 설정 가져오기
 * @apiDescription 서버의 기본 정보를 가져옴
 * @apiName ViewConfig
 * @apiGroup Config
 */
router.get(
    '/',
    asyncRoute(async (req, res) => {
        const configs = {}

        for (let configName of configNames) {
            configs[configName] = await getConfig(configName)
        }

        res.json({ ...configs })
    })
)

/**
 * @api {get} /config/admin 서버 설정 가져오기 (어드민)
 * @apiDescription 서버의 모든 설정 정보를 가져옴
 * @apiName ViewAdminConfig
 * @apiGroup Config
 */
router.get(
    '/admin',
    [loginRequired, getRoleMiddleware, perm('serverConfig').can('change')],
    asyncRoute(async (req, res) => {
        const configs = {}

        for (let configName of configNames) {
            configs[configName] = await getConfig(configName)
        }

        res.json({ ...configs })
    })
)

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
router.patch(
    '/admin',
    [
        loginRequired,
        getRoleMiddleware,
        perm('serverConfig').can('change'),
        changeableConfigs.map(config => config.check.optional()),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        for (let { key } of changeableConfigs) {
            if (req.body[key] != undefined) {
                await setConfig(key, req.body[key])
            }
        }

        res.status(200).end()
    })
)

/**
 * @api {get} /config/reset 서버 설정 초기화
 * @apiDescription 서버의 모든 설정 정보를 초기화
 * @apiName ResetConfig
 * @apiGroup Config
 */
router.post(
    '/reset',
    [
        loginRequired,
        getRoleMiddleware,
        perm('serverConfig').can('change'),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        await setDefaultConfigs()
        res.end()
    })
)

export default router
