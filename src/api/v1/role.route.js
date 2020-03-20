/*
role.route.js
Role과 거기에 대한 권한을 관리하는 API

*/

import { Router } from 'express'
import { validateParams, asyncRoute, checkRoleTag } from '../../utils/api'
import { body, param } from 'express-validator'
import role, { perm, roles } from '../../utils/role'
import permissions from '../../utils/role/permissions'
import User from '../../models/User'

const router = Router()

router.get(
    '/me',
    [perm('role').canOwn('read'), validateParams],
    asyncRoute(async (req, res) => {
        const userRoles = await role.getUserRoles(req.user.username)
        const userPerms = userRoles.map(i => {
            return role.roles.export(i).perm
        })

        res.json({
            roles: userRoles,
            perms: [role.roles.export('default').perm, ...userPerms],
        })
    })
)

// 모든 역할 목록 조회
router.get(
    '/',
    [perm('role').can('modify'), validateParams],
    asyncRoute(async (req, res) => {
        let roles = await role.getRoleNames()

        roles = roles
            .filter(item => !['admin', 'default'].includes(item.tag))
            .sort((a, b) => a.name.localeCompare(b.name))

        res.json([
            { tag: 'default', name: '모든 유저' },
            { tag: 'admin', name: '관리자' },
            ...roles,
        ])
    })
)

// 역할 생성
router.post(
    '/',
    [perm('role').can('modify'), body('name').isString(), validateParams],
    asyncRoute(async (req, res) => {
        // if (req.user.perm('role').can('create')) {
        //     const newrole = await role.createRole({ name: req.body.name })
        //     res.json(newrole)
        // } else {
        //     const err = new Error('권한이 없습니다.')
        //     err.status = 403
        //     throw err
        // }
        const newrole = await role.createRole({
            name: req.body.name,
        })
        res.json(newrole)
    })
)

router.get(
    '/managepage',
    [validateParams],
    asyncRoute(async (req, res) => {
        res.json(permissions.managePage)
    })
)

// 역할 정보 조회
router.get(
    '/:role_tag',
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

// 역할 유저 조회
router.get(
    '/:role_tag/users',
    [param('role_tag').custom(checkRoleTag), validateParams],
    asyncRoute(async (req, res) => {
        const users = await User.find({ roles: req.params.role_tag }).select(
            'username info'
        )
        res.json({
            users: users.map(user => {
                return { username: user.username, realname: user.info.realname }
            }),
        })
    })
)

// 역할 권한 변경
router.patch(
    '/:role_tag',
    [
        perm('role').can('modify'),
        param('role_tag').custom(checkRoleTag),
        body('name')
            .isString()
            .optional(),
        body('perms').isArray(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        if (req.params.role_tag == 'admin') {
            const err = new Error('admin 역할은 변경할 수 없습니다.')
            err.status = 400
            throw err
        }

        // Validation
        // 올바른 perm 배열인지 체크
        for (let item of req.body.perms) {
            if (
                !item.resource ||
                !item.action ||
                !(item.range || item.range == 'any' || item.range == 'own')
            ) {
                const err = new Error('Invalid action')
                err.status = 400
                throw err
            }
        }

        // 역할 name 변경
        if (req.body.name) {
            roles.getRole(req.params.role_tag).name = req.body.name
        }

        // 수정할 데이터를 Role 에 반영
        const context = roles.role(req.params.role_tag)
        for (let item of req.body.perms) {
            const resource = context.resource(
                item.resource,
                item.param != undefined ? item.param + '' : undefined
            )
            if (item.allow) {
                resource.can(item.action, item.range)
            } else {
                resource.cannot(item.action, item.range)
            }
        }

        await role.updateRole(req.params.role_tag)

        res.end()
    })
)

// 역할 제거
router.delete(
    '/:role_tag',
    [
        perm('role').can('modify'),
        param('role_tag').custom(checkRoleTag),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        if (req.params.role_tag == 'admin') {
            const err = new Error('admin 역할은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }
        if (req.params.role_tag == 'default') {
            const err = new Error('default 역할은 삭제할 수 없습니다.')
            err.status = 400
            throw err
        }

        await role.removeRole(req.params.role_tag)

        res.end()

        // NOT IMPLEMENTED
    })
)

export default router
