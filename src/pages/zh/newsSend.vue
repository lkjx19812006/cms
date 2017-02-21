<style scoped>
.sort {
    text-align: center;
    background-color: #fff;
    position: relative;
    float: right;
    height: 80px;
    width: 100%;
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
    margin-top: 10px;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <div class="sort-button">
                <el-button type="primary" @click="add()">新增</el-button>
            </div>
        </div>
        <div v-if="resourceList.length>0" class="table">
            <el-table v-bind:data="resourceList" border style="width:1106px;margin:auto" max-height="550" @selection-change="handleSelectionChange" v-loading.body="loading">
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
                        <el-button @click.native.prevent="sendAgain(scope.$index)" type="text" size="small">
                            再次发送
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div v-if="resourceList.length==0">
            暂无数据
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
            </el-col>
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
            timeout: null,
            type: [{
                key: 1,
                value: '资源'
            }, {
                key: 2,
                value: '活动'
            }, {
                key: 3,
                value: '订单'
            }, ]
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
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        handleSelectionChange(val) {
            this.multipleSelection = val;
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
        sendAgain(index) {

        },
        add() {
            console.log('aaaaa');

        }
    },
    preFetch: fetchItem
}
</script>
