import axios from 'axios'

export default {
    namespaced: true,
    state: {
        groupName: 'EZSET',
    },
    mutations: {
        SET_CONFIGS(state, configs) {
            state.groupName = configs.groupName
        },
    },
    actions: {
        async fetchConfig(context) {
            try {
                const res = await axios.get('config')
                context.commit('SET_CONFIGS', res.data)

                document.title = context.state.groupName
            } catch (error) {
                throw error
            }
        },
    },
}
