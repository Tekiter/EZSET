import { Router } from 'express'
//import AttendanceDay from '../../models/attendanceDay'
import AttendanceUser from '../../models/attendanceUser'
const router = Router()

router.get('/test', (req, res) => {
    var attendanceUser = new AttendanceUser()
    attendanceUser.name = 'admin'
    attendanceUser.attendance_day = Date.now()
    attendanceUser.status = '정상출석'
    attendanceUser.save()
    res.json({
        message: 'ddiba',
    })
})

export default router
