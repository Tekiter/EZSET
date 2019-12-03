import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body, param } from 'express-validator'
import role from '../../utils/role'

const router = Router()

router.route('/').get(
    [validateParams],
    asyncRoute(async (req, res) => {
        const roles = await role.getRoleNames()
        res.json(roles)
    })
)

router.route('/').post(
    [role.perm('role').can('create'), body('name').isString(), validateParams],
    asyncRoute(async (req, res) => {
        // if (req.user.perm('role').can('create')) {
        //     const newrole = await role.createRole({ name: req.body.name })
        //     res.json(newrole)
        // } else {
        //     const err = new Error('권한이 없습니다.')
        //     err.status = 403
        //     throw err
        // }
        const newrole = await role.createRole({ name: req.body.name })
        res.json(newrole)
    })
)

router.route('/:role_tag').get(
    [param('role_tag').isString(), validateParams],
    asyncRoute(async (req, res) => {
        if (role.roles.hasRole(req.params.role_tag)) {
            const roleobj = role.roles.export(req.params.role_tag)
            res.json(roleobj)
        } else {
            const err = new Error('invalid role tag')
            err.status = 404
            throw err
        }
    })
)

router
    .route('/:role_tag')
    .post(
        [param('role_tag').isString(), validateParams],
        asyncRoute(async (req, res) => {})
    )

export default router
