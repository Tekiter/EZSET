import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { loginRequired } from '../../utils/auth'
import { getRoleMiddleware } from '../../utils/role'
import { perm } from '../../utils/role'
import { body } from 'express-validator'
import { getConfig, setConfig } from '../../utils/config'

const router = Router()
router.loginNotRequired = true

const configNames = ['groupName', 'usePreUser']

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
]

// 서버 설정을 가져온다.
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

// 서버 전체 설정을 가져온다.
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

// 변경 가능한 서버 설정들을 수정한다.
// body에 Object 로 key: value 쌍을 넣으면 반영된다.
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
            await setConfig(key, req.body[key])
        }

        res.status(200).end()
    })
)

export default router
