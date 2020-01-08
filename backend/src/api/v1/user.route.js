import { Router } from 'express'
import {
    asyncRoute,
    checkRoleTag,
    checkUsername,
    validateParams,
} from '../../utils/api'
import { param, body } from 'express-validator'
import User from '../../models/User'
import { clearCache } from 'cachegoose'

const router = Router()

router.get('/', [], (req, res) => {
    if (req.perm('board', '1234').can('write', 'own')) {
        res.json({ message: req.permission })
    }
})

router.get(
    '/:username/role',
    [param('username').isString(), validateParams],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)
            .select('roles')
        // .cache(0, 'USER-ROLE-' + req.user.username)

        if (!user) {
            const err = new Error('해당 유저가 없습니다.')
            err.status = 404
            throw err
        }

        res.json({
            roles: user.roles,
        })
    })
)

router.post(
    '/:username/role',
    [
        // param('username').isString(),
        param('username').custom(checkUsername),
        body('roletag').custom(checkRoleTag),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)

        if (!user) {
            const err = new Error('해당 유저가 없습니다.')
            err.status = 404
            throw err
        }

        if (user.roles.indexOf(req.body.roletag) == -1) {
            user.roles.push(req.body.roletag)
            await user.save()
        }
        clearCache('USER-ROLE-' + req.user.username)
        res.status(200).json({})
    })
)

router.delete(
    '/:username/role/:roletag',
    [
        param('username').custom(checkUsername),
        param('roletag').custom(checkRoleTag),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)

        if (!user) {
            const err = new Error('해당 유저가 없습니다.')
            err.status = 404
            throw err
        }

        const idx = user.roles.indexOf(req.params.roletag)
        if (idx != -1) {
            user.roles.splice(idx, 1)
            await user.save()
        }
        clearCache('USER-ROLE-' + req.user.username)
        res.status(200).json({})
    })
)

export default router
