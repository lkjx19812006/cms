<style scoped>
.el-row{
    padding: 20px;
}
/* 修改图片超出边界bug */
.grid-content img {
    width: 100%;
    height: 300px;
}
</style>
<template>
    <div>
        <el-row>
            <el-col :span="12">
                <div class="grid-content ">
                    头像：<img :src="userDetail.avatar">
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">姓名：{{userDetail.fullname}}</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="grid-content ">
                    性别：{{userDetail.gender}}
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">生日：{{userDetail.birthday}}</div>
            </el-col>
        </el-row>
        <el-row>
            <el-col :span="12">
                <div class="grid-content ">
                    公司：{{userDetail.company}}
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">等级：{{userDetail.grade}}</div>
            </el-col>
        </el-row>
         <el-row>
            <el-col :span="12">
                <div class="grid-content ">
                    电话：{{userDetail.phone}}
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">积分：{{userDetail.score}}</div>
            </el-col>
        </el-row>
          <el-row>
            <el-col :span="12">
                <div class="grid-content ">
                    地址：{{userDetail.address}}
                </div>
            </el-col>
            <el-col :span="12">
                <div class="grid-content">最后登录时间：{{userDetail.lastLoginTime}}</div>
            </el-col>
        </el-row>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService'
export default {
    data() {
            return {

            }
        },
        computed: {
            langConfig() {
                return require('../i18n/' + this.$route.meta.lang + '.i18n.json')
            },
            userDetail() {
                return this.$store.state.user.userDetail
            }
        },
        mounted() {

        },
        methods: {

        }
}
</script>
