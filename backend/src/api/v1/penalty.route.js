import Router from 'express'
import { asyncRoute, validateParams, checkUsername } from '../../utils/api'
import Penalty from '../../models/Penalty/Penalty'
import { perm } from '../../utils/role'
import { param, body } from 'express-validator'
const router = Router()
var moment = require('moment')

//get penalty
// penalty.canOwn('read')
router.get(
    '/read', [
        perm('attendance').can('update'),
        body('start_date').isString(),
        body('end_date').isString(),
        body('username').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var penalty = await Penalty.find({
            date: {
                $gte: moment(req.body.start_date).format('YYYY-MM-DD'),
                $lte: moment(req.body.end_date).format('YYYY-MM-DD'),
            },
        }).sort({ date: 1 })
        res.send(penalty)
    })
)

//write config
router.post(
    '/write', [
        perm('attendance').can('update'),
        body('type').isString(),
        body('date').isString(),
        body('username').isString(),
        body('description').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var penalty = new Penalty()
        penalty.type = req.body.type
        penalty.username = req.body.username
        penalty.date = req.body.date
        penalty.description = req.body.description

        await penalty.save()
        res.end()
    })
)

//delete config
router.post(
    '/delete', [
        perm('attendance').can('update'),
        body('type').isString(),
        body('date').isString(),
        body('username').isString(),
        body('description').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await Penalty.findOneAndDelete({
            type: req.body.type,
            username: req.body.username,
            date: req.body.date,
            description: req.body.description,
        })
        res.end()
    })
)

//delete config
router.post(
    '/update', [
        perm('attendance').can('update'),
        body('type').isString(),
        body('date').isString(),
        body('username').isString(),
        body('description').isString(),
        body('ntype').isString(),
        body('ndate').isString(),
        body('ndescription').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        await Penalty.findOneAndUpdate({
            type: req.body.type,
            username: req.body.username,
            date: req.body.date,
            description: req.body.description,
        }, {
            type: req.body.ntype,
            date: req.body.ndate,
            description: req.body.ndescription,
        })
        res.end()
    })
)
export default router