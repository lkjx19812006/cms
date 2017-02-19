<style lang="stylus" scoped>
</style>
<template>
    <div>
        <div></div>
        <div>
            <el-table v-bind:data="resourceList" border style="width: 100%" max-height="500">
                <el-table-column fixed prop="breedName" label="日期" width="150">
                </el-table-column>
                <el-table-column prop="location" label="姓名" width="120">
                </el-table-column>
                <el-table-column prop="shelveTime" label="省份" width="120">
                </el-table-column>
                <el-table-column prop="country" label="市区" width="120">
                </el-table-column>
                <el-table-column prop="address" label="地址" width="300">
                </el-table-column>
                <el-table-column prop="customerName" label="邮编" width="120">
                </el-table-column>
                <el-table-column fixed="customerPhone" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="deleteRow(scope.$index, tableData4)" type="text" size="small">
                            移除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'

let _self = this;

function fetchItem(store) {
    return store.dispatch('getResourceList', {
        biz_module: 'intentionService',
        biz_method: 'querySupplyList',
        biz_param: {
            sort: {
                "shelve_time": "0",
                "price": "0"
            },
            location: ["",""],
            sampling: -1,
            pn: 1,
            pSize: 20
        }
    });
}

export default {
    name: 'resource-view',
    data() {
        return {
        }
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
         resourceList() {
            return this.$store.state.resource.resourceList
        },
    },
    methods: {

    },
    preFetch: fetchItem
}
</script>
