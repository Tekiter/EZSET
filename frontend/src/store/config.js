import axios from 'axios'
import { applyTheme } from '../utils/theme'

export default {
    namespaced: true,
    state: {
        groupName: 'EZSET',
    },
    mutations: {
        SET_CONFIGS(state, configs) {
            state.groupName = configs.groupName
            state.usePreUser = configs.usePreUser
            state.theme = configs.theme
        },
        SET_SINGLE_CONFIG(state, key, value) {
            state[key] = value
        },
    },
    actions: {
        async fetchConfig(context) {
            try {
                const res = await axios.get('config')
                context.commit('SET_CONFIGS', res.data)

                document.title = context.state.groupName
                applyTheme(context.state.theme.themes)
            } catch (error) {
                throw error
            }
        },
    },
}
