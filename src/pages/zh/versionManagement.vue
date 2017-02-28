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

.sort {
    text-align: right;
    padding: 20px 0;
    padding-right: 100px;
    background-color: #fff;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <el-button type="primary" @click="add()" style="margin-left:50px">新增版本</el-button>
        </div>
        <div class="table">
            <el-table v-bind:data="versionList" border style="
            width:832px;margin:auto" max-height="550" v-loading.body="loading">
                <el-table-column prop="content" label="更新介绍" width="200">
                </el-table-column>
                <el-table-column prop="compel" label="强制更新最低版本号" width="120">
                </el-table-column>
                <el-table-column prop="version" label="普通更新最新版本号" width="120">
                </el-table-column>
                <el-table-column prop="createTime" label="创建时间" width="150">
                </el-table-column>
                <el-table-column label="是否开启" width="120">
                    <template scope="scope">
                        <span>{{scope.row.isOpen |formatOpenType}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="open(scope.$index)" type="text" size="small" v-if="scope.row.isOpen==0">
                            开启
                        </el-button>
                        <el-button @click.native.prevent="open(scope.$index)" type="text" size="small" v-if="scope.row.isOpen==1">
                            关闭
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="添加版本" v-model="dialogShow.dialogVersionDetail">
            <addVersion :activityParam="versionDetail" v-on:addVersion="recieveAdd"></addVersion>
        </el-dialog>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'
import addVersion from '../../components/version/addVersion.vue'

let param = {
    pn: 1,
    pSize: 10,
    type:0
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
        biz_method: 'queryVersionList',
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
    return store.dispatch('getVersionList', {
        body: body,
        path: url
    });
}

export default {
    name: 'resource-view',
    data() {
        return {
            loading: false,
            httpParam: param,
            dialogShow: {
                dialogVersionDetail: false
            },
            versionDetail: {
                id: '',
                type: '0',
                version: '',
                compel: '',
                content: '',
                detail: ''
            }
        }
    },
    components: {
        addVersion
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        versionList() {
            return this.$store.state.version.versionList.list
        },
        total() {
            return this.$store.state.version.versionList.total
        }
    },
    mounted() {
        if (this.$store.state.version.versionList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        open(index) {
            let id = this.versionList[index].id;
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'versionService',
                biz_method: 'openVersion',
                biz_param: {
                    id: id
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('updateVersionState', {
                body: body,
                path: url
            }).then(() => {
                _self.$message({
                    type: 'info',
                    message: '修改成功'
                });
                _self.getHttp();
            }, () => {
                _self.loading = false;
            });
        },
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        recieveAdd() {
            if (!this.versionDetail.id) this.httpParam.pn = 1;
            this.getHttp();
            this.dialogShow.dialogVersionDetail = false;
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'versionService',
                biz_method: 'queryVersionList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getVersionList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            this.versionDetail.id = this.versionList[index].id;
            this.versionDetail.type = this.versionList[index].type;
            this.versionDetail.version = this.versionList[index].version;
            this.versionDetail.compel = this.versionList[index].compel;
            this.versionDetail.content = this.versionList[index].content;
            this.versionDetail.detail = this.versionList[index].detail;
            this.dialogShow.dialogVersionDetail = true;
        },
        add() {
            this.versionDetail.id = '';
            this.versionDetail.type = 0;
            this.versionDetail.version = '';
            this.versionDetail.compel = '';
            this.versionDetail.content = '';
            this.versionDetail.detail = '';
            this.dialogShow.dialogVersionDetail = true;
        }
    },
    preFetch: fetchItem
}
</script>
