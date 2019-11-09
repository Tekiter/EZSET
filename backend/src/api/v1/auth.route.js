import { Router } from 'express'

import auth from '../../utils/auth'
import { databaseError, unexpectedError } from '../../utils/api'
import User from '../../models/User'

const router = Router()

router.route('/login').post(async (req, res) => {
    try {
        const user = await User.findOne()
            .where('username')
            .equals(req.body.username)

        if (user && user.checkPassword(req.body.password)) {
            const accessToken = await auth.createAccessToken(user)

            res.status(200).json({
                accessToken,
            })
        } else {
            res.status(403).json({ message: 'login failed' })
        }
    } catch (error) {
        databaseError(res, error)
    }
})

router.route('/register').post(async (req, res) => {
    try {
        const user = new User({
            username: req.body.username,
            password: req.body.password,
            info: {
                realname: req.body.realname,
            },
        })
        await user.save()

        res.status(201).json({ message: 'success' })
    } catch (error) {
        unexpectedError(res, error)
    }
})

export default router
