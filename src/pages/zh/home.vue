<style lang="stylus" scoped>
.content
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  float left
  width 100%
  .right 
      float right
      width 70%
  .side_left
      float left
      width 30%
      background #fff
      height 100%
  
a
  color #34495e
  text-decoration none

</style>
<template>
    <div class="content">
        <div class="side_left">
            <side-nav :data="navsData[lang]" :base="`/${ lang }`"> </side-nav>
        </div>
        <div class="right">
            <main-header></main-header>
            <transition name="fade" mode="out-in">
                <router-view></router-view>
            </transition>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

import MainHeader from '../../components/header.vue';
import SideNav from '../../components/side-nav.vue';
import navsData from '../../router.config.json';

let _self = this;

function fetchItem(store) {
    return store.dispatch('TEST',
        store.products
    );
}

export default {
    name: 'home-view',
    data() {
        return {
             lang: this.$route.meta.lang,
            navsData
        }
    },
    components: {
        MainHeader,
        SideNav
    },
    computed: {
        products() {
            return this.$store.state.products.all
        },
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        }
    },
    methods: {
        checkout(param) {
            this.$router.push('/en')

        }
    },
    preFetch: fetchItem
}
</script>
