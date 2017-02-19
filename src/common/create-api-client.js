import Vue from 'vue'
import VueResource from 'vue-resource'
Vue.use(VueResource)

let httpService = new Vue({
    methods: {
        commonPost(url, body, suc, err) {
            let _self = this;
            this.$http.post(url, body).then((response) => {
                if (response.data.code != '1c01') {
                    _self.$message({
                        showClose: true,
                        message: response.msg,
                        type: 'error'
                    });
                    err(response.data);
                } else {
                    suc(response.data);
                }
            }, (response) => {
                err(response.data);
                _self.$message({
                    showClose: true,
                    message: '服务器故障，请稍候重试！',
                    type: 'error'
                });
            });
        }
    }
})

export default httpService;
