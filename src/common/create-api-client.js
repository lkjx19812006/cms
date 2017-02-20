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
                        message: response.data.msg,
                        type: 'error'
                    });
                    err(response.data);
                } else {
                    suc(response.data);
                }
            }, (response) => {
                err(response.data);
                if (response.status == 403) {
                    _self.$confirm('请先登陆后再进行操作?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        window.location.href = "/login";
                    }).catch((res) => {
                        _self.$message({
                            type: 'info',
                            message: '操作失败'
                        });
                    });
                } else {
                    _self.$message({
                        showClose: true,
                        message: '服务器故障，请稍候重试！',
                        type: 'error'
                    });
                }
            });
        }
    }
})

export default httpService;
