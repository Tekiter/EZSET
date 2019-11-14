import { Router } from 'express'
import { body, param } from 'express-validator'
import { validateParams, asyncRoute } from '../../utils/api'

import role from '../../utils/role'

const router = Router()

router.get(
    '/',
    [],
    asyncRoute(async (req, res) => {
        const roles = await role.getacRoles()

        res.json({ roles })
    })
)

router.post(
    '/',
    [
        body('name')
            .isString()
            .not()
            .isEmpty(),

        validateParams,
    ],
    asyncRoute(async (req, res) => {
        await role.createRole(req.body.name)
        res.status(201).json({ message: 'role created' })
    })
)

router.get(
    '/:tag',
    [param('tag').isString()],
    asyncRoute(async (req, res) => {
        const result = await role.getGrant(req.params.tag)
        if (result) {
            res.json({ permissions: result })
        } else {
            res.status(404).json({ message: '올바르지 않은 역할 태그입니다.' })
        }
    })
)

export default router
