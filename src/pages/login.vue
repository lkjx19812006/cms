<template>
    <div>
        <div><span>账号：</span>
            <input v-model="userInformation.username" />
        </div>
        <div><span>密码：</span>
            <input v-model="userInformation.password" type="password" />
        </div>
        <button @click="login" v-loading.fullscreen.lock="fullscreenLoading">登录</button>
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
            fullscreenLoading: false
        }
    },
    methods: {
        login() {
            let _self = this;
            _self.fullscreenLoading = true;
            httpService.commonPost(common.urlCommon + common.apiUrl.login, {
                    biz_param: {
                        no: _self.userInformation.username,
                        password: _self.userInformation.password
                    }
                }, function(response) {
                    _self.fullscreenLoading = false;
                    window.localStorage.KEY = response.biz_result.KEY;
                    window.localStorage.SID = response.biz_result.SID;
                    common.KEY = window.localStorage.KEY;
                    common.SID = window.localStorage.SID;
                    common.getDate();
                    if (window.history.length == 1) {
                        _self.$router.push('/home');
                    } else {
                        window.history.go(-1);
                    }
                },
                function(err) {
                    _self.fullscreenLoading = false;
                })
        }
    }
}
</script>
<style lang="stylus">
</style>
