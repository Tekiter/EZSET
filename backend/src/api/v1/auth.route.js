import { Router } from 'express'
import { body } from 'express-validator'

import { getConfig } from '../../utils/config'
import auth from '../../utils/auth'
import {
    databaseError,
    unexpectedError,
    validateParams,
    asyncRoute,
} from '../../utils/api'
import User from '../../models/User'
import PreUser from '../../models/PreUser'

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
                const user = await PreUser.findOne()
                    .where('username')
                    .equals(req.body.username)

                if (user) {
                    res.status(403).json({ message: '가입 승인 대기중입니다.' })
                } else {
                    res.status(403).json({
                        message: '올바르지 않은 아이디 또는 비밀번호입니다.',
                    })
                }
            }
        } catch (error) {
            const err = new Error('알 수 없는 오류가 발생했습니다.')
            err.status = 500
            throw err
        }
    })
)

/**
 * @api {post} /auth/register 유저 회원가입
 * @apiNmae 유저 회원가입
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 * @apiParam {String} realname 유저 실명
 * @apiParam {Email} email 유저 이메일
 *
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 201 OK
 */
router.route('/register').post(
    [
        body('username').isString(),
        body('password').isString(),
        body('realname').isString(),
        body('email').isEmail(),
        validateParams,
    ],
    asyncRoute(async (req, res) => {
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

        const existsPreuser = await PreUser.count()
            .where('username')
            .equals(req.body.username)

        if (exists || existsPreuser) {
            res.status(409).json({
                message: '이미 사용중인 아이디입니다.',
            })
            return
        }

        const userData = {
            username: req.body.username,
            password: req.body.password,
            info: {
                realname: req.body.realname,
                email: req.body.email,
            },
        }

        // 회원승인제 설정이 도입되어있으면 PreUser 에 회원가입 넣기
        let user
        if (await getConfig('usePreUser', false)) {
            user = new PreUser(userData)
        } else {
            user = new User(userData)
        }
        await user.save()

        res.status(201).json({
            message: 'success',
        })
    })
)

/**
 * @api {post} /auth/register/doublecheck/username 유저 중복 아이디 체크
 * @apiNmae 유저 중복 아이디 체크
 * @apiGroup Auth
 * @apiDescription 유저가 화원가입 할 시 username을 중복 체크
 *
 * @apiParam {String} username 유저 아이디
 *
 * @apiError {Number} 200 사용할 수 있는 아이디
 *
 * @apiError {Number} 409 username 중복 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 409
 *       {
 *          message: '이미 사용중인 아이디입니다.',
 *        }
 */
router.route('/register/doublecheck/username').post(
    [body('username').isString(), validateParams],
    asyncRoute(async (req, res) => {
        try {
            const exits = await User.count()
                .where('username')
                .equals(req.body.username)
            const existsPreuser = await PreUser.count()
                .where('username')
                .equals(req.body.username)

            if (exits || existsPreuser) {
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

/**
 * @api {post} /auth/edittoken/issue 유저 회원정보 보안 토큰 발급
 * @apiNmae 유저 회원정보 보안 토큰 발급
 * @apiGroup Auth
 *
 * @apiParam {String} username 유저 아이디
 * @apiParam {String} password 유저 비밀번호
 *
 * @apiSuccess {JWT} editToken 회원정보 보안 토큰
 * @apiSuccessExample Success-Response:
 *  HTTP/1.1 200 OK
 *
 * @apiError {Number} 403 회원정보 보안 토큰 발급 실패 에러
 * @apiErrorExample {json} Error-Response:
 *       HTTP/1.1 403
 *       {
 *          message: '토큰 발급 실패',
 *        }
 */
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

/**
 * @api {post} /auth/edittoken/check 유저 회원정보 보안 토큰 유효성 검사
 * @apiNmae 유저 회원정보 보안 토큰 유효성 검사
 * @apiGroup Auth
 *
 * @apiParam {JWT} editToken 회원정보 보안 토큰
 *
 * @apiSuccess {Number} 200 회원정보 보안 토큰이 유효함
 *
 * @apiError {Number} 403 회원정보 보안 토큰이 유효하지 않음
 */
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
