import Vue from 'vue'
import App from './App.vue'
import VueRouter from 'vue-router'
import store from './store'
import routes from './router.config'
import { sync } from 'vuex-router-sync'
import * as filters from './filters'
import ElementUI from 'element-ui'
import locale from 'element-ui/lib/locale/lang/en'


Vue.use(ElementUI, { locale })
Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes
});


// sync the router with the vuex store.
// this registers `store.state.route`
sync(store, router)

// register global utility filters.
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})

// create the app instance.
// here we inject the router and store to all child components,
// making them available everywhere as `this.$router` and `this.$store`.
const app = new Vue({
    router,
    store,
    ...App
})

// expose the app, the router and the store.
// note we are not mounting the app here, since bootstrapping will be
// different depending on whether we are in a browser or on the server.
export { app, router, store }
