// import role from '../utils/role'
import axios from 'axios'

export default {
    namespaced: true,
    state: {
        boards: [],
    },
    mutations: {
        SET_BOARDS(state, boards) {
            state.boards = boards
        },
    },
    actions: {
        async fetchBoards(context) {
            try {
                const res = await axios.get('simple/boards')
                context.commit('SET_BOARDS', res.data)
            } catch (error) {
                throw error
            }
        },
    },
    getters: {
        boardList(state) {
            return state.boards.map(board => {
                return {
                    title: board.title,
                    to: `/board/${board._id}`,
                }
            })
        },
    },
}
