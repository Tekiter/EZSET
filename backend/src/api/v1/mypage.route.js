import { Router } from 'express'
import { body } from 'express-validator'
import auth from '../../utils/auth'
import { validateParams, asyncRoute } from '../../utils/api'
import User from '../../models/User'
import { checkToken } from '../../utils/auth'

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
),
    router.route('/edit').post(
        [
            body('username').isString(),
            body('password').isString(),
            body('realname').isString(),
            body('email').isEmail(),
            body('edittoken').isString(),
            validateParams,
        ],
        asyncRoute(async (req, res) => {
            try {
                let decoded
                try {
                    decoded = await auth.checkToken(req.body.edittoken)
                } catch (error) {
                    const err = new Error('토큰이 만료되었습니다.')
                    err.status = 403
                    throw err
                }
                if (decoded.username == req.body.username) {
                    console.log(100)
                    if (req.body.password != '') {
                        let pwreg = /^(?=.*[A-Za-z]+)(?=.*[0-9]+)(?=.*[`~!@#$%^&*()\-_+=;:"'?.,<>[\]{}/\\|]*).{8,16}$/
                        if (!pwreg.test(req.body.password)) {
                            res.status(400).json({
                                message:
                                    '비밀번호는 8~16자로 영문대 소문자, 숫자, 특수문자를 사용하세요',
                            })
                            return
                        }
                    }

                    const user = await User.findOne()
                        .where('username')
                        .equals(req.body.username)
                    if (req.body.realname != '') {
                        user.info.realname = req.body.realname
                        console.log(user.info.realname)
                    }
                    if (req.body.email != '') {
                        user.info.email = req.body.email
                        console.log(req.body.email)
                    }
                    if (req.body.password != '') {
                        user.info.password = req.body.password
                        console.log('passwordedit')
                    }
                    user.markModified('info')
                    await user.save()

                    res.status(201).json({ message: 'success' })
                } else {
                    res.status(403).json({
                        message: '정상적인 접근이 아닙니다',
                    })
                }
            } catch (error) {
                console.log(error)
            }
        })
    )

export default router
