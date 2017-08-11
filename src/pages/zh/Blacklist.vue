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
        display: flex;
        flex-direction: row;
        justify-content: center;
    }

    .sort .form_wrap {
        margin: auto;
    }

    .pagination {
        text-align: center;
        background-color: white;
        padding: 20px;
    }

    /* 新增样式 让推送列表可以滚动 */
    .el-table__body tbody {
        height: 400px !important;
        overflow: scroll;
    }
</style>
<template>
    <div class="content">
        <div class="sort">
            <div class="form_wrap">
                <!--<el-select style="width:150px;margin-right:20px; float: left" @change="selectChange"-->
                <!--v-model="httpParam.status" placeholder="请选择">-->
                <!--<el-option v-for="item in options" :label="item.label" :value="item.value">-->
                <!--</el-option>-->
                <!--</el-select>-->
                <el-input style="width:200px;margin-right:20px; float: left"
                          v-model="httpParam.mobile"
                          placeholder="请输入拉黑用户手机"
                          icon="circle-cross"
                          :on-icon-click="clearMobile">
                </el-input>
                <el-button style="float: left" type="primary" @click="search()" icon="search">搜索</el-button>
                <el-button style="float: left" type="primary" @click="dialogVisible = true">新增拉黑</el-button>
            </div>
        </div>
        <div class="table">
            <el-table align="center" v-bind:data="blackList" border style="width:840px;margin:auto" max-height="800"
                      v-loading.body="loading">
                <el-table-column prop="ctime" label="时间" min-width="140">
                    <template scope="scope">
                        <span>{{scope.row.ctime | userBirthday}}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="mobile" label="用户手机" width="120">
                </el-table-column>
                <el-table-column prop="operatorName" label="操作人" width="120">
                </el-table-column>
                <el-table-column prop="reason" label="原因" min-width="200">
                </el-table-column>
                <el-table-column prop="createTime" label="操作" width="180">
                    <template scope="scope">
                        <el-button type="text" :disabled="scope.row.status === 0" @click="deleteSmsBlack(scope.row.id)">
                            解除拉黑
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="pagination">
            <el-pagination @current-change="handleCurrentChange" :current-page="httpParam.pn"
                           layout="total, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </div>
        <el-dialog title="新增拉黑用户" v-model="dialogVisible" size="tiny">
            <el-form :rules="rules" ref="formName" :model="addFormData" label-width="120px">
                <el-form-item label="用户手机" prop="mobile">
                    <el-input v-model="addFormData.mobile" placeholder="请输入要拉黑用户手机"></el-input>
                </el-form-item>
                <el-form-item label="拉黑原因" prop="reason">
                    <el-input type="textarea" :rows="4" v-model="addFormData.reason"
                              placeholder="请输入要拉黑用户的原因"></el-input>
                </el-form-item>
                <el-form-item style="text-align:right">
                    <el-button @click="dialogVisible = false">取 消</el-button>
                    <el-button type="primary" @click="onSubmit('formName')">确 定</el-button>
                </el-form-item>
            </el-form>

        </el-dialog>
    </div>
</template>
<script>
    import {
        mapGetters
    } from 'vuex'
    import common from '../../common/common.js'
    import httpService from '../../common/httpService'

    let param = {
        mobile: '',
        status: -1,
        operator: '',
        pn: 1,
        pSize: 10
    };

    function fetchItem(store, val) {
        let cookie = val.cookie;
        var cookiesObj = {};
        cookie && cookie.split(';').forEach(function (Cookie) {
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
            biz_module: 'smsBlackListService',
            biz_method: 'querySmsBlackList',
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
        return store.dispatch('getBlackList', {
            body: body,
            path: url
        });
    }

    export default {
        name: 'newsend-view',
        data() {
            var checkPhone = (rule, value, callback) => {
                if (!(/^1(3|4|5|7|8)\d{9}$/.test(value))) {
                    callback(new Error('请输入正确的手机号码'));
                } else {
                    callback();
                }
            };
            return {
                dialogVisible: false,
                options: [{
                    label: '全部',
                    value: -1
                }, {
                    label: '已隔离用户',
                    value: 1
                }, {
                    label: '未隔离用户',
                    value: 0
                }],
                addFormData: {
                    mobile: '',
                    reason: '',
                },
                rules: {
                    mobile: [
                        {
                            required: true,
                            message: '请输入手机号码',
                            trigger: 'blur'
                        }, {
                            validator: checkPhone,
                            trigger: 'blur'
                        }
                    ],
                    reason: [{
                        required: true,
                        message: '请输入要隔离用户的原因',
                        trigger: 'blur'
                    }]
                },
                loading: false,
                httpParam: param
            }
        },
        computed: {
            langConfig() {
                return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
            },
            blackList() {
                return this.$store.state.sendMsg.blackList.list
            },
            total() {
                return this.$store.state.sendMsg.blackList.total
            }
        },
        created() {
            if (this.$store.state.sendMsg.blackList.list.length == 0) {
                this.getHttp();
            }
        },
        methods: {
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
                    biz_module: 'smsBlackListService',
                    biz_method: 'querySmsBlackList',
                    biz_param: _self.httpParam
                }
                if (common.KEY) {
                    url = common.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                }
                this.$store.dispatch('getBlackList', {
                    body: body,
                    path: url
                }).then(() => {
                    _self.loading = false
                }, () => {
                    _self.loading = false
                });
            },
            selectChange() {
                this.httpParam.pn = 1;
                this.getHttp();
            },
            clearMobile() {
                this.httpParam.mobile = '';
                this.httpParam.pn = 1;
                this.getHttp();
            },
            deleteSmsBlack(paramsId) {
                let url = common.urlCommon + common.apiUrl.most;
                let params;
                if (paramsId && typeof paramsId === 'Array') {
                    params = {blackList: paramsId}
                } else {
                    params = {blackList: [paramsId]}
                }
                let body = {
                    biz_module: 'smsBlackListService',
                    biz_method: 'deleteSmsBlack',
                    biz_param: params
                }
                if (common.KEY) {
                    url = common.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                }
                let _self = this;
                httpService.commonPost(url, body, suc => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    _self.getHttp();
                }, err => {
                    this.$message({
                        type: 'error',
                        message: err.msg
                    })
                })
            },
            addSmsBlack() {
                let url = common.urlCommon + common.apiUrl.most;
                let body = {
                    biz_module: 'smsBlackListService',
                    biz_method: 'addSmsBlack',
                    biz_param: this.addFormData
                }
                if (common.KEY) {
                    url = common.addSID(url);
                    body.version = 1;
                    body.time = Date.parse(new Date()) + parseInt(common.difTime);
                    body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                }
                let _self = this;
                httpService.commonPost(url, body, suc => {
                    this.$message({
                        type: 'success',
                        message: '操作成功'
                    })
                    _self.getHttp();
                    this.dialogVisible = false;
                }, err => {
                    this.$message({
                        type: 'error',
                        message: err.msg
                    })
                })
            },
            onSubmit(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        this.addSmsBlack()
                    }
                });
            }

        },
        preFetch: fetchItem
    }
</script>
