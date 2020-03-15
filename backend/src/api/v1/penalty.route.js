import Router from 'express'
import { asyncRoute, validateParams, checkUsername } from '../../utils/api'
import User from '../../models/User'
import Penalty from '../../models/Penalty/Penalty'
import PenaltyConfig from '../../models/Penalty/PenaltyConfig'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
const router = Router()

//get penalty
router.get(
    '/read', [perm('penalty').canOwn('read')],
    asyncRoute(async function(req, res) {
        const cursor = await PenaltyConfig.find()
        res.json(cursor)
    })
)

//write config
router.post('/write')
export default router