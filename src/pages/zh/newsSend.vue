<style scoped>
.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
}

.sort {
    float: left;
    width: 100%;
    padding: 20px 0;
    text-align: center;
}

.pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}
/* 新增样式 让推送列表可以滚动 */
.el-table__body tbody {
    height: 400px !important;
    overflow: scroll;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <el-select style="width:150px;margin-right:20px" v-model="httpParam.type" placeholder="请选择">
                <el-option v-for="item in options" :label="item.label" :value="item.value">
                </el-option>
            </el-select>
            <el-input style="width:200px;margin-right:20px" v-model="httpParam.title" placeholder="请输入推送标题"></el-input>
            <el-button type="primary" @click="search()" icon="search">搜索</el-button>
        </div>
        <div class="table">
            <el-table v-bind:data="newsList" border style="width:780px;margin:auto" max-height="550" v-loading.body="loading">
                <!-- 注意下 已经合并推送提示与推送标题 数据一样 -->
              <!--   <el-table-column prop="alert" label="推送提示" width="150">
                </el-table-column> -->
                <el-table-column prop="title" label="推送标题" width="120">
                </el-table-column>
                <el-table-column prop="message" label="推送内容" width="120">
                </el-table-column>
                <el-table-column prop="type" label="推送类型" width="120">
                </el-table-column>
                <!-- 新增一个字段 根据推送类型 显示不同的内容 -->                
                <el-table-column label="推送目标" width="200">
                   <template scope="scope">                     
                      <a style="color:blue; text-decoration:underline" v-if="scope.row.type==='活动'" :href="scope.row.extras.url" target="_blank">{{scope.row.extras.url}}</a>
                      <span v-if="scope.row.type==='资源'">{{scope.row.extras.name}}</span>
                      <!--  -->
                      <span v-if="scope.row.type==='订单'">{{scope.row.extras.no}}</span>
                    </template>
                </el-table-column>   

                <el-table-column prop="createTime" label="推送时间" width="200">
                </el-table-column>
                <!-- 隐藏该字段操作方式 -->
                <el-table-column v-if="false" fixed="right" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="sendAgain(scope.$index)" type="text" size="small">
                            再次发送
                        </el-button>
                    </template>
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
    type: '-1',
    title: '',
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
        biz_module: 'pushService',
        biz_method: 'queryPushList',
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
    return store.dispatch('getNews', {
        body: body,
        path: url
    });
}

export default {
    name: 'newsend-view',
    data() {
        return {
            options: [{
                label: '全部',
                value: '-1'
            }, {
                label: '资源',
                value: '1'
            }, {
                label: '活动',
                value: '2'
            }, {
                label: '订单',
                value: '3'
            }],
            loading: false,
            httpParam: param
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        newsList() {
            return this.$store.state.news.newsList.list
        },
        total() {
            return this.$store.state.news.newsList.total
        }
    },
    mounted() {
        if (this.$store.state.news.newsList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        search() {
            this.httpParam.pn = 1;
            this.getHttp();
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
                biz_module: 'pushService',
                biz_method: 'queryPushList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getNews', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        sendAgain(index) {
            let _self = this;
            _self.loading = true;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'pushService',
                biz_method: 'pushAllAlertMessageExtras',
                biz_param: {
                    alias: this.newsList[index].alias,
                    alert: this.newsList[index].alert,
                    title: this.newsList[index].title,
                    message: this.newsList[index].message,
                    extras: this.newsList[index].extras,
                    type: this.newsList[index].extras.type
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            let obj = {
                body: body,
                path: url
            }
            _self.$store.dispatch('pushNews', obj).then(() => {
                _self.loading = false
                _self.$message({
                    type: 'info',
                    message: '发送成功'
                });
            }, () => {
                _self.loading = false
            });
        }
    },
    preFetch: fetchItem
}
</script>
