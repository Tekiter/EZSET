/*
role.route.js
Role과 거기에 대한 권한을 관리하는 API

필요한 기능
- 역할 생성  O
- 역할 목록 조회  O
- 역할 정보 조회  O
- 역할 권한 조회
- 역할 정보 (이름) 변경
- 역할 삭제  O
- 역할 권한 추가
- 역할 권한 제거
- 유저에게 역할 부여

*/

import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import { body, param } from 'express-validator'
import role from '../../utils/role'
import User from '../../models/User'

const router = Router()

router.route('/me').get(
    [role.perm('role').canOwn('read'), validateParams],
    asyncRoute(async (req, res) => {
        const userRoles = await role.getUserRoles(req.user.username)
        const userPerms = userRoles.map(i => {
            return role.roles.export(i).perm
        })

        res.json({
            roles: userRoles,
            perms: [role.roles.getDefault().getPerm(), ...userPerms],
        })
    })
)

// 모든 역할 목록 조회
router.route('/').get(
    [role.perm('role').can('read'), validateParams],
    asyncRoute(async (req, res) => {
        const roles = await role.getRoleNames()
        res.json(roles)
    })
)

// 역할 생성
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

// 역할 정보 조회
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

// 역할 권한 변경
router.route('/:role_tag').patch(
    [
        param('role_tag').isString(),
        // body('mode').custom(value => ['grant', 'deny'].includes(value)),
        param('grant').isArray(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        res.end()
    })
)

// 역할 제거
router.route('/:role_tag').delete(
    [validateParams],
    asyncRoute(async (req, res) => {
        // NOT IMPLEMENTED
    })
)

export default router
