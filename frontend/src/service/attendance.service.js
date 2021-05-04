import { AttendanceController } from './../controller/attendance.controller'

export class AttendanceService {
    static getUserIdListByDate = async date => {
        try {
            const result = await AttendanceController.getAttendanceByDate(date)
            console.log(result)
            return result
        } catch (err) {
            return err
        }
    }
}
