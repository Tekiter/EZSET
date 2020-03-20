import { Router } from 'express'
import random from 'random-number-csprng'
import {
    asyncRoute,
    checkRoleTag,
    checkUsername,
    validateParams,
    isPositive,
    checkRoleTagArray,
} from '../../utils/api'
import { param, body, query } from 'express-validator'
import User from '../../models/User'
import { getConfig } from '../../utils/config'
import { clearCache } from 'cachegoose'
import role from '../../utils/role'

const router = Router()

// 유저의 전체 목록을 가져옴
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

// 유저 회원탈퇴
router.delete(
    '/:username',
    [param('username').custom(checkUsername), validateParams],
    asyncRoute(async (req, res) => {
        if (
            !role.perm('manageUsers').can('access') &&
            req.params.username === req.user.username
        ) {
            const err = new Error('권한이 없습니다.')
            err.status = 403
            throw err
        }

        if ((await getConfig('superAdmin')) == req.params.username) {
            const err = new Error('admin 계정은 탈퇴할 수 없습니다.')
            err.status = 403
            throw err
        }

        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)
        await user.remove()
        res.status(200).end()
    })
)

// 비밀번호 초기화
router.post(
    '/:username/resetpassword',
    [
        role.perm('manageUsers').can('access'),
        param('username').custom(checkUsername),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.params.username)
        const newpasswd =
            (await random(11, 35)).toString(36) +
            (await random(36 ** 7, 36 ** 8)).toString(36)
        user.password = newpasswd

        await user.save()

        res.json({ new_password: newpasswd })
    })
)

// 유저의 역할 가져오기
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

// 유저의 역할 변경
router.put(
    '/:username/role',
    [
        role.perm('role').can('modify'),
        param('username').custom(checkUsername),
        body('roletags').custom(checkRoleTagArray),
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

        if (req.body.roletags.indexOf('admin') < 0) {
            if ((await getConfig('superAdmin')) == req.params.username) {
                const err = new Error(
                    '서버 관리자의 어드민 역할은 변경할 수 없습니다.'
                )
                err.status = 403
                throw err
            }
        }

        if (req.body.roletags.includes('default')) {
            const err = new Error('default 역할은 변경할 수 없습니다.')
            err.status = 403
            throw err
        }

        user.roles = req.body.roletags
        await user.save()
        clearCache('USER-ROLE-' + req.user.username)

        res.end()
    })
)

// 유저의 역할 추가
router.post(
    '/:username/role',
    [
        role.perm('role').can('modify'),
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

        if (req.body.roletag == 'default') {
            const err = new Error('default 역할은 변경할 수 없습니다.')
            err.status = 403
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

// 유저의 역할 삭제
router.delete(
    '/:username/role/:roletag',
    [
        role.perm('role').can('modify'),
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

        if (req.params.roletag == 'admin') {
            if ((await getConfig('superAdmin')) == req.params.username) {
                const err = new Error(
                    '서버 관리자의 어드민 역할은 변경할 수 없습니다.'
                )
                err.status = 403
                throw err
            }
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
