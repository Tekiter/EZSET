import { UserService } from '../service/user.service'
import { isValidPassword, isValidUsername } from '../utils/user'
import { asyncRoute } from '../utils/api'

interface RegisterData {
    username: string
    password: string
    realname: string
    email: string
}

interface RegisterDataCheckResult {
    success: boolean
    message?: string
}

function registerDataCheck(data: RegisterData): RegisterDataCheckResult {
    const form = {
        username: {
            checker: isValidUsername,
            message: '아이디는 6~12자의 영문 소문자, 숫자만 사용 가능합니다.',
        },
        password: {
            checker: isValidPassword,
            message:
                '비밀번호는 8자 이상의 영문자와 숫자를 필수로 사용해야 합니다.',
        },
    }

    for (const key in form) {
        if (!form[key].checker(data[key])) {
            return { success: false, message: form[key].message }
        }
    }
    return { success: true }
}

export class UserController {
    static register = asyncRoute<RegisterData>(async (req, res) => {
        const { username, password, realname, email } = req.body

        const valid = registerDataCheck({ username, password, realname, email })

        if (!valid.success) {
            res.status(400).json({
                message: valid.message,
            })
            return
        }

        if (await UserService.isDuplicateUsername(username)) {
            res.status(409).json({
                message: '이미 사용중인 아이디입니다.',
            })
        }

        await UserService.createUser({
            username,
            password,
            realname,
            email,
        })

        res.status(201).json({
            message: 'success',
        })
    })
}
