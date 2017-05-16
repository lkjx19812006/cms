<style>
.addActivity {
    min-height: 600px;
    margin: auto;
}
</style>
<template>
    <div class="addActivity">
        <el-form ref="activityParam" :model="activityParam" :rules="rules" label-width="80px" v-loading.body="loading">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="activityParam.name"></el-input>
            </el-form-item>
            <el-form-item label="app活动图片" prop="activityImg">
                <imageUpload :imgUrl="activityParam.appUrl" :param='activityParam' v-on:postUrl="recieveUrl"></imageUpload>
            </el-form-item>
            <el-form-item label="web活动图片" prop="webImg">
                <imageUpload :imgUrl="activityParam.webUrl" :param='activityParam' v-on:postUrl="recieveUrlWebImg"></imageUpload>
            </el-form-item>
            <el-form-item label="活动url" prop="activityUrl">
                <el-input v-model="activityParam.activityUrl" placeholder="请输入活动地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('activityParam')">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import imageUpload from './imageUpload.vue';
import common from '../common/common.js'
import httpService from '../common/httpService'
export default {
    data() {
            let _self = this;
            return {
                loading: false,
                rules: {
                    name: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }],
                    activityUrl: [{
                        message: '请输入正确或合法的地址',
                        type: 'url',
                        trigger: 'blur'
                    }],
                    activityImg: [{
                        required: true,
                        message: '请选择活动图片',
                        trigger: 'blur'
                    }],
                    webImg: [{
                        required: true,
                        message: '请选择活动图片',
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
            imageUpload
        },
        methods: {
            recieveUrl(val) {
                this.activityParam.activityImg = val.url;
                this.activityParam.appUrl = val.url;
            },
            recieveUrlWebImg(val) {
                this.activityParam.webImg = val.url;
                this.activityParam.webUrl = val.url;
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.loading = true;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'activityService',
                            biz_method: 'addActivityInfo',
                            biz_param: {
                                name: _self.activityParam.name,
                                title: _self.activityParam.name,
                                webImg: _self.activityParam.webImg,
                                activityImg: _self.activityParam.activityImg,
                                activityUrl: _self.activityParam.activityUrl
                            }
                        }
                        if (this.activityParam.id) {
                            body = {
                                biz_module: 'activityService',
                                biz_method: 'updateActivityInfo',
                                biz_param: {
                                    id: _self.activityParam.id,
                                    name: _self.activityParam.name,
                                    title: _self.activityParam.name,
                                    activityImg: _self.activityParam.activityImg,
                                    webImg: _self.activityParam.webImg,
                                    activityUrl: _self.activityParam.activityUrl
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
                            _self.$emit("addActivity");

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
