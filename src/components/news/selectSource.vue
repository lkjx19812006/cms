<style scoped>
.sort {
    float: right;
    padding: 20px;
    width: 100%;
}

.sort .radio {
    float: left;
    margin-left: 50px;
}

.sort .radio .title {
    float: left;
    margin-right: 20px;
}

.pagination {
    margin: 20px;
    text-align: center;
}

.bottom_button {
    margin-bottom: 20px;
    float: left;
    width: 100%;
}
</style>
<template>
    <div>
        <div class="sort">
            <div class="radio">
                <div class="title">资源类型:</div>
                <el-radio-group v-model="resourceType">
                    <el-radio label="资源列表"></el-radio>
                    <el-radio label="求购列表"></el-radio>
                </el-radio-group>
            </div>
            <div class="sort-button" v-show="resourceType=='资源列表'">
                <el-autocomplete style="margin-right:20px;float:right" v-model="searchValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
            </div>
            <div class="sort-button" v-show="resourceType=='求购列表'">
                <el-autocomplete style="margin-right:20px;float:right" v-model="needValue" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
            </div>
        </div>
        <div v-show="resourceType=='资源列表'">
            <el-table v-bind:data="sourceList" border style="width:710px;margin:auto" max-height="550" highlight-current-row @current-change="handleChange" :v-loading.body="loading">
                <el-table-column prop="breedName" label="药材名称" width="150">
                </el-table-column>
                <el-table-column prop="price" label="价格" width="120">
                </el-table-column>
                <el-table-column prop="spec" label="规格" width="120">
                </el-table-column>
                <el-table-column prop="location" label="产地" min-width="110">
                </el-table-column>
                <el-table-column prop="shelveTime" label="上架时间" min-width="190">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :current-page="sourceHttpParam.pn" layout="total, prev, pager, next, jumper" :total="sourceTotal">
                </el-pagination>
            </div>
        </div>
        <div v-show="resourceType=='求购列表'">
            <el-table v-bind:data="needSourceList" border style="width:630px;margin:auto" max-height="550" highlight-current-row @current-change="handleChange" :v-loading.body="loading">
                <el-table-column prop="breedName" label="药材名称" min-width="140">
                </el-table-column>
                <el-table-column prop="offer" label="报价人数" width="120">
                </el-table-column>
                <el-table-column prop="overTime" label="剩余时间" width="120">
                </el-table-column>
                <el-table-column prop="spec" label="规格" width="120">
                </el-table-column>
                <el-table-column prop="location" label="产地" min-width="110">
                </el-table-column>
            </el-table>
            <div class="pagination">
                <el-pagination @current-change="handleCurrentChange" :current-page="needHttpParam.pn" layout="total, prev, pager, next, jumper" :total="needTotal">
                </el-pagination>
            </div>
        </div>
        <div class="bottom_button">
            <el-button type="primary" @click="confirm()" style="float:right">确定</el-button>
        </div>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService'
export default {
    data() {
            return {
                needValue: '',
                resourceType: '资源列表',
                loading: true,
                sourceList: [],
                needSourceList:[],
                total: 0,
                sourceTotal: 0,
                needTotal: 0,
                multipleSelection: '',
                searchValue: '',
                needHttpParam: {
                    sort: {
                        "offer": "0",
                        "duedate": "0",
                        "shelve_time": "0"
                    },
                    location: ["", ""],
                    keyWord: '',
                    pn: 1,
                    pSize: 10
                },
                sourceHttpParam: {
                    sort: {
                        "shelve_time": "0",
                        "price": "0"
                    },
                    location: ["", ""],
                    sampling: -1,
                    pn: 1,
                    pSize: 10,
                    keyWord: ''
                }
            }
        },
        computed: {
            langConfig() {
                return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
            }
        },
        mounted() {
            this.getHttp();
        },
        watch:{
            resourceType(value,oldvalue){
                if(value=='资源列表'&&this.sourceList.length==0){
                    this.getHttp();
                }else if(value=='求购列表'&&this.needSourceList.length==0){
                     this.getHttp();
                }
            }
        },
        methods: {
            handleSelect(item) {
                if (this.resourceType == '资源列表') {
                    this.sourceHttpParam.keyWord = item.keyWord;
                    this.sourceHttpParam.pn = 1;
                } else {
                    this.needHttpParam.keyWord = item.keyWord;
                    this.needHttpParam.pn = 1;
                }
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
                    _self.$store.dispatch('getPpl', obj).then(() => {
                        cb(_self.$store.state.resource.ppl.list);
                    }, () => {
                        cb([]);
                    });
                }, 300);
            },
            confirm() {
                this.$emit('resource', this.multipleSelection);
            },
            handleChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
                if (this.resourceType == '资源列表') {
                    this.sourceHttpParam.pn = val;
                } else {
                    this.needHttpParam.pn = val;
                }
                this.getHttp();
            },
            getHttp() {
                let _self = this;
                let url = common.urlCommon + common.apiUrl.most;
                if (this.resourceType == '资源列表') {
                    let body = {
                        biz_module: 'intentionService',
                        biz_method: 'querySupplyList',
                        biz_param: _self.sourceHttpParam
                    }
                    httpService.commonPost(url, body, function(res) {
                        _self.sourceList = res.biz_result.list;
                        _self.sourceTotal = res.biz_result.total;
                    }, function(err) {
                        console.log(err)
                    })
                }else {
                      let body = {
                        biz_module: 'intentionService',
                        biz_method: 'queryBegBuyList',
                        biz_param: _self.needHttpParam
                    }
                    httpService.commonPost(url, body, function(res) {
                        _self.needSourceList = res.biz_result.list;
                        _self.needTotal = res.biz_result.total;
                    }, function(err) {
                        console.log(err)
                    })
                }
            }
        }
}
</script>
