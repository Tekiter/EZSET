import { Router } from 'express'
import { loginRequired } from '../../utils/auth'

const router = Router()

router.get('/', [loginRequired], (req, res) => {
    res.json({ message: 'user' })
})

export default router
