import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import axios from 'axios'

import { checkPerm } from './utils/role/role'

Vue.config.productionTip = false

Vue.prototype.$perm = checkPerm

// api 호출의 기본 경로
axios.defaults.baseURL = '/api/v1'

// 저장되어있는 로그인 세션 복원
store.dispatch('auth/restore')

// socket.io
import io from 'socket.io-client'
const socket = io('http://localhost:5050')
Vue.prototype.$socket = socket

import moment from 'moment'
import VueMomentJS from 'vue-momentjs'

Vue.use(VueMomentJS, moment)

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')