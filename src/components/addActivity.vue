<style>
.addActivity {
    min-height: 600px;
    margin: auto;
}

.addActivity .url_wrap {
    width: 120px;
    float: left;
}

.addActivity .input_wrap {
    padding-left: 120px;
}

.addActivity .input_wrap_l {
    padding-left: 240px;
}
</style>
<template>
    <div class="addActivity">
        <el-form ref="activityParam" :model="activityParam" :rules="rules" label-width="120px" v-loading.body="loading">
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="activityParam.name"></el-input>
            </el-form-item>
            <el-form-item label="app/h5活动图片">
                <imageUpload :imgUrl="activityParam.activityImg" :param='activityParam' v-on:postUrl="recieveUrl"></imageUpload>
            </el-form-item>
            <el-form-item label="app活动地址">
                <div class="url_wrap">
                    <el-select @change="selectAppType" v-model="activityParam.appType" placeholder="请选择">
                        <el-option label="http://" value="0">
                        </el-option>
                        <el-option label="apps://" value="1">
                        </el-option>
                    </el-select>
                </div>
                <div class="url_wrap">
                    <el-select @change="selecteAppUrl" class="appType" v-if="activityParam.appType === '1'" v-model="activityParam.appActivUrl" placeholder="请选择">
                        <el-option v-for="item in configUrl" :label="item.title" :value="item.index">
                        </el-option>
                    </el-select>
                </div>
                <div class="input_wrap" :class="{'input_wrap_l':activityParam.appType === '1'}">
                    <el-input :disabled="activityParam.appType === '1'" class="appUrl" v-model="activityParam.shareUrl"></el-input>
                </div>
            </el-form-item>
            <el-form-item label="H5活动地址">
                <el-input v-model="activityParam.htmlUrl" placeholder="请输入活动地址"></el-input>
            </el-form-item>
            <el-form-item label="是否压缩图片">
                <el-radio-group @change="zipRadioChange" v-model="zipRadio">
                    <el-radio :label="0">压缩图片</el-radio>
                    <el-radio :label="1">不压缩</el-radio>                   
                </el-radio-group>
            </el-form-item>
            <el-form-item label="web图片压缩" v-if="zipRadio === 0">
                <imageUpload :imgUrl="activityParam.webImg" :param='activityParam' v-on:postUrl="recieveUrlWebImg"></imageUpload>
            </el-form-item>
            <el-form-item label="web图片不压缩"  v-if="zipRadio === 1">
                <imageUploadNoZip :imgUrl="activityParam.webImg" :param='activityParam' v-on:postUrl="recieveUrlWebImg"></imageUploadNoZip>
            </el-form-item>
            <el-form-item label="web活动地址">
                <el-input v-model="activityParam.activityUrl" placeholder="请输入活动地址"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="beforeSubVil">立即创建</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
import imageUpload from './imageUpload.vue';
import imageUploadNoZip from './imageUploadNoZip.vue'
import common from '../common/common.js'
import httpService from '../common/httpService'
let configUrl = [{
    title: '求购列表',
    index: '0',
    android: 'com.yaocaimaimai.yaocaimaimai.mvp.emergencypurchase.EmergencyPurchaseActivity',
    ios: 'YCMM://push/YCMMDemandViewController'
}, {
    title: '资源列表',
    index: '1',
    android: 'com.yaocaimaimai.yaocaimaimai.mvp.lowresource.LowResourceActivity',
    ios: 'YCMM://push/YCMMSupplyViewController'
}, {
    title: '预购列表',
    index: '2',
    android: 'com.yaocaimaimai.yaocaimaimai.newmvp.viewimpl.PresellActivity',
    ios: 'YCMM://push/YCMMPreSaleViewController'
}]
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
                },
                configUrl: configUrl,
                sendType: -1,
                zipRadio: 1
            }
        },
        props: {
            activityParam: {
                default: null
            }
        },
        components: {
            imageUpload,
            imageUploadNoZip
        },
        methods: {
            //app 图片
            recieveUrl(val) {
                this.activityParam.activityImg = val.url;
            },
            //web图片
            recieveUrlWebImg(val) {
                this.activityParam.webImg = val.url;
            },
            selecteAppUrl(val) {
                if (val === '0') {
                    this.activityParam.shareUrl = 'apps://ycmm?android' + configUrl[0].android + '&ios=' + configUrl[0].ios
                } else if (val === '1') {
                    this.activityParam.shareUrl = 'apps://ycmm?android' + configUrl[1].android + '&ios=' + configUrl[1].ios
                } else if (val === '2') {
                    this.activityParam.shareUrl = 'apps://ycmm?android' + configUrl[2].android + '&ios=' + configUrl[2].ios
                }
            },
            selectAppType(val) {
                this.activityParam.shareUrl = '';
                if (val === '1') {
                    this.activityParam.appActivUrl = '0';
                    this.activityParam.shareUrl = 'apps://ycmm?android' + configUrl[0].android + '&ios=' + configUrl[0].ios
                }
            },
            zipRadioChange(){
                this.activityParam.webImg = '';
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
                                title: _self.activityParam.title,
                                activityImg: _self.activityParam.activityImg, //app h5图片地址
                                webImg: _self.activityParam.webImg, //web图片地址
                                shareUrl: _self.activityParam.shareUrl, //app活动地址
                                activityUrl: _self.activityParam.activityUrl, //web活动地址
                                htmlUrl: _self.activityParam.htmlUrl, //h5活动地址                            
                                type: _self.activityParam.sendType,
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
                                    activityImg: _self.activityParam.activityImg, //app h5图片地址
                                    webImg: _self.activityParam.webImg, //web图片地址
                                    shareUrl: _self.activityParam.shareUrl, //app活动地址
                                    activityUrl: _self.activityParam.activityUrl, //web活动地址
                                    htmlUrl: _self.activityParam.htmlUrl, //h5活动地址                            
                                    type: _self.activityParam.sendType,
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
            },
            beforeSubVil() {
                //最少上传一种图片
                if (!this.activityParam.webImg && !this.activityParam.activityImg) {
                    this.$message({
                        type: 'info',
                        message: '请上传web活动图片或app/h5活动图片，或两者'
                    });
                    return;
                };
                if (this.activityParam.shareUrl || this.activityParam.activityUrl || this.activityParam.htmlUrl) {
                    this.activityParam.sendType = 0;
                };
                if (this.activityParam.shareUrl) {
                    this.activityParam.sendType += 1;
                };
                if (this.activityParam.activityUrl) {
                    this.activityParam.sendType += 2;
                };
                if (this.activityParam.htmlUrl) {
                    this.activityParam.sendType += 4;
                };
                this.submitForm('activityParam');
            }
        },
        mounted() {

        }
}
</script>
