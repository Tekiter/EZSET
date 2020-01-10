// import role from '../utils/role'
import axios from 'axios'

export default {
    namespaced: true,
    state: {
        roles: [],
        perms: [],
    },
    mutations: {
        SET_ROLES(state, roles) {
            state.roles = roles
        },
        SET_PERMS(state, perms) {
            state.perms = perms
        },
    },
    actions: {
        async fetchPermission(context) {
            try {
                const roleData = await axios.get('role/me')
                context.commit('SET_ROLES', roleData.data.roles)
                context.commit('SET_PERMS', roleData.data.perms)
            } catch (error) {
                throw error
            }
        },
        destroyPermission(context) {
            context.commit('SET_ROLES', [])
            context.commit('SET_PERMS', [])
        },
    },
    getters: {},
}
