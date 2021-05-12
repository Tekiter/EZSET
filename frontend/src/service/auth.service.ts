import axiosCommon from './axios.common.service'

interface RegisterData {
    username: string
    password: string
    realname: string
    email: string
}

export class AuthService {
    static async register(data: RegisterData) {
        return await axiosCommon.post('/v2/auth/register', data)
    }
}
