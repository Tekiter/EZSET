import axiosCommon from './axios.common.service'

export class AttendanceController {
    static getAttendanceByDate = async date => {
        try {
            const result = await axiosCommon.get(`/v2/Attendance/${date}`)
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static getAttendanceByUsernameAndDate = async (
        username,
        startDate,
        endDate
    ) => {
        try {
            const result = await axiosCommon.get(
                `/v2/Attendance/${username}/date`,
                {
                    params: {
                        startDate,
                        endDate,
                    },
                }
            )
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static deleteAttendance = async _id => {
        try {
            const result = await axiosCommon.delete(`/v2/Attendance/${_id}`)
            return result.data.result
        } catch (err) {
            return err
        }
    }
}
