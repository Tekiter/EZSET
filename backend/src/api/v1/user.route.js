import { Router } from 'express'
import { loginRequired } from '../../utils/auth'
import { getPermission } from '../../utils/role'

const router = Router()

router.get('/', [loginRequired, getPermission], (req, res) => {
    res.json({ message: req.permission })
})

export default router
