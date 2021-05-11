import { asyncRoute } from '../utils/api'
import { AuthService } from '../service/auth.service'

interface LoginData {
    username: string
    password: string
}

export class AuthController {
    static login = asyncRoute<LoginData>(async (req, res) => {
        const username = req.body.username
        const password = req.body.password

        const result = await AuthService.createAuthToken({
            username,
            password,
        })

        if (!result.success) {
            if (result.reason == 'STATE_PREUSER') {
                res.status(403).json({
                    message: '가입 승인 대기중입니다.',
                })
                return
            }
            res.status(403).json({
                message: '올바르지 않은 아이디 또는 비밀번호입니다.',
            })
            return
        }

        res.status(200).json({
            accessToken: result.token,
        })
    })
}
