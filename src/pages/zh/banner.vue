<style scoped>
.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
}

.table  img{
	max-width: 100%;
}

.table a{
	color: blue;
}

.pagination {
    text-align: center;
    background-color: white;
    padding: 20px;
}

.sort {
    text-align: right;
    padding: 20px 0;
    padding-right: 100px;
    background-color: #fff;
}
</style>
<template>
    <div class="content">
        <div class="sort">
            <el-button type="primary" @click="add()" style="margin-left:50px">新增报道</el-button>
        </div>
        <div class="table">
            <el-table v-bind:data="mediaList" border style="
            width:1329px;margin:auto" max-height="660" v-loading.body="loading">
                <el-table-column prop="title" label="标题" width="200">
                </el-table-column>
                <el-table-column prop="intro" label="简介" width="500">
                </el-table-column>
                <el-table-column  label="图片地址" width="300">
                  <template scope="scope">
                        <img :src="scope.row.imgUrl">
                    </template>
                </el-table-column>
                <el-table-column  label="新闻地址" width="120">
                <template scope="scope">
                        <a :href="scope.row.linkUrl" target="_blank" >{{scope.row.linkUrl}}</a>
                    </template>
                </el-table-column>
                <el-table-column label="状态" width="70">
                    <template scope="scope">
                        <span>{{scope.row.status |formatMediaType}}</span>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="edit(scope.$index)" type="text" size="small">
                            编辑
                        </el-button>
                        <el-button @click.native.prevent="del(scope.$index)" type="text" size="small" v-if="scope.row.status==1">
                            删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="banner" v-model="dialogShow.diaglogMediaDetail">
            <addMedia :activityParam="mediaDetail" v-on:addMedia="recieveAdd">
                </addMedia>
        </el-dialog>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'
import addMedia from '../../components/addMedia.vue'

let param = {
    pn: 1,
    pSize: 10,
    type: 0,
    title: ''
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
        biz_method: 'queryCompanyNewsList',
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
    return store.dispatch('getBannerList', {
        body: body,
        path: url
    });
}

export default {
    name: 'media-view',
    data() {
        return {
            loading: false,
            httpParam: param,
            dialogShow: {
                diaglogMediaDetail: false
            },
            mediaDetail: {
                id: '',
                type: 0,
                imgUrl: '',
                title: '',
                intro: '',
                linkUrl: '',
                keyName: 'news'
            }
        }
    },
    components: {
        addMedia
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        mediaList() {
            return this.$store.state.media.bannerList.list
        },
        total() {
            return this.$store.state.media.bannerList.total
        }
    },
    mounted() {
        if (this.$store.state.media.bannerList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        del(index) {
            let id = this.mediaList[index].id;
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'pushService',
                biz_method: 'deleteCompanyNews',
                biz_param: {
                    id: id
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('updateMediaState', {
                body: body,
                path: url
            }).then(() => {
                _self.$message({
                    type: 'info',
                    message: '删除成功'
                });
                _self.getHttp();
            }, () => {
                _self.loading = false;
            });
        },
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        recieveAdd() {
            if (!this.mediaDetail.id) this.httpParam.pn = 1;
            this.getHttp();
            this.dialogShow.diaglogMediaDetail = false;
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'pushService',
                biz_method: 'queryCompanyNewsList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getBannerList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        edit(index) {
            this.mediaDetail.id = this.mediaList[index].id;
            this.mediaDetail.imgUrl = this.mediaList[index].imgUrl;
            this.mediaDetail.title = this.mediaList[index].title;
            this.mediaDetail.intro = this.mediaList[index].intro;
            this.mediaDetail.linkUrl = this.mediaList[index].linkUrl;
            this.mediaDetail.url = this.mediaDetail.imgUrl;
            this.dialogShow.diaglogMediaDetail = true;
        },
        add() {
            this.mediaDetail.id = '';
            this.mediaDetail.imgUrl = '';
            this.mediaDetail.title = '';
            this.mediaDetail.intro = '';
            this.mediaDetail.linkUrl = '';
            this.mediaDetail.url = '';
            this.dialogShow.diaglogMediaDetail = true;
        }
    },
    preFetch: fetchItem
}
</script>
