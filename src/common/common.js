import Vue from 'vue'
import CryptoJS from "crypto-js"

let common = new Vue({
    data: {
        customerId: '',
        urlCommon: '/front',
        KEY: '',
        SID: '',
        difTime: '',
        apiUrl: {
            list: '/static/data/list.json',
            market_list: '/static/data/market_list.json',
            drug_table_list: '/static/data/drug_table_list.json',
            drug_information_list: '/static/data/drug_information_list.json',
            login: '/account/cmsLogin.do',
            code_login: '/account/verifiLogin.do',
            getDate: '/system/date.do',
            most: '/handle/control.do'
        }
    },
    methods: {
        formatOnShell(status) {
            let statue = '';
            switch (status) {
                case 1:
                    statue = '申请上架';
                    break;
                case 2:
                    statue = '上架';
                    break;
                case -2:
                    statue = '上架失败';
                    break;
                case 3:
                    statue = '申请下架';
                    break;
                case 4:
                    statue = '下架';
                    break;
                case 0:
                    statue = '初始';
                    break;
                default:
                    statue = '未知状态';
                    break;
            }
            return statue;
        },
        addSID(url) {
            if (this.SID && this.SID != undefined) {
                return url + ';jsessionid=' + this.SID;
            } else {
                return url;
            }
        },
        getDate() {
            let _self = this;
            this.$http.get(this.urlCommon + this.apiUrl.getDate).then((response) => {
                if (response.data.code == '1c01') {
                    var timestamp = Date.parse(new Date());
                    window.localStorage.difTime = response.data.biz_result.time - timestamp;
                    _self.difTime = window.localStorage.difTime;
                } else {
                    _self.$message({
                        showClose: true,
                        message: response.msg,
                        type: 'error'
                    });
                }
            }, (err) => {
                _self.$message({
                    showClose: true,
                    message: '网络错误，请稍后重试',
                    type: 'error'
                });
            });
        },
        getSign(str) {
            let _self = this;
            if (!_self.KEY) {
                _self.KEY = 'test';
            }
            if (!str) {
                str = 'test';
            }
            let signStr = CryptoJS.HmacSHA1(str, _self.KEY).toString(CryptoJS.enc.Base64);
            return signStr;
        }

    }
})


common.$on('setParam', (key, value) => {
    common.pageParam[key] = value;
})

export default common;
