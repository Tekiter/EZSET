import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { body } from 'express-validator'
import { getConfig, setConfig } from '../../utils/config'

const router = Router()

// 서버 설정을 가져온다.
router.get(
    '/',
    asyncRoute(async (req, res) => {
        const configNames = ['groupName']
        const configs = {}

        for (let configName of configNames) {
            configs[configName] = await getConfig(configName)
        }

        res.json({ ...configs })
    })
)

router.post(
    '/groupName',
    [
        perm('serverConfig').can('access'),
        body('value').isString(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        await setConfig('groupName', req.body.value)

        res.status(200)
    })
)

export default router
