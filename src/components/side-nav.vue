<style lang="stylus" scoped>
.nav_side 
    background-color #eef1f6
    color #fff 
    .logo 
        background-color #fff 
        height 100px
        border-right 1px solid #eee
        background #fff url('../assets/images/logo.png') no-repeat no-repeat  center
        background-size 80% 80%
</style>
<template>
    <div class="nav_side" :style="{ minHeight: wrapperHeight + 'px' }">
        <div class="logo">
            
        </div>
        <el-menu default-active="0" class="el-menu-vertical-demo">
            <template v-for="(item,index) in data">
                <el-submenu v-bind:index="menuIndex(index)" v-if="item.children" >
                    <template slot="title">
                    <i class="el-icon-message"></i>{{item.name}}
                    </template>
                     <router-link   :to="base + subItem.path"  v-for="(subItem,subIndex) in item.children">
                     <el-menu-item v-bind:index="subMenuIndex(index,subIndex)"  >{{subItem.title}}</el-menu-item>
                      </router-link>
                </el-submenu>
                <router-link v-else  :to="base + item.path" > <el-menu-item v-bind:index="menuIndex(index)" ><i class="el-icon-menu" ></i>{{item.name}}</el-menu-item> </router-link>
            </template>
        </el-menu>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

let _self = this;
export default {
    name: 'side-nav-view',
    props: {
        data: Array,
        base: {
            type: String,
            default: ''
        }
    },
    data() {
        return {
            wrapperHeight: ''
        }
    },
    computed: {

    },
    mounted() {
        this.wrapperHeight = document.documentElement.clientHeight;
    },
    methods: {
        menuIndex: function(index) {
            return index.toString();
        },
        subMenuIndex: function(index,subIndex) {
            return index+'-'+subIndex;
        },
        go(path) {
            console.log(path);
           this.$router.push(this.base+path);
        }
       
    }
}
</script>
