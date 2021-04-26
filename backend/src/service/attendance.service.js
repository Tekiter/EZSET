import { AttendanceDao } from '../dao/attendance.dao'
import { handleError } from '../models/Error'
export class AttendanceService {
    static createAttendance = async req => {
        const { username, realname, date, state } = req.body
        try {
            const result = AttendanceDao.createAttendance(
                username,
                realname,
                state,
                date
            )
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Create Attendance fail')
        }
    }

    static deleteAttendances = async req => {
        const { startDate, endDate } = req.query
        try {
            const result = await AttendanceDao.deleteAttendances(
                startDate,
                endDate
            )
            if (result.ok == 0) {
                throw new handleError(404, 'Attendance not found')
            }
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Delete Attendance fail')
        }
    }

    static deleteAttendance = async req => {
        const { username, date } = req.params
        try {
            const result = await AttendanceDao.deleteAttendance(username, date)
            if (result.ok == 0) {
                throw new handleError(404, 'Attendance not found')
            }
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Delete Attendance fail')
        }
    }

    static getAttendanceByDate = async req => {
        const { date } = req.params
        try {
            const result = await AttendanceDao.getAttendanceByDate(date)
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Attendance not found')
        }
    }

    static getAttendanceByPeriod = async req => {
        const { username } = req.params
        const { startDate, endDate } = req.query
        try {
            const result = await AttendanceDao.getAttendanceByPeriod(
                username,
                startDate,
                endDate
            )
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Attendance not found')
        }
    }

    static updateAttendance = async req => {
        const { username, date } = req.params
        const { state } = req.body
        try {
            const result = await AttendanceDao.updateAttendance(
                username,
                date,
                state
            )
            return result
        } catch (err) {
            console.log(err)
            throw new handleError(404, 'Attendance not found')
        }
    }
}
