import { Router } from 'express'

const router = Router()

router.get('/', (req, res) => {
  res.json({ message: 'user' })
})

export default router
