<style lang="stylus" scoped>
.white_bk 
    font-family -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen,Ubuntu,Cantarell,"Fira Sans","Droid Sans","Helvetica Neue",sans-serif;
    font-size 15px 
    background-color #fff 
    margin 0 
    color #34495e 
    width 100% 
    height 100px 
    border-bottom 1px solid #ddd 
    line-height 100px 
    .logo 
        float left 
        font-size 18px 
        margin-left 20px 
    .right 
        float right 
        margin-right 20px
</style>
<template>
    <div class="white_bk">
        <div class="logo">
            <i class="el-icon-time"></i> 上班时间 09:00-18:00
        </div>
        <div class="right">
            {{userInformation.name}}，下午好            
            <el-button type="text" @click="signOut" style="margin-left: 5px;"><i class="el-icon-picture"></i></el-button> 
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../common/common.js'

let _self = this;

export default {
    name: 'side-nav-view',
    data() {
        return {

        }
    },
    computed: {
        userInformation() {
            return this.$store.state.user.user
        }
    },
    methods: {          
        // 新增退出功能        
        signOut() {
            let _self = this;
            this.$confirm('是否确定退出登录？', '信息', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'info'
            }).then(() => {
              // 执行退出
              // 清除cookie
              document.cookie= name + "="+''+";expires="+'';
              window.localStorage.KEY = '';
              window.localStorage.SID = '';
              _self.$router.push('/login')
            }).catch(() => {
              // 取消不管 
               this.$message({
                type: 'info',
                message: '已取消'
              });      
                  
            });
        }
    }
}
</script>
