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
            <el-form-item label="活动类型">
                <el-checkbox-group v-model="activityParam.checkList" @change="changeCheckList">
                    <el-checkbox :label="1">app活动</el-checkbox>
                    <el-checkbox :label="4">h5活动</el-checkbox>
                    <el-checkbox :label="2">web活动</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="activityParam.name"></el-input>
            </el-form-item>
            <div v-if="activityParam.sendType === 1 || activityParam.sendType === 3 || activityParam.sendType === 5 || activityParam.sendType === 7">
                <el-form-item label="app活动图片">
                    <imageUpload :imgUrl="activityParam.activityImg" :param='activityParam'
                                 v-on:postUrl="recieveUrl"></imageUpload>
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
                        <el-select @change="selecteAppUrl" class="appType" v-if="activityParam.appType === '1'"
                                   v-model="activityParam.appActivUrl" placeholder="请选择">
                            <el-option v-for="item in configUrl" :label="item.title" :value="item.index">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="input_wrap" :class="{'input_wrap_l':activityParam.appType === '1'}">
                        <el-input :disabled="activityParam.appType === '1'" class="appUrl"
                                  v-model="activityParam.shareUrl"></el-input>
                    </div>
                </el-form-item>
            </div>
            <div :span="24"
                 v-if="activityParam.sendType === 4 || activityParam.sendType === 5 || activityParam.sendType === 6 || activityParam.sendType === 7">
                <el-form-item label="H5活动图片">
                    <imageUpload :imgUrl="activityParam.htmlImg" :param='activityParam'
                                 v-on:postUrl="recieveUrlH5Img"></imageUpload>
                </el-form-item>
                <el-form-item label="H5活动地址">
                    <el-input v-model="activityParam.htmlUrl" placeholder="请输入活动地址"></el-input>
                </el-form-item>
            </div>
            <div :span="24"
                 v-if="activityParam.sendType === 2 || activityParam.sendType === 3 || activityParam.sendType === 6 || activityParam.sendType === 7">
                <el-form-item label="是否压缩图片">
                    <el-radio-group @change="zipRadioChange" v-model="zipRadio">
                        <el-radio :label="0">压缩图片</el-radio>
                        <el-radio :label="1">不压缩</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="web图片压缩" v-if="zipRadio === 0">
                    <imageUpload :imgUrl="activityParam.webImg" :param='activityParam'
                                 v-on:postUrl="recieveUrlWebImg"></imageUpload>
                    <div class="model">
                    </div>
                </el-form-item>
                <el-form-item label="web图片不压缩" v-if="zipRadio === 1">
                    <imageUploadNoZip :imgUrl="activityParam.webImg" :param='activityParam'
                                      v-on:postUrl="recieveUrlWebImg"></imageUploadNoZip>
                </el-form-item>
                <el-form-item label="web活动地址">
                    <el-input v-model="activityParam.activityUrl" placeholder="请输入活动地址"></el-input>
                </el-form-item>
            </div>
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
        ios: 'YCMM://push/YCMMDemandHomeViewController'
    }, {
        title: '资源列表',
        index: '1',
        android: 'com.yaocaimaimai.yaocaimaimai.mvp.lowresource.LowResourceActivity',
        ios: 'YCMM://push/YCMMSupplyHomeViewController'
    }, {
        title: '预购列表',
        index: '2',
        android: 'com.yaocaimaimai.yaocaimaimai.newmvp.viewimpl.PresellActivity',
        ios: 'YCMM://push/YCMMPreSaleViewController'
    }, {
        title: '资源发布页',
        index: '3',
        android: 'com.yaocaimaimai.yaocaimaimai.mvp.main.resource.resourcepublish.ResourcePublishActivity',
        ios: 'YCMMPublishSupplyViewController',
    }, {
        title: '求购发布页',
        index: '4',
        android: 'com.yaocaimaimai.yaocaimaimai.mvp.main.purchase.purchasepublish.PurchasePublishActivity',
        ios: 'YCMMPublishDemandViewController'
    }];

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
                zipRadio: 1,
                sendObj: {
                    id: '', //活动Id
                    name: '', //活动名
                    activityImg: '', //app h5图片地址
                    webImg: '', //web图片地址
                    shareUrl: '', //app活动地址
                    activityUrl: '', //web活动地址
                    htmlUrl: '', //h5活动地址  
                    htmlImg: '',
                    type: -1,
                },
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
            //H5活动图片
            recieveUrlH5Img(val) {
                this.activityParam.htmlImg = val.url;
            },
            changeCheckList(e) {
                let num = 0
                if (e.length === 0) {
                    num = -1;
                } else {
                    for (var i = 0; i < e.length; i++) {
                        num += e[i];
                    }
                }
                this.activityParam.sendType = num;
            },
            selecteAppUrl(val) {
                this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[0].android + '&ios=' + configUrl[0].ios
                if (val === '0') {
                } else if (val === '1') {
                    this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[1].android + '&ios=' + configUrl[1].ios
                } else if (val === '2') {
                    this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[2].android + '&ios=' + configUrl[2].ios
                } else if (val === '3') {
                    this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[3].android + '&ios=' + configUrl[3].ios
                } else if (val === '4') {
                    this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[4].android + '&ios=' + configUrl[4].ios
                }
            },
            selectAppType(val) {
                this.activityParam.shareUrl = '';
                if (val === '1') {
                    this.activityParam.appActivUrl = '0';
                    this.activityParam.shareUrl = 'apps://ycmm?android=' + configUrl[0].android + '&ios=' + configUrl[0].ios
                }
            },
            zipRadioChange() {
                this.activityParam.webImg = '';
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    this.getCheckInfo()
                    if (valid) {
                        _self.loading = true;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'activityService',
                            biz_method: 'addActivityInfo',
                            biz_param: this.sendObj
                        }
                        if (this.activityParam.id) {
                            this.sendObj.id = this.activityParam.id;
                            body = {
                                biz_module: 'activityService',
                                biz_method: 'updateActivityInfo',
                                biz_param: this.sendObj
                            }
                        }
                        if (common.KEY) {
                            url = common.addSID(url);
                            body.version = 1;
                            body.time = Date.parse(new Date()) + parseInt(common.difTime);
                            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                        }
                        httpService.commonPost(url, body, function (res) {
                            _self.loading = false;
                            _self.$message({
                                type: 'info',
                                message: '操作成功'
                            });
                            _self.$emit("addActivity");

                        }, function (err) {
                            _self.loading = false;
                        })
                    } else {
                        return false;
                    }
                });
            },
            beforeSubVil() {
                if (this.activityParam.sendType <= 0) {
                    this.$message({
                        type: 'info',
                        message: '请至少选择一种活动类型，并上传该活动的图片'
                    });
                    return;
                }
                if (!this.activityParam.activityImg && !this.activityParam.webImg && !this.activityParam.htmlImg) {
                    this.$message({
                        type: 'info',
                        message: '请至少上传一种活动类型的图片'
                    });
                    return;
                }
                //最少上传一种图片                     
                this.submitForm('activityParam');
            },
            getCheckInfo() {
                let num = 0
                let e = this.activityParam.checkList;
                if (e.length === 0) {
                    num = -1;
                } else {
                    for (var i = 0; i < e.length; i++) {
                        num += e[i];
                    }
                }
                ;
                this.activityParam.sendType = num;
                if (this.activityParam.sendType === 1 || this.activityParam.sendType === 3 || this.activityParam.sendType === 5 || this.activityParam.sendType === 7) {
                    this.sendObj.name = this.activityParam.name;
                    this.sendObj.activityImg = this.activityParam.activityImg;
                    this.sendObj.shareUrl = this.activityParam.shareUrl;
                    this.sendObj.type = this.activityParam.sendType;
                }
                ;
                if (this.activityParam.sendType === 2 || this.activityParam.sendType === 3 || this.activityParam.sendType === 6 || this.activityParam.sendType === 7) {
                    this.sendObj.name = this.activityParam.name;
                    this.sendObj.webImg = this.activityParam.webImg;
                    this.sendObj.activityUrl = this.activityParam.activityUrl;
                    this.sendObj.type = this.activityParam.sendType;
                }
                ;
                if (this.activityParam.sendType === 4 || this.activityParam.sendType === 5 || this.activityParam.sendType === 6 || this.activityParam.sendType === 7) {
                    this.sendObj.name = this.activityParam.name;
                    this.sendObj.htmlImg = this.activityParam.htmlImg;
                    this.sendObj.htmlUrl = this.activityParam.htmlUrl;
                    this.sendObj.type = this.activityParam.sendType;
                }

            }
        }
    }
</script>
