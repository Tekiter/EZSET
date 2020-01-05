import { Router } from 'express'

// const AttendanceDay = require('../../models/AttendanceDay')
// const AttendanceUser = require('../../models/AttendanceUser')
import { asyncRoute } from '../../utils/api'
//var moment = require('moment')
const router = Router()

router.post(
    '/add',
    asyncRoute(async function(req, res) {
        //var cur = moment().format('YYYYMMDD')
        try {
            // const pp = await AttendanceDay.findOne({
            //     day: cur,
            // })
            // if (pp) {
            //     pp.addStatus('root', req.body.state)
            // } else {
            //     pp.day = cur
            //     pp.save
            // }

            //pp.addStatus('root', req.body.state)
            res.json({
                message: 'status update',
            })
        } catch (err) {
            //console.log(err)
            res.status(501).json(err)
        }
    })
)

export default router
