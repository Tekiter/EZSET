import axiosCommon from './../service/axios.common.service'

export class AttendanceController {
    static createAttendance = async (username, realname, state, date) => {
        try {
            const result = await axiosCommon.post('/v2/attendance', {
                username,
                realname,
                state,
                date,
            })
            return result.data
        } catch (err) {
            return err
        }
    }

    static getAttendanceByDate = async date => {
        try {
            const result = await axiosCommon.get(`/v2/attendance/${date}`)
            return result.data
        } catch (err) {
            return err
        }
    }

    static getAttendanceByUsernameAndDateBetweenStartDateAndEndDate = async (
        username,
        startDate,
        endDate
    ) => {
        try {
            const result = await axiosCommon.get(
                `/v2/attendance/${username}/date`,
                {
                    params: {
                        startDate,
                        endDate,
                    },
                }
            )
            return result.data
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
                `/v2/attendance/${username}/date`,
                {
                    params: {
                        startDate,
                        endDate,
                    },
                }
            )
            return result.data
        } catch (err) {
            return err
        }
    }

    static deleteAttendanceByUsernameAndDate = async (username, date) => {
        try {
            const result = await axiosCommon.delete(
                `/v2/attendance/${username}/${date}`
            )
            return result.data
        } catch (err) {
            return err
        }
    }
    static deleteAttendanceByStartDateAndEndDate = async (
        startDate,
        endDate
    ) => {
        try {
            const result = await axiosCommon.delete('/v2/attendance/', {
                params: { startDate, endDate },
            })
            return result.data
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
            const result = await axiosCommon.patch(
                `/v2/attendance/${username}/${date}`,
                { state }
            )
            return result.data
        } catch (err) {
            return err
        }
    }
}
