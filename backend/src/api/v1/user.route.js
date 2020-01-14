import { Router } from 'express'
import {
    asyncRoute,
    checkRoleTag,
    checkUsername,
    validateParams,
    isPositive,
} from '../../utils/api'
import { param, body, query } from 'express-validator'
import User from '../../models/User'
import { clearCache } from 'cachegoose'
import role from '../../utils/role'

const router = Router()

// router.get('/', [], (req, res) => {
//     if (req.perm('board', '1234').can('write', 'own')) {
//         res.json({ message: req.permission })
//     }
// })

router.route('/').get(
    [
        role.perm('manageUsers').can('access'),
        query('page')
            .custom(isPositive)
            .optional(),
        query('pagesize')
            .custom(isPositive)
            .optional(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        let query

        const total = await User.count()

        if (req.query.page) {
            // 페이지 쿼리 존재할때
            const page = parseInt(req.query.page)
            const pagesize = parseInt(req.query.pagesize || 30)

            query = User.find()
                .limit(pagesize)
                .skip((page - 1) * pagesize)
        } else {
            // 페이지 쿼리 없을 때
            query = User.find()
        }

        const users = await query.sort('username').select('username info roles')

        res.json({
            total,
            users: users.map(user => {
                return {
                    username: user.username,
                    realname: user.info.realname || '',
                    roles: user.roles,
                }
            }),
        })
    })
)

router.get(
    '/:username/role',
    [
        role.perm('role', 'user').can('read'),
        param('username').isString(),
        validateParams,
    ],
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
        role.perm('role', 'user').can('update'),
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
        role.perm('role', 'user').can('delete'),
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
