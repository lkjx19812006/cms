<!-- 药材品种组件 -->
<style lang="less" scoped>
</style>
<template>
    <el-select clearable v-model="breedId" @change="changeBreed" filterable remote :remote-method="remoteMethod" placeholder="请输入药材名">
        <el-option v-for="item in selectData" :key="item.breedId" :label="item.breedName" :value="item.breedId">
        </el-option>
    </el-select>
</template>
<script>
import common from '../common/common.js'
export default {
    name: 'breed',
    props: ['value'],
    data() {
        return {
            selectData: [],
            loading: false,
            breedId: '',
            timeout: ''
        }
    },   
    methods: {
        changeBreed(paramsId) {
            //匹配ID 返回对象
            let src = this.selectData;
            for (var i = 0; i < src.length; i++) {
                if (src[i].breedId === paramsId) {
                    this.$emit('getBreedId', src[i]);
                    return;
                }
            }
            this.$emit('getBreedId', {
                breedId: '',
                breedName: ''
            });
        },
        remoteMethod(queryString) {
            this.loading = true;
            if (!queryString) {
                this.selectData = [];
                this.loading = false;
            } else {             
                let _self = this;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    let url = common.urlCommon + common.apiUrl.most;
                    let body = {
                        biz_module: 'searchKeywordService',
                        biz_method: 'querySearchKeywordBreed',
                        biz_param: {
                            keyWord: queryString,
                            pn: 1,
                            pSize: 20
                        }
                    };
                    let obj = {
                        body: body,
                        path: url
                    };
                    _self.$store.dispatch('getbreedList', obj).then((res) => {                     
                        _self.selectData =  res.biz_result.list;
                        _self.loading = false;
                    }, () => {
                        _self.selectData = [];
                        _self.loading = false;
                    });
                }, 300);
            }
        },
    }
}
</script>
