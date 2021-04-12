import axiosCommon from './axios.common.service'

export class PenaltyConfigService {
    static createPenaltyConfig = async (key, value) => {
        try {
            const result = await axiosCommon.post('/v2/penaltyconfig', {
                key,
                value,
            })
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static getPenaltyConfig = async () => {
        try {
            const result = await axiosCommon.get('/v2/penaltyconfig')
            return result.data.result
        } catch (err) {
            return err
        }
    }

    static updatePenaltyConfig = async (_id, value) => {
        try {
            const result = await axiosCommon.patch(`/v2/penaltyconfig/${_id}`, {
                value,
            })
            return result.data
        } catch (err) {
            return err
        }
    }

    static deletePenaltyConfig = async _id => {
        try {
            const result = await axiosCommon.delete(`/v2/penaltyconfig/${_id}`)
            return result.data
        } catch (err) {
            return err
        }
    }
}
