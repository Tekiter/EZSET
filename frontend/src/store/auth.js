import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
    namespaced: true,
    state: {
        accessToken: null,
        user: {},
    },
    mutations: {
        SET_ACCESS_TOKEN(state, token) {
            state.accessToken = token
        },
        SET_USER(state, user) {
            state.user = user
        },
    },
    actions: {
        async login(context, { username, password }) {
            try {
                const res = await axios.post('auth/login', {
                    username,
                    password,
                })

                const token = res.data.accessToken

                const user = jwt.decode(token)
                // const user = {
                //     username: decoded.username,
                // }

                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${token}`

                context.commit('SET_ACCESS_TOKEN', token)
                localStorage.setItem('accessToken', token)
                context.commit('SET_USER', user)
                localStorage.setItem('user', JSON.stringify(user))
            } catch (error) {
                throw error.response
            }
        },
        async logout(context) {
            delete axios.defaults.headers.common['Authorization']
            context.commit('SET_ACCESS_TOKEN', null)
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')
        },
        restore(context) {
            try {
                const accessToken = localStorage.getItem('accessToken')
                let user = localStorage.getItem('user')

                if (!accessToken || !user) {
                    return false
                }

                user = JSON.parse(user)

                axios.defaults.headers.common[
                    'Authorization'
                ] = `Bearer ${accessToken}`

                context.commit('SET_ACCESS_TOKEN', accessToken)
                context.commit('SET_USER', user)
            } catch {
                context.dispatch('logout')
                return false
            }
        },
    },
    getters: {
        isLoggedIn(state) {
            return !!state.accessToken
        },
    },
}
