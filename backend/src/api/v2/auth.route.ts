import { body } from 'express-validator'
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

export default router
