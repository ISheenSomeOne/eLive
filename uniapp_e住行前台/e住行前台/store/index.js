import Vue from 'vue'
import Vuex from 'vuex'
import home from './modules/home.js'
import order from './modules/order.js'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
        order,
        home
    }
})