<style scoped>
</style>
<template>
    <div>
        <el-form ref="activityParam" :model="activityParam" :rules="rules" label-width="180px" v-loading.body="loading">
            <el-form-item label="普通更新最新版本号" prop="version">
                <el-input v-model="activityParam.version" placeholder="请先填写版本号"></el-input>
            </el-form-item>
            <el-form-item label="强制更新最低版本号" prop="compel">
                <el-input v-model="activityParam.compel" placeholder="请填写强制更新最低版本号"></el-input>
            </el-form-item>
            <el-form-item label="APK名称" prop="downUrl">
                <uploadFile :param="addParam" v-on:postUrl="receiveUrl"></uploadFile>
            </el-form-item>
            <el-form-item label="版本更新介绍" prop="content">
                <el-input type="textarea" :rows="4" v-model="activityParam.content" placeholder="请填写版本更新介绍"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('activityParam')">确定</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import common from '../../common/common.js'
import httpService from '../../common/httpService'
import uploadFile from '../uploadFile.vue'
export default {
    data() {
            let _self = this;
            return {
                loading: false,
                addParam: _self.activityParam,
                rules: {
                    version: [{
                        required: true,
                        message: '请输入版本号',
                        trigger: 'blur',
                    },{
                        pattern:/^[0-9]*.[0-9]*.[0-9]*$/,
                        message: '版本号格式错误',
                    }],
                    compel: [{
                        required: true,
                        message: '请输入强制更新版本号',
                        trigger: 'blur'
                    },{
                        pattern:/^[0-9]*.[0-9]*.[0-9]*$/,
                        message: '版本号格式错误',
                    }],
                    content: [{
                        required: true,
                        message: '请输入版本更新介绍',
                        trigger: 'blur'
                    }],
                    downUrl: [{
                        required: true,
                        message: '请选择apk, 或升级包',
                        trigger: 'blur'
                    }]
                }
            }
        },
        props: {
            activityParam: {
                default: null
            }
        },
        components: {
            uploadFile
        },
        methods: {
            receiveUrl(val) {
                this.activityParam.downUrl=val.url;
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.loading = true;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'versionService',
                            biz_method: 'addVersion',
                            biz_param: {
                                type: _self.activityParam.type,
                                version: _self.activityParam.version,
                                compel: _self.activityParam.compel,
                                content: _self.activityParam.content,
                                detail: _self.activityParam.detail,
                                downUrl :  _self.activityParam.downUrl
                            }
                        }
                        if (this.activityParam.id) {
                            body = {
                                biz_module: 'versionService',
                                biz_method: 'updateVersion',
                                biz_param: {
                                    id: _self.activityParam.id,
                                    type: _self.activityParam.type,
                                    version: _self.activityParam.version,
                                    compel: _self.activityParam.compel,
                                    content: _self.activityParam.content,
                                    detail: _self.activityParam.detail,
                                    downUrl :  _self.activityParam.downUrl
                                }
                            }
                        }
                        if (common.KEY) {
                            url = common.addSID(url);
                            body.version = 1;
                            body.time = Date.parse(new Date()) + parseInt(common.difTime);
                            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                        }
                        httpService.commonPost(url, body, function(res) {
                            _self.loading = false;
                            _self.$message({
                                type: 'info',
                                message: '操作成功'
                            });
                            _self.$emit("addVersion");

                        }, function(err) {
                            _self.loading = false;
                        })
                    } else {
                        return false;
                    }
                });
            }
        }
}
</script>
