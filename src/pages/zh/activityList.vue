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

.table img {
    max-width: 100%;
    padding: 10px;
    max-height: 40px;
}

.sort {
    text-align: center;
    padding: 20px 0;
    background-color: #fff;
}

.sort .top_wrap {
    width: 620px;
    overflow: hidden;
    margin: auto;
}

.link {
    color: blue;
}

.link:hover {
    text-decoration: underline;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <div class="top_wrap">
                <el-select style="width:150px;margin-right:20px; float: left" v-model="httpParam.state" placeholder="请选择">
                    <el-option v-for="item in state" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input style="width:200px;margin-right:20px;float: left " v-model="httpParam.name" placeholder="请输入活动名称"></el-input>
                <el-button type="primary" @click="getHttp()" icon="search">搜索</el-button>
                <el-button type="primary" @click="add()" style="margin-left:50px">新增活动</el-button>
            </div>
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="activityList" border style="width:1200px;margin:auto" max-height="600" v-loading.body="loading">
                <el-table-column prop="name" label="活动名称" width="200">
                </el-table-column>
                <el-table-column label="活动图片" width="200">
                    <template scope="scope">
                        <img style="width: 200px; max-height: 200px;" :src="scope.row.activityImg">
                        <img style="width: 200px; max-height: 200px;" :src="scope.row.webImg">
                    </template>
                </el-table-column>
                <el-table-column prop="activityUrl" label="活动url" min-width="200">
                    <template scope="scope">
                        <a class="link" :href="scope.row.activityUrl" target="_blank">{{scope.row.shareUrl}}</a>
                        <br>
                        <a class="link" :href="scope.row.activityUrl" target="_blank">{{scope.row.htmlUrl}}</a>
                        <br>
                        <a class="link" :href="scope.row.activityUrl" target="_blank">{{scope.row.activityUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="活动状态" width="100">
                </el-table-column>
                <el-table-column label="创建时间" width="200">
                    <template scope="scope">
                        <span>{{scope.row.createDate |formatTime}}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="updateState(scope.$index)" type="text" size="small" v-if="scope.row.state=='未启用'">
                            启用
                        </el-button>
                        <el-button @click.native.prevent="updateState(scope.$index)" type="text" size="small" v-if="scope.row.state=='启用'">
                            关闭
                        </el-button>
                        <el-button @click.native.prevent="goUp(scope.$index)" type="text" size="small" v-if="scope.$index > 0 && scope.row.state=='启用'">
                            上移
                        </el-button>
                        <el-button @click.native.prevent="goDown(scope.$index)" type="text" size="small" v-if="scope.$index < activityList.length - 1 && scope.row.state=='启用'">
                            下移
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog @close="closeDialog" title="新增活动" v-model="addShow">
            <addActivity :activityParam="activityDetail" v-on:addActivity="recieveAdd"></addActivity>
        </el-dialog>
    </div>
</template>
<script>
import addActivity from '../../components/addActivity.vue';
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'
let param = {
    pn: 1,
    pSize: 10,
    name: '',
    state: ''
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
        biz_module: 'activityService',
        biz_method: 'activityList',
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
    return store.dispatch('ActivityList', {
        body: body,
        path: url
    });
}

export default {
    name: 'activity-view',
    data() {
        return {
            activityDetail: {
                id: '', //活动Id
                name: '', //活动名
                activityImg: '', //app h5图片地址
                webImg: '', //web图片地址
                shareUrl: '', //app活动地址
                activityUrl: '', //web活动地址
                htmlUrl: '', //h5活动地址                            
                type: -1,
                appType: '0',
                appActivUrl: '0',
                keyName: 'news'
            },
            state: [{
                label: '全部',
                value: ''
            }, {
                label: '启用',
                value: '1'
            }, {
                label: '未启动',
                value: '0'
            }],
            loading: false,
            httpParam: param,
            addShow: false
        }
    },
    components: {
        addActivity
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        activityList() {
            return this.$store.state.activity.allActivity.list
        },
        total() {
            return this.$store.state.activity.allActivity.total
        }
    },
    created() {
        if (this.$store.state.activity.allActivity.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        closeDialog() {
            this.addShow = false;
        },
        recieveAdd() {
            if (!this.activityDetail.id) this.httpParam.pn = 1;
            this.getHttp();
            this.addShow = false;
        },
        add() {
            this.activityDetail.id = ''; //活动Id
            this.activityDetail.name = ''; //活动名
            this.activityDetail.activityImg = ''; //app h5图片地址
            this.activityDetail.webImg = ''; //web图片地址
            this.activityDetail.shareUrl = ''; //app活动地址
            this.activityDetail.activityUrl = ''; //web活动地址
            this.activityDetail.htmlUrl = ''; //h5活动地址                            
            this.activityDetail.type = -1; //活动类型
            this.addShow = true;
        },
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'activityService',
                biz_method: 'activityList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('ActivityList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            let Reg = /apps:\/\//;
            if (Reg.test(this.activityList[index].shareUrl)) {
                this.activityDetail.appType = '1';
            } else {
                this.activityDetail.appType = '0';
            }
            let Reg2 = /EmergencyPurchaseActivity|YCMMDemandViewController/; //求购列表
            let Reg3 = /LowResourceActivity|YCMMSupplyViewController/; //资源列表
            let Reg4 = /PresellActivity|YCMMPreSaleViewController/; //预购列表
            if (Reg2.test(this.activityList[index].shareUrl)) {
                this.activityDetail.appActivUrl = '0'
            } else if (Reg3.test(this.activityList[index].shareUrl)) {
                this.activityDetail.appActivUrl = '1'
            } else if (Reg4.test(this.activityList[index].shareUrl)) {
                this.activityDetail.appActivUrl = '2'
            } else {
                this.activityDetail.appActivUrl = '0'
            }
            this.activityDetail.id = this.activityList[index].id;
            this.activityDetail.name = this.activityList[index].name;
            this.activityDetail.activityImg = this.activityList[index].activityImg;
            this.activityDetail.webImg = this.activityList[index].webImg;
            this.activityDetail.shareUrl = this.activityList[index].shareUrl;
            this.activityDetail.activityUrl = this.activityList[index].activityUrl;
            this.activityDetail.htmlUrl = this.activityList[index].htmlUrl;
            this.activityDetail.type = this.activityList[index].type;
            this.addShow = true;
        },
        updateState(index) {
            let id = this.activityList[index].id;
            let state = 0;
            if (this.activityList[index].state == '未启用') {
                state = 1;
            }
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'activityService',
                biz_method: 'updateActivityState',
                biz_param: {
                    id: id,
                    state: state
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('ActivityList', {
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
        goUp(index) {
            let currentId = this.activityList[index].id;
            let moveId = this.activityList[index - 1].id;
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'activityService',
                biz_method: 'moveUpOrDownActivity',
                biz_param: {
                    currentId: currentId,
                    moveId: moveId
                }
            }
            url = common.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            this.loading = true
            this.$store.dispatch('moveUpOrDownActivity', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
                _self.getHttp();
            }, () => {
                _self.loading = false
            });

        },
        goDown(index) {
            let currentId = this.activityList[index].id;
            let moveId = this.activityList[index + 1].id;
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'activityService',
                biz_method: 'moveUpOrDownActivity',
                biz_param: {
                    currentId: currentId,
                    moveId: moveId
                }
            }
            url = common.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            this.loading = true
            this.$store.dispatch('moveUpOrDownActivity', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
                _self.getHttp();
            }, () => {
                _self.loading = false
            });

        }
    },
    preFetch: fetchItem
}
</script>
