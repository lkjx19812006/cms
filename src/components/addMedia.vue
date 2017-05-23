<style scoped>

</style>
<template>
    <div>
        <el-form ref="activityParam" :model="activityParam" :rules="rules" label-width="80px" v-loading.body="loading">
            <el-form-item label="标题" prop="title">
                <el-input v-model="activityParam.title"></el-input>
            </el-form-item>
            <el-form-item label="图片" prop="imgUrl">
                <imageUpload :imgUrl="activityParam.imgUrl" :param="activityParam" v-on:postUrl="recieveUrl"></imageUpload>
            </el-form-item>
            <el-form-item label="链接url" prop="linkUrl">
                <el-input v-model="activityParam.linkUrl" placeholder="http://www.baidu.com"></el-input>
            </el-form-item>
            <el-form-item label="简介" prop="intro">
                <el-input type="textarea" v-model="activityParam.intro"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('activityParam')">保存</el-button>
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
                // sonIsNewAdd,
                loading: false,
                rules: {
                    title: [{
                        required: true,
                        message: '请输入活动名称',
                        trigger: 'blur'
                    }],
                    linkUrl: [{
                        required: true,
                        message: '请输入合法的url',
                        type: 'url',
                        trigger: 'blur'
                    }],
                    imgUrl: [{
                        required: true,
                        message: '请选择活动图片',
                        trigger: 'blur'
                    }],
                    intro: [{
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
                this.activityParam.imgUrl = val.url;
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.loading = true;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'pushService',
                            biz_method: 'addCompanyNews',
                            biz_param: {
                                type: _self.activityParam.type,
                                imgUrl: _self.activityParam.imgUrl,
                                title: _self.activityParam.title,
                                intro: _self.activityParam.intro,
                                linkUrl: _self.activityParam.linkUrl
                            }
                        }
                        if (this.activityParam.id) {
                            body = {
                                biz_module: 'pushService',
                                biz_method: 'updateCompanyNews',
                                biz_param: {
                                    id: _self.activityParam.id,
                                    type: _self.activityParam.type,
                                    imgUrl: _self.activityParam.imgUrl,
                                    title: _self.activityParam.title,
                                    intro: _self.activityParam.intro,
                                    linkUrl: _self.activityParam.linkUrl
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
                            _self.$emit("addMedia");

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