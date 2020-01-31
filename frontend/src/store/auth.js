import axios from 'axios'
import jwt from 'jsonwebtoken'

export default {
    namespaced: true,
    state: {
        accessToken: null,
        editToken: null,
        user: {},
    },
    mutations: {
        SET_ACCESS_TOKEN(state, token) {
            state.accessToken = token
        },
        SET_USER(state, user) {
            state.user = user
        },
        SET_EDIT_TOKEN(state, token) {
            state.editToken = token
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
        // edit 토큰 발급
        async issueEditToken(context, { username, password }) {
            try {
                const res = await axios.post('auth/edittoken/issue', {
                    username,
                    password,
                })

                const token = res.data.editToken

                context.commit('SET_EDIT_TOKEN', token)
                sessionStorage.setItem('editToken', token)
            } catch (error) {
                throw error.response
            }
        },
        restoreEditToken(context) {
            try {
                const editToken = sessionStorage.getItem('editToken')
                context.commit('SET_EDIT_TOKEN', editToken)
            } catch {
                return false
            }
        },
        async checkEditToken(context) {
            //토큰이 있고 유효하다면 true 토큰니 없거나 유효하지 않으면 false반환
            try {
                let hasEditToken = !!context.state.editToken
                if (hasEditToken) {
                    await axios.post('auth/edittoken/check', {
                        edittoken: context.state.editToken,
                    })
                    console.log(10)
                    return true
                } else {
                    return false
                }
            } catch (error) {
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
