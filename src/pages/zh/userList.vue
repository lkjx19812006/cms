<style scoped>
.table {
    padding-top: 20px;
    text-align: center;
    background-color: #fff;
}

.sort {
    float: left;
    width: 100%;
    padding: 20px 0;
    text-align: center;
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
            <el-input style="width:200px;margin-right:20px" v-model="httpParam.fullname" placeholder="请输入姓名"></el-input>
            <el-input style="width:200px;margin-right:20px" v-model="httpParam.phone" placeholder="请输入电话号码"></el-input>
            <el-button type="primary" @click="search()" icon="search">搜索</el-button>
        </div>
        <div class="table">
            <el-table v-bind:data="userList" border style="width:902px;margin:auto" max-height="550" v-loading.body="loading">
                <el-table-column prop="fullname" label="姓名" width="150">
                </el-table-column>
                <el-table-column prop="phone" label="电话" width="120">
                </el-table-column>
                <el-table-column prop="gender" label="性别" width="120">
                </el-table-column>
                <el-table-column prop="score" label="积分" width="120">
                </el-table-column>
                <el-table-column prop="grade" label="等级" width="120">
                </el-table-column>
                <el-table-column prop="type" label="类型" width="150">
                </el-table-column>
                <el-table-column fixed="right" label="操作" width="120">
                    <template scope="scope">
                        <el-button @click.native.prevent="detail(scope.$index)" type="text" size="small">
                            详情
                        </el-button>
                        <el-button @click.native.prevent="updateScore(scope.$index)" type="text" size="small">
                            修改积分
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="用户详情" v-model="dialogShow.dialogUserDetail">
            <userDetail></userDetail>
        </el-dialog>
    </div>
</template>
<script>
import {
    mapGetters
} from 'vuex'
import common from '../../common/common.js'
import userDetail from '../../components/userDetail.vue'

let param = {
    id: '',
    phone: '',
    fullname: '',
    pn: 1,
    pSize: 10
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
        biz_module: 'userService',
        biz_method: 'queryUserList',
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
    return store.dispatch('getUserList', {
        body: body,
        path: url
    });
}

export default {
    name: 'resource-view',
    data() {
        return {
            loading: false,
            httpParam: param,
            dialogShow: {
                dialogUserDetail: false
            }
        }
    },
    components: {
        userDetail
    },
    computed: {
        langConfig() {
            return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
        },
        userList() {
            return this.$store.state.user.userList.list
        },
        total() {
            return this.$store.state.user.userList.total
        }
    },
    mounted() {
        if (this.$store.state.user.userList.list.length == 0) {
            this.getHttp();
        }
    },
    methods: {
        httpUpdateCore(id, value) {
            let _self=this;
            _self.loading = true;
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'userService',
                biz_method: 'updateUserScore',
                biz_param: {
                    id: id,
                    score: value
                }
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('updateUserScore', {
                body: body,
                path: url
            }).then(() => {
                _self.getHttp();
                 this.$message({
                    type: 'info',
                    message: '修改成功'
                });
            }, () => {
                _self.loading = false
            });
        },
        updateScore(index) {
            let _self = this;
            let id = this.userList[index].id;
            this.$prompt('请输入需要修改的积分', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                inputPattern: /^(-)?[1-9][0-9]*$/,
                inputErrorMessage: '只允许输入整数'
            }).then(({
                value
            }) => {
                this.httpUpdateCore(id, value);
            }).catch((err) => {
                console.log(err);
                this.$message({
                    type: 'info',
                    message: '取消输入'
                });
            });
        },
        search() {
            this.httpParam.pn = 1;
            this.getHttp();
        },
        handleCurrentChange(val) {
            this.httpParam.pn = val;
            this.getHttp();
        },
        getHttp() {
            let _self = this;
            this.loading = true
            let url = common.urlCommon + common.apiUrl.most;
            let body = {
                biz_module: 'userService',
                biz_method: 'queryUserList',
                biz_param: _self.httpParam
            }
            if (common.KEY) {
                url = common.addSID(url);
                body.version = 1;
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
            }
            this.$store.dispatch('getUserList', {
                body: body,
                path: url
            }).then(() => {
                _self.loading = false
            }, () => {
                _self.loading = false
            });
        },
        detail(index) {            
            let _self = this;
            let id = this.userList[index].id;
            this.$store.dispatch('getUserDetail', id).then(() => {
                _self.loading = false;
                _self.dialogShow.dialogUserDetail = true;
            }, () => {
                _self.loading = false
            });


        }
    },
    preFetch: fetchItem
}
</script>
