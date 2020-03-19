import Router from 'express'
import { asyncRoute, validateParams, checkUsername } from '../../utils/api'
import Penalty from '../../models/Penalty/Penalty'
import PenaltyConfig from '../../models/Penalty/PenaltyConfig'
import AttendanceUser from '../../models/attendanceUser'
import { perm } from '../../utils/role'
import { param, body, query } from 'express-validator'
const router = Router()
var moment = require('moment')

//get penalty
// penalty.canOwn('read')
router.get(
    '/read/:username', [
        perm('penalty').can('read'),
        param('username').isString(),
        query('start_date').isString(),
        query('end_date').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        var result = []
        var attendanceUser = await AttendanceUser.findOne({
            name: req.params.username,
        }).select({ _id: 0, __v: 0, name: 0 })

        var penaltyConfig = await PenaltyConfig.find()

        attendanceUser.status.forEach(element => {
            if (
                moment(element.date) >= moment(req.query.start_date) &&
                moment(element.date) <= moment(req.query.end_date)
            ) {
                if (element.state == 'late') {
                    var Val = penaltyConfig.find((item, idx) => {
                        return item.key === '지각'
                    })
                    result.push({
                        username: req.params.username,
                        type: '지각',
                        date: moment(element.date).format('YYYY-MM-DD'),
                        description: '지각',
                        point: Val.value,
                    })
                }
                if (element.state == 'absence') {
                    var val = penaltyConfig.find((item, idx) => {
                        return item.key === '결석'
                    })
                    result.push({
                        username: req.params.username,
                        type: '결석',
                        date: moment(element.date).format('YYYY-MM-DD'),
                        description: '결석',
                        point: val.value,
                    })
                }
            }
        })

        var penalty = await Penalty.find({
            username: req.params.username,
            date: {
                $gte: moment(req.query.start_date).format('YYYY-MM-DD'),
                $lte: moment(req.query.end_date).format('YYYY-MM-DD'),
            },
        })

        penalty.forEach(element => {
            var val = penaltyConfig.find((item, idx) => {
                return item.key === element.type
            })
            result.push({
                username: req.params.username,
                type: element.type,
                date: moment(element.date).format('YYYY-MM-DD'),
                description: element.description,
                point: val.value,
            })
        })

        res.json(result)
    })
)

//write config
router.post(
    '/write', [
        perm('penalty').can('update'),
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
    '/delete/', [
        perm('penalty').can('update'),
        body('username').isString(),
        body('date').isString(),
        body('type').isString(),
        validateParams,
    ],
    asyncRoute(async function(req, res) {
        console.log(req.query.type)
        await Penalty.findOneAndDelete({
            type: req.body.type,
            username: req.body.username,
            date: req.body.date,
            description: req.body.description,
        })
        res.end()
    })
)

export default router