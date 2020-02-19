import { Router } from 'express'
import { asyncRoute, validateParams } from '../../utils/api'
import { perm } from '../../utils/role'
import { param } from 'express-validator'
import PreUser from '../../models/PreUser'

const router = Router()

// 승인 대기중인 유저 목록 가져오기
router.get(
    '/',
    [],
    asyncRoute(async (req, res) => {
        const users = await PreUser.find()

        res.json({
            users: users.map(user => {
                return {
                    username: user.username,
                }
            }),
        })
    })
)

// 유저를 정회원으로 승인
router.post(
    '/:username',
    [param('username'), validateParams],
    asyncRoute(async (req, res) => {
        const user = await PreUser.findOne()
            .where('username')
            .equals(req.params.username)
        if (!user) {
            const err = new Error('해당 유저가 존재하지 않습니다.')
            err.status = 400
            throw err
        }

        await user.accept()

        await user.remove()

        res.end()
    })
)

// 유저 승인 거절
router.delete(
    '/:username',
    [],
    asyncRoute(async (req, res) => {
        const user = await PreUser.findOne()
            .where('username')
            .equals(req.params.username)
        if (!user) {
            const err = new Error('해당 유저가 존재하지 않습니다.')
            err.status = 400
            throw err
        }

        await user.remove()

        res.end()
    })
)

export default router
