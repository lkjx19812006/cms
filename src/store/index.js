import Vue from 'vue'
import Vuex from 'vuex'
import news from './modules/news'
import user from './modules/user'
import activity from './modules/activity'
import resource from './modules/resource'
import version from './modules/version'
import media from './modules/media'
import marketInfo from './modules/marketInfo'
import duryEn from './modules/duryEn'

Vue.use(Vuex)

const debug = process.env.NODE_ENV !== 'production'

export default new Vuex.Store({
  modules: {
    user,
    activity,
    resource,
    news,
    version,
    media,
    marketInfo,
    duryEn
  }
})