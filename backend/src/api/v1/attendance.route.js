import Router from 'express'
import { asyncRoute } from '../../utils/api'
const AttendanceDay = require('../../models/AttendanceDay')
const AttendanceUser = require('../../models/AttendanceUser')
const router = Router()
var moment = require('moment')

//date,state,name
router.post(
    '/attendanceDay',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        try {
            var pp = await AttendanceDay.findOne()
                .where('day')
                .equals(Date)
            if (!pp) {
                var attendanceDay = new AttendanceDay()
                attendanceDay.day = Date
                attendanceDay.addStatus(req.body.name, req.body.state)
                res.json({
                    message: 'status create',
                    result: 1,
                })
            } else {
                pp.addStatus(req.body.name, req.body.state)
                res.json({
                    message: 'status update',
                    result: 1,
                })
            }
        } catch (err) {
            //console.log(err)
            res.status(501).json(err)
        }
    })
)

//name,state
router.post(
    '/attendanceUser',
    asyncRoute(async function(req, res) {
        var Date = moment().format('YYYYMMDD')
        var Name = req.body.name
        try {
            var pp = await AttendanceUser.findOne()
                .where('name')
                .equals(Name)
            if (!pp) {
                var attendanceUser = new AttendanceUser()
                attendanceUser.name = Name
                attendanceUser.addStatus(Date, req.body.state)
                res.json({
                    message: 'status create',
                    result: 1,
                })
            } else {
                pp.addStatus(Date, req.body.state)
                res.json({
                    message: 'status update',
                    result: 1,
                })
            }
        } catch (err) {
            //console.log(err)
            res.status(501).json(err)
        }
    })
)

export default router
