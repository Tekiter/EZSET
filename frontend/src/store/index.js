import Vue from 'vue'
import Vuex from 'vuex'

import auth from './auth'
import role from './role'
import action from './action'
import board from './board'
import config from './config'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {},
    mutations: {},
    actions: {},
    modules: { auth, role, board, action, config },
})
