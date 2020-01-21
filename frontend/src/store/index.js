import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import role from './role'
import board from './board'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: { auth, role, board },
})
