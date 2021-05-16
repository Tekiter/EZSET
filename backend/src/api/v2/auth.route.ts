import { body } from 'express-validator'
import { UserController } from '../../controller/user.controller'
import { AuthController } from '../../controller/auth.controller'
import { createAPIRouter, validateParams } from '../../utils/api'

const router = createAPIRouter()
router.loginNotRequired = true

router
    .route('/login')
    .post([
        body('username').isString(),
        body('password').isString(),
        validateParams,
        AuthController.login,
    ])

router.route('/register').post([
    body('username').isString(),
    body('password').isString(),
    body('realname').isString(),
    body('email')
        .isEmail()
        .optional({ checkFalsy: true }),
    validateParams,
    UserController.register,
])

export default router
