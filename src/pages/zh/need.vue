<style scoped>
    .sort {
        text-align: center;
        background-color: #fff;
        padding: 20px;
        position: relative;
    }
    
    .sort .param-item {
        padding: 5px;
    }
    
    .sort .bg-purple {
        background-color: #20a0ff;
        color: #fff;
        font-size: 16px;
    }
    
    .sort .select-class {
        color: #20a0ff;
    }
    
    .sort .grid-content {
        padding: 5px;
    }
    
    .sort .sort-button {
        position: absolute;
        bottom: 20px;
        right: 50px;
    }
    
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
        <div class="sort">
            <div v-for="item in sortParam" class="param-item">
                <el-row :gutter="20">
                    <el-col :span="3">
                        <div class="grid-content bg-purple">{{item.title}}</div>
                    </el-col>
                    <el-col :span="3" v-for="subItem in item.value">
                        <div class="grid-content " v-bind:class="[judgeCss(item,subItem) ? 'select-class' : '' ]" @click="sort(item,subItem)">{{subItem.value}}</div>
                    </el-col>
                </el-row>
            </div>
            <div class="sort-button">
                <el-button type="primary" style="float:right" @click="sortDefault()">重置排序</el-button>
                <el-autocomplete style="margin-right:20px;float:right" v-model="searchValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
            </div>
        </div>
        <div  class="table">
            <el-table align="center" v-bind:data="needList" border style="width:1228px;margin:auto" max-height="500" @selection-change="handleSelectionChange" :v-loading.body="loading">
                <el-table-column type="selection" fixed="left" width="55">
                </el-table-column>
                <el-table-column prop="breedName" label="药材名称" width="150">
                </el-table-column>
                <el-table-column prop="offer" label="报价人数" width="120">
                </el-table-column>
                <el-table-column prop="overTime" label="剩余时间" width="120">
                </el-table-column>
                <el-table-column prop="spec" label="规格" width="120">
                </el-table-column>
                <el-table-column prop="location" label="产地" width="120">
                </el-table-column>
                <el-table-column prop="shelveTime" label="上架时间" min-width="260">
                </el-table-column>
                <el-table-column prop="onSell" label="状态" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="140">
                    <template scope="scope">
                        <el-button @click.native.prevent="makeTop(scope.$index)" type="text" size="small">
                            置顶
                        </el-button>
                        <el-button @click.native.prevent="sortDefault(scope.$index)" type="text" size="small" v-if="showReset(scope.$index)">
                            取消置顶
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
        sort: {
            "offer": "0",
            "duedate": "0",
            "shelve_time": "0"
        },
        location: ["", ""],
        keyWord: '',
        pn: 1,
        pSize: 10
    };

    function fetchItem(store) {
        return store.dispatch('getNeedList', {
            body: {
                biz_module: 'intentionService',
                biz_method: 'queryBegBuyList',
                biz_param: param
            },
            path: common.urlCommon + common.apiUrl.most
        });
    }

    export default {
        name: 'need-view',
        data() {
            return {
                loading: false,
                httpParam: param,
                searchValue: '',
                timeout: null,
                sortParam: [{
                    title: '上架时间',
                    param: 'shelve_time',
                    value: [{
                        key: "0",
                        value: "默认"
                    }, {
                        key: "2",
                        value: "由新到旧"
                    }, {
                        key: "1",
                        value: "由旧到新"
                    }]

                }, {
                    title: '报价人数',
                    param: 'offer',
                    value: [{
                        key: "0",
                        value: "默认"
                    }, {
                        key: "1",
                        value: "由少到多"
                    }, {
                        key: "2",
                        value: "由多到少"
                    }]
                }, {
                    title: '剩余时间',
                    param: 'duedate',
                    value: [{
                        key: "0",
                        value: "默认"
                    }, {
                        key: "2",
                        value: "由长到短"
                    }, {
                        key: "1",
                        value: "由短到长"
                    }]
                }]
            }
        },
        computed: {
            langConfig() {
                return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
            },
            needList() {
                return this.$store.state.resource.needList.list
            },
            total() {
                return this.$store.state.resource.needList.total
            }
        },
        created() {
            if (this.$store.state.resource.needList.list.length == 0) {
                this.getHttp();
            }
        },
        methods: {
            showReset(val) {
                return this.needList[val].sort;
            },
            handleCurrentChange(val) {
                this.httpParam.pn = val;
                this.getHttp();
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            sort(item, subItem) {
                this.httpParam.pn = 1;
                if (item.param != 'sampling') {
                    this.httpParam.sort[item.param] = subItem.key;
                } else {
                    this.httpParam[item.param] = subItem.key;
                }
                this.getHttp();

            },
            getHttp() {
                console.log('aaaaaa');
                let _self = this;
                this.loading = true
                this.$store.dispatch('getNeedList', {
                    body: {
                        biz_module: 'intentionService',
                        biz_method: 'queryBegBuyList',
                        biz_param: _self.httpParam
                    },
                    path: common.urlCommon + common.apiUrl.most
                }).then(() => {
                    console.log('fffff');
                    _self.loading = false
                    console.log(_self.loading)
                }, () => {
                    _self.loading = false
                });
            },
            makeTop(index) {
                let _self = this;
                this.loading = true;
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'cmsIntentionService',
                    biz_method: 'intentionSortTop',
                    biz_param: {
                        id: _self.needList[index].id
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
                this.$store.dispatch('makeTop', obj).then(() => {
                    _self.httpParam.pn = 1;
                    _self.getHttp();
                }, () => {
                    _self.loading = false
                });
            },
            sortDefault(param) {
                let resourceId = '';
                if (param || param == 0) {
                    resourceId = this.needList[param].id;
                }
                let _self = this;
                this.loading = true;
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'cmsIntentionService',
                    biz_method: 'intentionSortReset',
                    biz_param: {
                        id: resourceId
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
                this.$store.dispatch('makeTop', obj).then(() => {
                    _self.httpParam.pn = 1;
                    _self.getHttp();
                }, () => {
                    _self.loading = false
                });
            },
            querySearchAsync(queryString, cb) {
                if (!queryString) {
                    cb([{
                        value: '全部',
                        keyWord: ''
                    }]);
                    return;
                }
                let _self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    let url = common.urlCommon + common.apiUrl.most;
                    let body = {
                        biz_module: 'searchKeywordService',
                        biz_method: 'querySearchKeyword',
                        biz_param: {
                            keyWord: queryString,
                            pn: 1,
                            pSize: 20
                        }
                    }
                    let obj = {
                        body: body,
                        path: url
                    }
                    _self.$store.dispatch('getPpl', obj).then(() => {
                        cb(_self.$store.state.resource.ppl.list);
                    }, () => {
                        cb([]);
                    });
                }, 300);

            },
            handleSelect(item) {
                this.httpParam.keyWord = item.keyWord;
                this.httpParam.pn = 1;
                this.getHttp();
            },
            judgeCss(item, subItem) {
                if (this.httpParam.sort[item.param] == subItem.key) {
                    return true;
                } else {
                    return false;
                }
            }
        },
        preFetch: fetchItem
    }
</script>