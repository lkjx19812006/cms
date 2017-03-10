<style>
.marketContent .sort {
    text-align: center;
    background-color: #fff;
    padding: 20px;
    padding-bottom: 10px;
}

.marketContent  .sort .sort-button {
    width: 940px;
    height: 40px;
    margin: auto;
    position: relative;
}

.marketContent .sort .changMoney {
    position: absolute;
    bottom: -45px;
    right: 305px;
    z-index: 2000;
}

.marketContent  .sort .makeTop {
    position: absolute;
    bottom: 0px;
    left: 0px;
    z-index: 2000;
}

.marketContent  .table {
    text-align: center;
    background-color: #fff;
}

.marketContent .el-table__expanded-cell {
    padding: 0 !important;
}

.marketContent  .el-table__expanded-cell .el-table {
    border: none;
}

.marketContent  .pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}
</style>
<template>
    <div class="marketContent">
        <!-- 分类排序 -->
        <div class="sort">
            <div class="sort-button">
                <el-button type="primary" @click="serachContent" style="float:right">搜索药材</el-button>
                <el-autocomplete style="margin-right:20px;float:right" v-model="searchValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
                <div class="changMoney">
                    <el-button @click="changeMoney" size="small" type="primary">
                        {{ isMoney? '涨跌(元)': '涨幅(%)'}}
                    </el-button>
                </div>
                <div class="makeTop">
                    <el-button @click="allTop" type="primary">全部置顶</el-button>
                </div>
            </div>
        </div>
        <!-- 表格 -->
        <div class="table">
            <!-- 表格 -->
            <el-table align="center"  @selection-change="handleSelectionChange" :data="marketInfoList" max-height="600" style="width:940px;margin: auto" :v-loading.body="loading">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-table :show-header="false" :data="props.row.list" :v-loading.body="loading">
                            <el-table-column width="48px">
                            </el-table-column>
                            <el-table-column width="48px">
                            </el-table-column>
                            <el-table-column prop="name" min-width="100">
                            </el-table-column>
                            <el-table-column prop="spec" width="120">
                            </el-table-column>
                            <el-table-column prop="area" width="120">
                            </el-table-column>
                            <el-table-column prop="yesterdayPrice" width="120">
                            </el-table-column>
                            <el-table-column width="120">
                                <template scope="scope">
                                    <div v-if="scope.row.dayMoney">
                                        <span v-if="isMoney">
                            				{{scope.row.dayMoney}}
                            				<span style="color: red; fontSize: 18px">↑</span>
                                        </span>
                                        <span v-if="!isMoney" style="position: relative;">
                            				{{scope.row.dayDowns | filterFloatNum}}% 
                            				<span style="color: red; fontSize: 18px">↑</span>
                                        </span>
                                    </div>
                                    <div v-if="!scope.row.dayMoney">
                                        <span>--</span>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column width="100">
                                <template scope="scope">
                                    <el-button @click.native.prevent="changePrice(scope.row.id)" type="text">
                                        修改价格
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column width="140">                             
                            </el-table-column>
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column type="selection" width="48">
                </el-table-column>
                <el-table-column label="品名" prop="name" min-width="100">
                </el-table-column>
                <el-table-column label="规格" prop="spec" width="120">
                </el-table-column>
                <el-table-column label="产地" prop="area" width="120">
                </el-table-column>
                <el-table-column label="价格" prop="yesterdayPrice" width="120">
                </el-table-column>
                <el-table-column width="120">
                    <template scope="props">
                        <div v-if="props.row.dayMoney">
                            <span v-if="isMoney">
                            		{{props.row.dayMoney}}
                            		<span style="color: red; fontSize: 18px">↑</span>
                            </span>
                            <span v-if="!isMoney" style="position: relative;">
                            		{{props.row.dayDowns | filterFloatNum}}% 
                            		<span style="color: red; fontSize: 18px">↑</span>
                            </span>
                        </div>
                        <div v-if="!props.row.dayMoney">
                            <span>--</span>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template scope="props">
                        <el-button @click.native.prevent="changePrice(props.row.id)" type="text">
                            修改价格
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column label="置顶" width="140">
                    <template scope="props">
                        <el-button @click.native.prevent="marketTop(props.row.breedId)" type="text">置顶</el-button>
                        <el-button @click.native.prevent="marketDown(props.row.breedId)" type="text" v-if="showReset(props.$index)">取消置顶</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页 -->
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
    name: '',
    pn: 1,
    pSize: 10
};

function fetchItem(store) {
    return store.dispatch('getMarketInfoList', {
        body: {
            biz_module: 'breedService',
            biz_method: 'queryBreedPrice',
            biz_param: param
        },
        path: common.urlCommon + common.apiUrl.most
    });
}
export default {
    name: 'marketInfo-view',
    data() {
        return {
            loading: false,
            httpParam: param,
            searchValue: '',
            timeout: null,
            isMoney: false,
            isExpend: false,
            multipleSelection: []
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        // 列表数据
        marketInfoList() {
            return this.$store.state.marketInfo.marketInfoList.list
        },
        //获取总条数
        total() {
            return this.$store.state.marketInfo.marketInfoList.total
        },
        dayMoney(params) {
            return parseInt(params);
        }
    },
    created() {
        if (this.$store.state.marketInfo.marketInfoList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        //修改价格
        changePrice(params) {
            let _self = this;
            _self.loading = true;
            this.$prompt('请修改价格', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^\d*$/,
                inputErrorMessage: '请输入数值'
            }).then(({
                value
            }) => {
                let body = {
                    biz_module: 'breedService',
                    biz_method: 'updateBreedPrice',
                    biz_param: {
                        id: params,
                        yesterdayPrice: value
                    }
                }
                let url = common.urlCommon + common.apiUrl.most;

                let obj = {
                    body: body,
                    path: url
                }
                _self.$store.dispatch('getChangePrice', obj).then(() => {
                    _self.loading = false;
                    _self.$store.dispatch('changeLocalPrice', body.biz_param).then(function() {
                        _self.$message({
                            type: 'success',
                            message: '价格修改成: ' + value
                        });
                    })

                }, () => {
                    _self.loading = true;
                });
            }).catch(() => {
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        // 切换涨幅样式
        changeMoney() {
            this.isMoney = !this.isMoney;
        },
        // 全部置顶
        allTop() {
            if (!this.multipleSelection.length) {
                this.$message({
                    type: 'info',
                    message: '请选择要置顶的行'
                });
                return;
            }
            let _self = this;
            this.loading = true;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'breedService',
                biz_method: 'priceSortTop',
                biz_param: {
                    breedIdList: this.multipleSelection
                }
            }
            let obj = {
                body: body,
                path: url
            }
            this.$store.dispatch('marketTop', obj).then(() => {
                _self.httpParam.pn = 1;
                _self.getHttp();
            }, () => {
                _self.loading = false
            });

        },
        // 单列置顶 或取消置顶
        marketTop(params) {
            if (params && params !== 0) {
                let _self = this;
                this.loading = true;
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'breedService',
                    biz_method: 'priceSortTop',
                    biz_param: {
                        breedIdList: [params]
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
                this.$store.dispatch('marketTop', obj).then(() => {
                    _self.httpParam.pn = 1;
                    _self.getHttp();
                }, () => {
                    _self.loading = false
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '参数错误,请重试'
                });
            }
        },
        marketDown(params) {
            if (params && params !== 0) {
                let _self = this;
                this.loading = true;
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'breedService',
                    biz_method: 'priceSortReset',
                    biz_param: {
                        breedIdList: [params]
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
                this.$store.dispatch('marketTop', obj).then(() => {
                    _self.httpParam.pn = 1;
                    _self.getHttp();
                }, () => {
                    _self.loading = false
                });
            } else {
                this.$message({
                    type: 'error',
                    message: '参数错误,请重试'
                });
            }
        },
        showReset(val) {
            let param = this.$store.state.marketInfo.marketInfoList.list[val].sort;
            console.log(param);
            if (param && param !== 0) {
                return true;
            } else {
                return false;
            }
        },
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        handleSelectionChange(val) {
            let arr = [];
            val.forEach(function(val, index) {
                arr.push(val.breedId);
            })
            this.multipleSelection = arr;
            console.log(this.multipleSelection);
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
        // 获取列表数据
        getHttp() {
            let _self = this;
            this.loading = true
            this.$store.dispatch('getMarketInfoList', {
                body: {
                    biz_module: 'breedService', //breedService
                    biz_method: 'queryBreedPrice', //queryBreedPrice
                    biz_param: _self.httpParam
                },
                path: common.urlCommon + common.apiUrl.most
            }).then(() => {
                _self.loading = false;
            }, () => {
                _self.loading = false
            });
        },
        // 搜索获取数据
        serachContent() {
            this.loading = true;
            if (this.searchValue === "全部" || !this.searchValue) {
                this.httpParam.name = ""
            } else {
                this.httpParam.name = this.searchValue;
            }
            this.httpParam.pn = 1;
            this.getHttp();

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
                _self.$store.dispatch('getMarketInfoPpl', obj).then(() => {
                    cb(_self.$store.state.marketInfo.ppl.list);
                }, () => {
                    cb([]);
                });
            }, 300);
        },
        handleSelect(item) {
            this.httpParam.name = item.keyWord;
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
