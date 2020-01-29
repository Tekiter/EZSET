/**
 * 다이얼로그 등의 글로벌 상태를 관리하는 store 모듈
 */

export default {
    namespaced: true,
    state: {
        alertDialog: {
            show: false,
            title: '',
            content: '',
            width: '',
            callback: () => {},
        },
        confirmDialog: {
            show: false,
            title: '',
            content: '',
            width: '',
            yesButton: '',
            noButton: '',
            callback: () => {},
        },
    },
    mutations: {
        SET_ALERT_DIALOG(state, options) {
            state.alertDialog = options
        },
        SET_CONFIRM_DIALOG(state, options) {
            state.confirmDialog = options
        },
    },
    actions: {
        showAlertDialog({ commit }, { title, content, width, callback }) {
            commit('SET_ALERT_DIALOG', {
                show: true,
                title,
                content,
                width,
                callback,
            })
        },
        closeAlertDialog({ state, commit }) {
            const ori = state.alertDialog
            ori.show = false
            commit('SET_ALERT_DIALOG', ori)
            ori.callback()
        },
        showConfirmDialog(
            { commit },
            { title, content, width, yesButton, noButton, callback }
        ) {
            commit('SET_CONFIRM_DIALOG', {
                show: true,
                title,
                content,
                width,
                yesButton,
                noButton,
                callback,
            })
        },
        closeConfirmDialog({ state, commit }, answer) {
            const ori = state.confirmDialog
            ori.show = false
            commit('SET_CONFIRM_DIALOG', ori)
            ori.callback(answer)
        },
    },
    getters: {},
}
