import { Router } from 'express'
import { body } from 'express-validator'

import auth from '../../utils/auth'
import { databaseError, unexpectedError, validateParams } from '../../utils/api'
import User from '../../models/User'

const router = Router()

router
    .route('/login')
    .post(
        [
            body('username').isString(),
            body('password').isString(),
            validateParams,
        ],
        async (req, res) => {
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
                    res.status(403).json({ message: '로그인 실패' })
                }
            } catch (error) {
                databaseError(res, error)
            }
        }
    )

router
    .route('/register')
    .post(
        [
            body('username').isString(),
            body('password').isString(),
            body('realname').isString(),
            validateParams,
        ],
        async (req, res) => {
            try {
                const exists = await User.count()
                    .where('username')
                    .equals(req.body.username)

                if (exists) {
                    res.status(409).json({
                        message: '이미 사용중인 아이디입니다.',
                    })
                    return
                }

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
        }
    )

export default router
