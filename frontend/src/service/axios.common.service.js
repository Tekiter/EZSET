import axios from 'axios'
import store from '../store/index'
import router from '../router'

const axiosCommon = axios.create({
    baseURL: '/api',
    maxContentLength: 10000000,
    maxBodyLength: 10000000,
})

axiosCommon.defaults.headers.common['Cache-Control'] = 'no-cache'

axiosCommon.interceptors.response.use(
    function(response) {
        return response
    },
    function(error) {
        if (error.response.status === 401) {
            store.dispatch('auth/logout')
            router.push('/login')
        } else {
            return Promise.reject(error)
        }
    }
)
export default axiosCommon
