import { Router } from 'express'
import { validateParams, asyncRoute } from '../../utils/api'
import User from '../../models/User'

const router = Router()

// 유저 정보 조회하여 회원 정보를 넘겨줌
router.route('/').get(
    [validateParams],
    asyncRoute(async (req, res) => {
        const user = await User.findOne()
            .where('username')
            .equals(req.user.username)
            .select('username info')

        res.json({
            username: user.username,
            realname: user.info.realname,
            email: user.info.email,
        })
    })
)

export default router
