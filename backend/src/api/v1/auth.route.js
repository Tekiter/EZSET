import { Router } from 'express'

const router = Router()

router.route('/').get((req, res) => {
  res.json({ message: 'auth' })
})

export default router
