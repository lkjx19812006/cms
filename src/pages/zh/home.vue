<style lang="stylus" scoped>
.content
  font-family -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen, Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  font-size 15px
  float left
  width 100%
  height 100%
  .right 
      float right
      width 80%
      .home_content
        padding 20px
  .side_left
      float left
      width 20%
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
            <div class="home_content">
               <!--  <transition name="fade" mode="out-in"> -->
                    <router-view></router-view>
               <!--  </transition> -->
            </div>
        </div>
        <div style="clear:both"></div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

import MainHeader from '../../components/header.vue';
import SideNav from '../../components/side-nav.vue';
import navsData from '../../router.config.json';
import common from '../../common/common.js'
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
    mounted() {
        let _self = this;
        if (!window.localStorage.KEY) {
            this.$router.push('/login');
        } else {
            common.KEY = window.localStorage.KEY;
            common.SID = window.localStorage.SID;
            common.getDate(
              function() {
                let url = common.urlCommon + common.apiUrl.most
                let body = {
                    biz_module: 'userService',
                    biz_method: 'getCmsUserInfo'
                }
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                _self.$store.dispatch('getUserInformation', {
                    body: body,
                    path: url
                }).then(() => {}, () => {});
            }
            );

        }
    },
    preFetch: fetchItem
}
</script>
