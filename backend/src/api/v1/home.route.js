import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { getConfig, setConfig } from '../../utils/config'
// import { perm } from '../../utils/role'
import { body } from 'express-validator'

const router = Router()

router.get(
    '/simple',
    [],
    asyncRoute(async (req, res) => {
        const content = await getConfig('homeSimpleContent', '')
        res.json({ content })
    })
)

router.patch(
    '/simple',
    [
        // perm('manageHome').can('update'),
        body('content').isString(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        await setConfig('homeSimpleContent', req.body.content)

        res.end()
    })
)

export default router
