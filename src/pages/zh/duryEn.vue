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
                <el-select @change="selectChange" style="width:150px;margin-right:20px; float: left" v-model="getParams.state" placeholder="请选择">
                    <el-option v-for="item in state" :label="item.label" :value="item.value">
                    </el-option>
                </el-select>
                <el-input style="width:200px;margin-right:20px;float: left " v-model="getParams.name" placeholder="请输入活动名称"></el-input>
                <el-button type="primary" @click="getHttp()" icon="search">搜索</el-button>
                <el-button type="primary" @click="add()" style="margin-left:50px">新增活动</el-button>
            </div>
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="duryEnList" border style="width:1200px;margin:auto" max-height="600" v-loading.body="loading">
                <el-table-column prop="name" label="活动名称" width="200">
                </el-table-column>
                <el-table-column label="活动图片" width="200">
                    <template scope="scope">
                        <img style="width: 200px; max-height: 200px;" :src="scope.row.appImg">
                        <img style="width: 200px; max-height: 200px;" :src="scope.row.htmlImg">
                    </template>
                </el-table-column>
                <el-table-column prop="activityUrl" label="活动url" min-width="200">
                    <template scope="scope">
                        <a class="link" :href="scope.row.activityUrl" target="_blank">{{scope.row.appUrl}}</a>
                        <br>
                        <a class="link" :href="scope.row.activityUrl" target="_blank">{{scope.row.htmlUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column prop="state" label="活动状态" width="100">
                </el-table-column>
                <el-table-column label="创建时间" width="200">
                    <template scope="scope">
                        <span>{{scope.row.ctime |formatTime2}}</span>
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
                        <el-button @click.native.prevent="goUpOrDown({type: 'up', index: scope.$index})" type="text" size="small" v-if="scope.$index > 0 && scope.row.state=='启用'">
                            上移
                        </el-button>
                        <el-button @click.native.prevent="goUpOrDown({type: 'down', index: scope.$index})" type="text" size="small" v-if="scope.$index < duryEnList.length - 1 && scope.row.state=='启用'">
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
        <el-dialog @close="closeDialog" title="药材百科Banner" v-model="addShow">
            <duryEC v-if="addShow" :httpParam="httpParam" v-on:addActivity="recieveAdd"></duryEC>
        </el-dialog>
    </div>
</template>
<script>
import duryEC from '../../components/duryEC.vue';
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
        biz_module: 'herbBannerService',
        biz_method: 'herbBannerList',
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
    return store.dispatch('duryEnList', {
        body: body,
        path: url
    });
}
export default {
    name: 'activity-view',
    data() {
        return {
            httpParam: {
                id: '',
                name: '',
                appImg: '',
                appUrl: '',
                htmlImg: '',
                htmlUrl: '',
                htmlUrl: '',
                htmlImg: '',
                type: -1,
                keyName: 'news',
                checkList: [],
                sendType: -1,
                breedName: ''
            },
            getParams: param,
            state: [{
                label: '全部',
                value: ''
            }, {
                label: '启用',
                value: '1'
            }, {
                label: '未启用',
                value: '0'
            }],
            loading: false,
            addShow: false
        }
    },
    components: {
        duryEC
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        duryEnList() {
            return this.$store.state.activity.duryEn.list
        },
        total() {
            return this.$store.state.activity.duryEn.total
        }
    },
    mounted() {
        if (this.$store.state.activity.duryEn.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        selectChange() {
            this.getParams.pn = 1;
            this.getHttp();
        },
        closeDialog() {
            this.addShow = false;
        },
        recieveAdd() {
            if (!this.httpParam.id) this.getParams.pn = 1;
            this.getHttp();
            this.addShow = false;
        },
        add() {
            this.httpParam.id = '';
            this.httpParam.name = '';
            this.httpParam.appImg = '';
            this.httpParam.appUrl = '';
            this.httpParam.htmlImg = '';
            this.httpParam.htmlUrl = '';
            this.httpParam.type = -1;
            this.httpParam.breedName = '';
            this.getCheckInfo(this.httpParam.type);
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
                biz_module: 'herbBannerService',
                biz_method: 'herbBannerList',
                biz_param: _self.getParams
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('duryEnList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            let srcStr = this.duryEnList[index].appUrl;
            let arr = srcStr.split('breedName=');
            if (arr.length > 1) {
                this.httpParam.breedName = arr[arr.length - 1];
            } else {
                this.httpParam.breedName = '';
            }
            console.log(this.httpParam.breedName);
            this.httpParam.id = this.duryEnList[index].id;
            this.httpParam.name = this.duryEnList[index].name;
            this.httpParam.appImg = this.duryEnList[index].appImg;
            this.httpParam.appUrl = this.duryEnList[index].appUrl;
            this.httpParam.htmlUrl = this.duryEnList[index].htmlUrl;
            this.httpParam.htmlImg = this.duryEnList[index].htmlImg;
            this.httpParam.type = this.duryEnList[index].type;
            this.getCheckInfo(this.httpParam.type);
            this.addShow = true;
        },
        updateState(index) {
            let id = this.duryEnList[index].id;
            let state = 0;
            if (this.duryEnList[index].state == '未启用') {
                state = 1;
            }
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'herbBannerService',
                biz_method: 'updateHerbBannerState',
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
            this.$store.dispatch('duryEnList', {
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
        goUpOrDown(param) {
            let currentId;
            let moveId;
            if (param.type === 'up') {
                currentId = this.duryEnList[param.index].id;
                moveId = this.duryEnList[param.index - 1].id;
            } else if (param.type === 'down') {
                currentId = this.duryEnList[param.index].id;
                moveId = this.duryEnList[param.index + 1].id;
            };
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'herbBannerService',
                biz_method: 'moveUpOrDownHerBanner',
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
        getCheckInfo(type) {
            switch (type) {
                case 1:
                    this.httpParam.checkList = [1];
                    this.httpParam.sendType = 1;
                    break;
                case 2:
                    this.httpParam.checkList = [2];
                    this.httpParam.sendType = 2;
                    break;
                case 3:
                    this.httpParam.checkList = [1, 2];
                    this.httpParam.sendType = 3;
                    break;
                default:
                    this.httpParam.checkList = [];
                    this.httpParam.sendType = -1;
                    break;
            }
        }
    },
    preFetch: fetchItem
}
</script>
