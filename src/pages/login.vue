<style scoped>
.content {
    background: url('../assets/images/bg.png') no-repeat center !important;
    background-size: 100% 100%;
    height: 100%;
}

.content .center {
    width: 80%;
    height: 300px;
    position: absolute;
    left: 50%;
    top: 50%;
    margin: -150px 0 0 -40%
}

.content .center .left_image {
    width: 40%;
    padding-left: 10%;
    float: left;
}

.content .center .left_image img {
    max-width: 90%;
    margin-right: 10%;
}

.content .center .right_form {
    width: 40%;
    padding-right: 10%;
    float: right;
    height: 100%;
    position: relative;
}

.content .center .right_form img {
    margin: -100px 0 0 10%;
    width: 450px;
}

.content .center .right_form .form {
    position: absolute;
    top: 0;
    left: 10%;
}
</style>
<template>
    <div class="content">
        <div class="center">
            <div class="left_image">
                <img src="../assets/images/logo-font.png">
            </div>
            <div class="right_form">
                <img src="../assets/images/frame.png">
                <div class="form">
                    <el-form :model="userInformation" :rules="rules" ref="ruleForm" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="userInformation.username"></el-input>
                        </el-form-item>
                        <el-form-item label="密码" prop="password">
                            <el-input v-model="userInformation.password" type="password"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('ruleForm')" v-loading.fullscreen.lock="fullscreenLoading">登录</el-button>
                            <el-button @click="resetForm('ruleForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

import common from '../common/common.js'
import httpService from '../common/httpService.js'
export default {
    name: 'login_view',
    data() {
        return {
            userInformation: {
                username: '',
                password: ''
            },
            fullscreenLoading: false,
            rules: {
                username: [{
                    required: true,
                    message: '请输入用户名',
                    trigger: 'blur'
                }],
                password: [{
                    required: true,
                    message: '请输入密码',
                    trigger: 'blur'
                }]

            }
        }
    },
    methods: {
        submitForm(formName) {
            let _self = this;
            _self.fullscreenLoading = true;
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    _self.$store.dispatch('login', {
                        body: {
                            biz_param: {
                                no: _self.userInformation.username,
                                password: _self.userInformation.password
                            }
                        },
                        path: common.urlCommon + common.apiUrl.login
                    }).then((response) => {

                        window.localStorage.KEY = response.biz_result.KEY;
                        window.localStorage.SID = response.biz_result.SID;
                        common.KEY = window.localStorage.KEY;
                        common.SID = window.localStorage.SID;
                        _self.setCookie('KEY',common.KEY);
                        _self.setCookie('SID',common.SID);
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
                                this.$store.dispatch('getUserInformation', {
                                    body: body,
                                    path: url
                                }).then(() => {}, () => {});
                            }
                        );

                        _self.$router.push('/zh/main');
                        // if (window.history.length == 1) {

                        // } else {
                        //     window.history.go(-1);
                        // }

                    }, () => {
                        _self.fullscreenLoading = false;
                    });

                } else {
                    return false;
                }
            });
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },

        setCookie(name, value) {
            var Days = 1;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
            console.log(name);
            document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
        }
    }
}
</script>
