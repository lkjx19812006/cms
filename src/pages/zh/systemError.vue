<style scoped>
.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
}

.pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}
</style>
<template>
    <div class="content">
        <div class="table">
            <el-table v-bind:data="errorList" border style="
            width:922px;margin:auto" max-height="700" v-loading.body="loading">
                <el-table-column  label="错误内容" width="600">
                    <template scope="scope">
                        <div>{{scope.row.content.errorPlace}}</div>
                        <div>errorReason:{{scope.row.content.errorReason}}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="model" label="客户端类型" width="120">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="200">
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'

let param = {
    pn: 1,
    pSize: 10
};

function fetchItem(store, val) {
    let cookie = val.cookie;
    var cookiesObj = {};
    cookie && cookie.split(';').forEach(function(Cookie) {
        function Trim(str) {
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
        Cookie = Trim(Cookie);
        var parts = [];
        parts[0] = Cookie.substr(0, 3);
        parts[1] = Cookie.substr(4, Cookie.length);
        if (parts[1]) cookiesObj[parts[0].trim()] = (parts[1] || '').trim();
    });
    let url = common.urlCommon + common.apiUrl.most;
    let body = {
        biz_module: 'versionService',
        biz_method: 'querySysDebugList',
        biz_param: param
    };
    if (cookiesObj.SID) {
        common.SID = cookiesObj.SID;
        common.KEY = cookiesObj.KEY;
        common.difTime = val.time;
        url = common.addSID(url);
        body.version = 1;
        let localTime = new Date().getTime();
        body.time = localTime + common.difTime;
        body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
    }
    return store.dispatch('getErrorList', {
        body: body,
        path: url
    });
}

export default {
    name: 'error-view',
    data() {
        return {
            loading: false,
            httpParam: param
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        errorList() {
            return this.$store.state.version.errorList.list
        },
        total() {
            return this.$store.state.version.errorList.total
        }
    },
    mounted() {
        if (this.$store.state.version.errorList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'versionService',
                biz_method: 'querySysDebugList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getErrorList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        }
    },
    preFetch: fetchItem
}
</script>
