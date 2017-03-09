<style>
.sort {
    text-align: center;
    background-color: #fff;
    padding: 20px;
    position: relative;
}

.sort .sort-button {
    position: absolute;
    bottom: -10px;
    right: 50px;
}

.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
    padding: 20px 50px 0 25px;
}

.tableHeader {
    height: 40px;
    background-color: #EEF1F6;
    border: 1px solid #ccc;
    line-height: 38px;
}

.tableHeader .header {}

.el-table__expanded-cell {
    padding: 0 !important;
}

.el-table__expanded-cell .el-table {
    border: none;
}

.demo-table-expand {
    font-size: 0;
    padding: 0 !important;
}

.demo-table-expand label {
    width: 90px;
    color: #99a9bf;
}

.demo-table-expand .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
    width: 50%;
}

.pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}
</style>
<template>
    <div class="content">
        <!-- 分类排序 -->
        <div class="sort">
            <div class="sort-button">
                <el-button type="primary" @click="sortDefault()" style="float:right">搜索药材</el-button>
                <el-autocomplete style="margin-right:20px;float:right" v-model="searchValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
            </div>
        </div>
        <!-- 表格 -->
        <div class="table">
            <div class="tableHeader">
                <!-- 表头 -->
                <el-row class="header">
                    <el-col :span="4">
                        <div class="grid-content bg-purple-dark" style="padding-left: 48px;">
                            品名
                        </div>
                    </el-col>
                    <el-col :span="3">
                        <div class="grid-content bg-purple-dark">规格</div>
                    </el-col>
                    <el-col :span="3">
                        <div class="grid-content bg-purple-dark">产地</div>
                    </el-col>
                    <el-col :span="3">
                        <div class="grid-content bg-purple-dark">价格</div>
                    </el-col>
                    <el-col :span="3">
                        <div class="grid-content bg-purple-dark">
                            <el-button type="primary" @click="changeMoney" size="small">
                                {{ isMoney? '涨跌(元)': '涨幅(%)' }}
                            </el-button>
                        </div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple-dark">操作</div>
                    </el-col>
                    <el-col :span="4">
                        <div class="grid-content bg-purple-dark">
                            <el-button type="primary" @click="allTop" size="small">
                                全部置顶
                            </el-button>
                        </div>
                    </el-col>
                </el-row>
            </div>
            <!-- 表格 -->
            <el-table :show-header="false" :data="marketInfoList" style="width: 100%">
                <el-table-column type="expand">
                    <template scope="props">
                        <el-table :show-header="false" :data="props.row.list" style="padding:0;">
                            <el-table-column prop="name">
                            </el-table-column>
                            <el-table-column prop="spec">
                            </el-table-column>
                            <el-table-column prop="area">
                            </el-table-column>
                            <el-table-column prop="unitprice">
                            </el-table-column>
                          <!--   <el-table-column>
                                <template scope="props">
                                    <el-col :span="24">
                                        <div v-if="props.row.dayMoney > 0" class="grid-content bg-purple-dark" style="padding-left: 48px;">
                                            <span v-if="isMoney">
                            		{{props.row.dayMoney}}
                            	</span>
                                            <span else>
                            		{{props.row.dayDowns}}
                            	</span> 品名
                                        </div>
                                        <div else class="grid-content bg-purple-dark" style="padding-left: 48px;">
                                            <span>----</span>
                                        </div>
                                    </el-col>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template scope="scope">
                                    <el-button @click.native.prevent="changePrice(scope.$index)" type="text" size="small">
                                        修改价格
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column>
                                <template scope="scope">
                                    <el-button @click.native.prevent="makeTop(scope.$index)" type="text" size="small">
                                        置顶
                                    </el-button>
                                    <el-button @click.native.prevent="sortDefault(scope.$index)" type="text" size="small" v-if="showReset(scope.$index)">
                                        取消置顶
                                    </el-button>
                                </template>
                            </el-table-column> -->
                        </el-table>
                    </template>
                </el-table-column>
                <el-table-column prop="name">
                </el-table-column>
                <el-table-column prop="spec">
                </el-table-column>
                <el-table-column prop="area">
                </el-table-column>
                <el-table-column prop="unitprice">
                </el-table-column>             
                <el-table-column>
                    <template scope="props">
                        <el-col :span="24">
                            <!-- <div v-if="dayMoney(props.row.dayMoney)> 0}" class="grid-content bg-purple-dark" style="padding-left: 48px;">
                                <span v-if="isMoney">
                            		{{props.row.dayMoney}}
                            	</span>
                                <span v-else>
                            		{{props.row.dayDowns}}
                            	</span>
                            </div>
                            <div v-else class="grid-content bg-purple-dark" style="padding-left: 48px;">
                                <span>\-\-</span>
                            </div> -->
                        </el-col>
                    </template>
                </el-table-column>
                <el-table-column>
                    <template scope="props">
                       <!--  <el-button @click.native.prevent="changePrice(scope.$index)" type="text" size="small">
                            修改价格
                        </el-button> -->
                    </template>
                </el-table-column>
                <el-table-column>
                    <template scope="props">
                      <!--   <el-button @click.native.prevent="makeTop(scope.$index)" type="text" size="small">
                            置顶
                        </el-button>
                        <el-button @click.native.prevent="sortDefault(scope.$index)" type="text" size="small" v-if="showReset(scope.$index)">
                            取消置顶
                        </el-button> -->
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
            isMoney: false

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
        dayMoney(params){
        	return parseInt(params);
        }
    },
    mounted() {
        if (this.$store.state.marketInfo.marketInfoList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
    	//修改价格
    	changePrice(){

    	},
        // 切换涨幅样式
        changeMoney() {
            this.isMoney = !this.isMoney;
        },
        // 全部置顶
        allTop() {

        },
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
        // 获取类表数据
        getHttp() {
            let _self = this;
            this.loading = true
            this.$store.dispatch('getMarketInfoList', {
                body: {
                    biz_module: 'breedService',
                    biz_method: 'queryBreedPrice',
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
            // 定置BUG
            if (param || param == 0) {
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
            console.log(body);
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
