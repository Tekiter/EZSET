/**
 * 다이얼로그를 async 함수로 편하게 호출할 수 있게 해주는 helper 모듈
 */

import store from '../../store'

export const actionHelper = {
    showAlertDialog(title, content, options) {
        if (!options) {
            options = {}
        }
        return new Promise((resolve, reject) => {
            store.dispatch('action/showAlertDialog', {
                title,
                content,
                width: options.width || '400',
                callback: resolve,
            })
        })
    },
    showConfirmDialog(title, content, options) {
        if (!options) {
            options = {}
        }
        return new Promise((resolve, reject) => {
            store.dispatch('action/showConfirmDialog', {
                title,
                content,
                width: options.width || 400,
                yesButton: options.yesButton || '예',
                noButton: options.noButton || '아니오',
                callback: resolve,
            })
        })
    },
}
