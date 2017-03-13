<style scoped>
    .sort {
        float: right;
        padding: 20px;
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
            <el-button type="primary" @click="search()" style="float:right">搜索</el-button>
            <el-input placeholder="请输入姓名" style="width:150px;float:right;margin-right:20px" v-model="httpParam.fullname"></el-input>
            <el-input type="phone" style="width:150px;float:right;margin-right:20px" placeholder="请输入手机号" v-model="httpParam.phone"></el-input>
        </div>
        <el-table v-bind:data="userList" border style="width:595px;margin:auto" max-height="550" @selection-change="handleSelectionChange" :v-loading.body="loading">
            <el-table-column type="selection" fixed="left" width="55">
            </el-table-column>
            <el-table-column prop="fullname" label="名称" width="150">
            </el-table-column>
            <el-table-column prop="phone" label="手机号" width="150">
            </el-table-column>
            <el-table-column prop="gender" label="性别" min-width="100">
            </el-table-column>
            <el-table-column prop="grade" label="会员等级" width="120">
            </el-table-column>
        </el-table>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn" layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <div class="bottom_button">
            <!-- 新增返回推送 -->
            <el-button type="primary" @click="brakSend()" style="float:right">返回推送</el-button>
            <el-button type="primary" @click="confirm()" style="float:right;margin-right:10px">保存用户</el-button>
        </div>
    </div>
</template>
<script>
    import common from '../../common/common.js'
    import httpService from '../../common/httpService'
    export default {
        data() {
            return {
                loading: true,
                multipleSelection: [],
                userList: [],
                total: 1,
                httpParam: {
                    phone: '',
                    fullname: '',
                    pn: 1,
                    pSize: 10
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
        methods: {
            search() {
                this.httpParam.pn = 1;
                this.getHttp();
            },
            // 新增返回推送
            brakSend() {
                this.$emit('brakSend', {
                    dialog: false,
                    dialogResource: false,
                    dialogUser: false
                });
            },
            confirm() {
                this.$emit('message', this.multipleSelection);
            },
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },
            handleCurrentChange(val) {
                this.httpParam.pn = val;
                this.getHttp();
            },
            getHttp() {
                let _self = this;
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
                httpService.commonPost(url, body, function(res) {
                    _self.userList = res.biz_result.list;
                    _self.total = res.biz_result.total;
                }, function(err) {
                    console.log(err)
                })
            }
        }
    }
</script>