import axiosCommon from './axios.common.service'

export class PenaltyService {
    static createPenalty = async (users, type, description, date) => {
        try {
            const result = await axiosCommon.post('/v2/penalty', {
                users,
                type,
                description,
                date,
            })
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static getPenaltys = async (start, end) => {
        try {
            const result = await axiosCommon.get('/v2/penalty', {
                params: {
                    start,
                    end,
                },
            })
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static getPenalty = async (username, start, end) => {
        try {
            const result = await axiosCommon.get(`/v2/penalty/${username}`, {
                params: {
                    start,
                    end,
                },
            })
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static deletePenalty = async _id => {
        try {
            const result = await axiosCommon.delete(`/v2/penalty/${_id}`)
            return result.data.result
        } catch (err) {
            return err
        }
    }
}
