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
                <el-button type="primary" @click="sortDefault()" style="float:right">重置排序</el-button>
                <el-autocomplete style="margin-right:20px;float:right" v-model="searchValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
            </div>
        </div>
        <div class="table">
            <el-table v-bind:data="resourceList" border style="width:1106px;margin:auto" max-height="550" @selection-change="handleSelectionChange" :v-loading.body="loading">
                <el-table-column type="selection" fixed="left" width="55">
                </el-table-column>
                <el-table-column prop="breedName" label="药材名称" width="150">
                </el-table-column>
                <el-table-column prop="price" label="价格" width="120">
                </el-table-column>
                <el-table-column prop="spec" label="规格" width="120">
                </el-table-column>
                <el-table-column prop="location" label="产地" width="120">
                </el-table-column>
                <el-table-column prop="shelveTime" label="上架时间" width="300">
                </el-table-column>
                <el-table-column prop="onSell" label="状态" width="120">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="makeTop(scope.$index)" type="text" size="small">
                            置顶
                        </el-button>
                        <el-button @click.native.prevent="sortDefault(scope.$index)" type="text" size="small" v-if="showReset(scope.$index)">
                            重置
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
        "shelve_time": "0",
        "price": "0"
    },
    location: ["", ""],
    sampling: -1,
    pn: 1,
    pSize: 10
};
function fetchItem(store) {
    return store.dispatch('getResourceList', {
        body: {
            biz_module: 'intentionService',
            biz_method: 'querySupplyList',
            biz_param: param
        },
        path: common.urlCommon + common.apiUrl.most
    });
}
export default {
    name: 'resource-view',
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
                    key: "1",
                    value: "由新到旧"
                }, {
                    key: "2",
                    value: "由旧到新"
                }]

            }, {
                title: '价格',
                param: 'price',
                value: [{
                    key: "0",
                    value: "默认"
                }, {
                    key: "1",
                    value: "由低到高"
                }, {
                    key: "2",
                    value: "由高到低"
                }]
            }, {
                title: '样品',
                param: 'sampling',
                value: [{
                    key: "-1",
                    value: "默认"
                }, {
                    key: "0",
                    value: "无"
                }, {
                    key: "2",
                    value: "有"
                }]
            }]
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        resourceList() {
            return this.$store.state.resource.resourceList.list
        },
        total() {
            return this.$store.state.resource.resourceList.total
        }
    },
    mounted() {
        if (this.$store.state.resource.resourceList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        showReset(val) {
            return this.resourceList[val].sort;
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
            let _self = this;
            this.loading = true
            this.$store.dispatch('getResourceList', {
                body: {
                    biz_module: 'intentionService',
                    biz_method: 'querySupplyList',
                    biz_param: _self.httpParam
                },
                path: common.urlCommon + common.apiUrl.most
            }).then(() => {
                _self.loading = false
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
                    id: _self.resourceList[index].id
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
            if (param) {
                resourceId = this.resourceList[param].id;
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
            if (item.param != 'sampling') {
                if (this.httpParam.sort[item.param] == subItem.key) {
                    return true;
                } else {
                    return false;
                }
            } else {
                if (this.httpParam[item.param] == subItem.key) {
                    return true;
                } else {
                    return false;
                }
            }

        }
    },
    preFetch: fetchItem
}
</script>
