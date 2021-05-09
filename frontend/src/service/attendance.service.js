import { AttendanceController } from './../controller/attendance.controller'
import axios from 'axios'

export class AttendanceService {
    static createAttendance = async (username, realname, date, state) => {
        try {
            const result = await AttendanceController.createAttendance(
                username,
                realname,
                state,
                date
            )
            return result.result
        } catch (err) {
            return err
        }
    }

    static getUserIdListByDate = async date => {
        try {
            const result = await AttendanceController.getAttendanceByDate(date)
            return result.result
        } catch (err) {
            return err
        }
    }

    static getAttendanceByDate = async date => {
        try {
            const result = await AttendanceController.getAttendanceByDate(date)
            return result.result
        } catch (err) {
            return err
        }
    }

    static getUsersWithoutAttendanceRecordByDate = async date => {
        try {
            const users = await axios.get('/user')

            const attendanceRecords = await AttendanceController.getAttendanceByDate(
                date
            )
            let result = []
            let attendanceRecordSet = new Set()
            attendanceRecords.result.forEach(attendanceRecord =>
                attendanceRecordSet.add(attendanceRecord.username)
            )
            users.data.users.forEach(user => {
                if (attendanceRecordSet.has(user.username) == false)
                    result.push({
                        username: user.username,
                        realname: user.realname,
                    })
            })
            return result
        } catch (err) {
            return err
        }
    }

    static updateAttendanceStateByUsernameAndDate = async (
        username,
        date,
        state
    ) => {
        try {
            const result = await AttendanceController.updateAttendanceStateByUsernameAndDate(
                username,
                date,
                state
            )
            return result.result
        } catch (err) {
            return err
        }
    }
}
