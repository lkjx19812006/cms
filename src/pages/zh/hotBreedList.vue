<style scoped lang="less">
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
    width: 920px;
    overflow: hidden;
    text-align: right;
    margin: auto;
}

.link {
    color: blue;
}

.link:hover {
    text-decoration: underline;
}

.content .hotBreed_img .btn_wrap {
    padding: 10px 0;
    margin-top: 20px;
    text-align: left;
}

.content .table .img_wrap {
    width: 100%;
    text-align: center;
    max-height: 200px;
    padding: 5px 0;
    overflow: hidden;
}

.content .table .img_wrap img {
    display: block;
    width: 100%;
    max-height: 200px;
    vertical-align: baseline;
    padding: 0;
    margin: 0 auto;
}

.content {
    .hotBreed_img {
        .breed_name_wrap {
            margin-bottom: 20px;
        }
    }
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <div class="top_wrap">
                <el-autocomplete style="width: 200px; margin-right:10px;" v-model="getParams.keyWord" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelect"></el-autocomplete>
                <el-button type="primary" @click="getHttp()" icon="search">搜索</el-button>
                <el-button type="primary" @click="reset">重置</el-button>
                <el-button type="primary" @click="newAdd">新建</el-button>
            </div>
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="hotBreedList" border style="width: 920px;margin:auto" max-height="600" v-loading.body="loading">
                <el-table-column prop="keyWord" label="药材名称" width="180">
                </el-table-column>
                <el-table-column prop="clickNum" label="点击次数" width="120">
                </el-table-column>
                <el-table-column label="药材图片" width="200">
                    <template scope="scope">
                        <div class="img_wrap">
                            <img :src="scope.row.hotImg">
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" width="200">
                    <template scope="scope">
                        <span>{{scope.row.createTime |formatTime2 }}</span>
                    </template>
                </el-table-column>
                <el-table-column label="操作" min-width="200">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button v-if="scope.row.sort === 0" @click.native.prevent="sortTop(scope.row.id)" type="text" size="small">
                            置顶
                        </el-button>
                        <el-button v-if="scope.row.sort != 0" @click.native.prevent="sortTopClose(scope.row.id)" type="text" size="small">
                            取消置顶
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="getParams.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog style="width: 920px; margin: auto" @close="closeDialog" title="热门搜索" v-model="addShow">
            <div class="hotBreed_img">
                <div class="breed_name_wrap">
                    <span style="margin-right: 20px;">品名</span>
                    <el-autocomplete style="width: 200px; margin-right: 20px;" v-model="breedName" :fetch-suggestions="querySearchAsync" placeholder="请输入药材名称" @select="handleSelectBreedId"></el-autocomplete>
                </div>
                <div>
                    <imageUpload :imgUrl="httpParam.hotImg" :param='httpParam' v-on:postUrl="recieveUrlHotImg"></imageUpload>
                </div>
                <div class="btn_wrap">
                    <el-button type="primary" size="small" @click="submitImg">保存信息</el-button>
                </div>
            </div>
        </el-dialog>
    </div>
</template>
<script>
import imageUpload from '../../components/imageUpload.vue';
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'
let param = {
    pn: 1,
    pSize: 10,
    keyWord: '',
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
        biz_module: 'searchKeywordService',
        biz_method: 'cmsHotSearchList',
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
    return store.dispatch('getHotBreedList', {
        body: body,
        path: url
    });
}
export default {
    name: 'hotBreedList-view',
    data() {
        return {
            httpParam: {
                hotImg: '',
                id: '',
                keyName: 'news',
            },
            keyBreedList: [],
            breedName: '',
            breedId: '',
            getParams: param,
            loading: false,
            addShow: false
        }
    },
    components: {
        imageUpload
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        hotBreedList() {
            return this.$store.state.duryEn.hotBreedList.list
        },
        total() {
            return this.$store.state.duryEn.hotBreedList.total
        }
    },
    mounted() {
        if (this.$store.state.duryEn.hotBreedList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        closeDialog() {
            this.addShow = false;
        },
        recieveUrlHotImg(val) {
            this.httpParam.hotImg = val.url;
        },
        handleCurrentChange(val) {
            param.pn = val;
            this.getParams.pn = val;
            this.getHttp();
        },
        newAdd() {
            this.httpParam.id = '';
            this.httpParam.hotImg = '';
            this.breedName = '';
            this.breedId = '';
            this.addShow = true;
        },
        handleSelectBreedId(val) {
            this.breedId = val.breedId;
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'searchKeywordService',
                biz_method: 'cmsHotSearchList',
                biz_param: _self.getParams
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getHotBreedList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        reset() {
            this.getParams.keyWord = "";
            this.getParams.pn = 1;
            this.getHttp();
        },
        submitImg() {
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {};
            if (this.httpParam.id) {
                body = {
                    biz_module: 'searchKeywordService',
                    biz_method: 'updateHotSearchImage',
                    biz_param: {
                        id: _self.httpParam.id,
                        breedId: _self.breedId,
                        hotImg: _self.httpParam.hotImg
                    }
                }
            } else {
                if (!_self.httpParam.hotImg) {
                    this.$message({
                        message: '请上传热搜药材图片',
                        type: 'warning'
                    });
                    return;
                }
                if (!_self.breedId) {
                    this.$message({
                        message: '填写药材名称',
                        type: 'warning'
                    });
                    return;
                }
                body = {
                    biz_module: 'searchKeywordService',
                    biz_method: 'addHotSearchImage',
                    biz_param: {
                        keyWord: _self.breedName,
                        breedId: _self.breedId,
                        hotImg: _self.httpParam.hotImg
                    }
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.loading = true
            this.$store.dispatch('updateHotSearchImage', {
                body: body,
                path: url
            }).then(() => {
                this.getHttp();
                this.addShow = false;
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            this.httpParam.id = this.hotBreedList[index].id;
            this.httpParam.hotImg = this.hotBreedList[index].hotImg;
            this.getkeyBreedList(this.hotBreedList[index].keyWord).then(() => {
                this.addShow = true;
            });
        },
        sortTop(paramId) {
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'searchKeywordService',
                biz_method: 'hotSearchSortTop',
                biz_param: {
                    id: paramId
                }
            }
            url = common.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            this.loading = true
            this.$store.dispatch('hotSearchSortTop', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
                _self.getHttp();
            }, () => {
                _self.loading = false
            });
        },
        sortTopClose(paramId) {
            let _self = this;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'searchKeywordService',
                biz_method: 'hotSearchSortReset',
                biz_param: {
                    id: paramId
                }
            }
            url = common.addSID(url);
            body.version = 1;
            body.time = Date.parse(new Date()) + parseInt(common.difTime);
            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            this.loading = true
            this.$store.dispatch('hotSearchSortTop', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
                _self.getHttp();
            }, () => {
                _self.loading = false
            });
        },
        getkeyBreedList(keyWord) {
            let _self = this;
            return new Promise((resolve, rejext) => {
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'searchKeywordService',
                    biz_method: 'querySearchKeywordBreed',
                    biz_param: {
                        keyWord: keyWord,
                        pn: 1,
                        pSize: 20
                    }
                }
                let obj = {
                    body: body,
                    path: url
                }
                _self.$store.dispatch('getKeyBreedList', obj).then((res) => {
                    for (var i = 0; i < res.biz_result.list.length; i++) {
                        if (keyWord === res.biz_result.list[i].breedName) {
                            _self.breedName = keyWord;
                            _self.breedId = res.biz_result.list[i].breedId;
                        }
                    }
                    resolve();
                }, () => {
                    rejext();
                });
            })
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
                    biz_method: 'querySearchKeywordBreed',
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
            this.getParams.keyWord = item.keyWord;
            this.getParams.pn = 1;
            this.getHttp();
        },
    },
    preFetch: fetchItem
}
</script>
