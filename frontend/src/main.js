import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

import axios from 'axios'

Vue.config.productionTip = false

// api 호출의 기본 경로
axios.defaults.baseURL = '/api/v1'

// 저장되어있는 로그인 세션 복원
store.dispatch('auth/restore')

new Vue({
    router,
    store,
    vuetify,
    render: h => h(App),
}).$mount('#app')
