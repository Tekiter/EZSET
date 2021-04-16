import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import 'tui-editor/dist/tui-editor.css'
import 'tui-editor/dist/tui-editor-contents.css'
import 'codemirror/lib/codemirror.css'
import 'highlight.js/styles/github.css'

import { checkPerm } from './utils/role/role'
import { actionHelper } from './utils/action'
import { themeHelper } from './utils/theme'

import axios from 'axios'
import axiosCommon from './service/axios.common.service'

Vue.config.productionTip = false

Vue.use(require('vue-moment'))

Vue.use(themeHelper)

Vue.prototype.$perm = checkPerm
Vue.prototype.$action = actionHelper

Vue.prototype.$axiosCommon = axiosCommon

// api 호출의 기본 경로
axios.defaults.baseURL = '/api/v1'
axios.defaults.maxContentLength = 10000000
axios.defaults.maxBodyLength = 10000000
axios.defaults.headers.common['Cache-Control'] = 'no-cache'

axios.interceptors.response.use(
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

// 저장되어있는 로그인 세션 복원
store.dispatch('auth/restore')

store.dispatch('auth/restoreEditToken')

// socket.io
import io from 'socket.io-client'
// const socket = io(process.env.socketUrl)
const socket = io('http://localhost:5050')
Vue.prototype.$socket = socket

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')
