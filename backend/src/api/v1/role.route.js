import { Router } from 'express'
import { body } from 'express-validator'
import { validateParams } from '../../utils/api'

import role from '../../utils/role'

const router = Router()

router.get('/', [], async (req, res) => {
    const roles = await role.getRoles()

    res.json({ roles })
})

router.post(
    '/',
    [
        body('name')
            .isString()
            .not()
            .isEmpty(),
        validateParams,
    ],
    async (req, res) => {
        await role.createRole(req.body.name)
        res.status(201).json({ message: 'role created' })
    }
)

export default router
