import Vue from 'vue'
import Vuex from 'vuex'
import news from './modules/news'
import user from './modules/user'
import products from './modules/products'
import resource from './modules/resource'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    products,
    resource,
    news
  },
  strict: debug
})