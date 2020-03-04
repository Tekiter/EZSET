import { Router } from 'express'
import { body } from 'express-validator'

import auth from '../../utils/auth'
import {
    databaseError,
    unexpectedError,
    validateParams,
    asyncRoute,
} from '../../utils/api'
import User from '../../models/User'

const router = Router()
router.loginNotRequired = true

/**
 * @api {post} /auth/login 유저 로그인
 * @apiNmae 유저 로그인
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 *
 * @apiSuccess {JWT} accessToken 인증 토큰
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 */
router.route('/login').post(
    [body('username').isString(), body('password').isString(), validateParams],
    asyncRoute(async (req, res) => {
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
                res.status(403).json({
                    message: '로그인 실패',
                })
            }
        } catch (error) {
            databaseError(res, error)
        }
    })
)

router.route('/register').post(
    [
        body('username').isString(),
        body('password').isString(),
        body('realname').isString(),
        body('email').isEmail(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
        try {
            let idreg = /^[a-z0-9]{6,12}$/
            if (!idreg.test(req.body.username)) {
                res.status(400).json({
                    message:
                        '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.',
                })
                return
            }

            let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/
            if (!pwreg.test(req.body.password)) {
                res.status(400).json({
                    message:
                        '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',
                })
                return
            }

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
                    email: req.body.email,
                },
            })
            await user.save()

            res.status(201).json({
                message: 'success',
            })
        } catch (error) {
            unexpectedError(res, error)
        }
    })
)

router.route('/register/doublecheck/username').post(
    [body('username').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const exits = await User.count()
                .where('username')
                .equals(req.body.username)
            if (exits) {
                res.status(409).json({
                    message: '이미 사용중인 아이디입니다.',
                })
                return
            }
            res.status(200).end()
        } catch (error) {
            unexpectedError(res, error)
        }
    })
)
router.route('/edittoken/issue').post(
    [body('username').isString(), body('password').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const user = await User.findOne()
                .where('username')
                .equals(req.body.username)

            if (user && user.checkPassword(req.body.password)) {
                const editToken = await auth.createEditToken(req.body.username)

                res.status(200).json({
                    editToken,
                })
            } else {
                res.status(403).json({ message: '토큰 발급 실패' })
            }
        } catch (error) {
            databaseError(res, error)
        }
    })
)
router.route('/edittoken/check').post(
    [body('edittoken').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const decoded = await auth.checkToken(req.body.edittoken)
            if (
                decoded.is_edit_token &&
                decoded.username === req.user.username
            ) {
                res.status(200).end()
            }
        } catch (err) {
            res.status(403).end()
        }
    })
)
export default router
