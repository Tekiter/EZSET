import { Router } from 'express'

const router = Router()

router.get('/', [], (req, res) => {
    if (req.perm('board', '1234').can('write', 'own')) {
        res.json({ message: req.permission })
    }
})

export default router
