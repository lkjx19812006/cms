<style>
.duryEC {
    min-height: 600px;
    margin: auto;
}

.duryEC .url_wrap {
    width: 200px;
    float: left;
}

.duryEC .input_wrap {
    padding-left: 200px;
}
</style>
<template>
    <div class="duryEC">
        <el-form ref="httpParam" :model="httpParam" :rules="rules" label-width="120px" v-loading.body="loading">
            <el-form-item label="活动类型">
                <el-checkbox-group v-model="httpParam.checkList" @change="changeCheckList">
                    <el-checkbox :label="1">app活动</el-checkbox>
                    <el-checkbox :label="2">h5活动</el-checkbox>
                </el-checkbox-group>
            </el-form-item>
            <el-form-item label="活动名称" prop="name">
                <el-input v-model="httpParam.name"></el-input>
            </el-form-item>
            <div v-if="httpParam.sendType === 1 || httpParam.sendType === 3">
                <el-form-item label="app活动图片">
                    <imageUpload :imgUrl="httpParam.appImg" :param='httpParam' v-on:postUrl="recieveUrl"></imageUpload>
                </el-form-item>
                <!-- <el-form-item label="活动跳转">
                    <el-radio-group v-model="radio2">
                        <el-radio :label="3">备选项</el-radio>
                        <el-radio :label="6">备选项</el-radio>
                        <el-radio :label="9">备选项</el-radio>
                    </el-radio-group>
                </el-form-item> -->
                <el-form-item label="app活动地址">
                    <div class="url_wrap">
                        <el-input @change="getAppUrl" v-model="httpParam.breedName" placeholder="请输入药材名">
                            <template slot="prepend">
                                <span>apps://</span>
                            </template>
                        </el-input>
                    </div>
                    <div class="input_wrap">
                        <el-input disabled class="appUrl" v-model="httpParam.appUrl"></el-input>
                    </div>
                </el-form-item>
            </div>
            <div v-if="httpParam.sendType === 2 || httpParam.sendType === 3">
                <el-form-item label="H5活动图片">
                    <imageUpload :imgUrl="httpParam.htmlImg" :param='httpParam' v-on:postUrl="recieveUrlH5Img"></imageUpload>
                </el-form-item>
                <el-form-item label="H5活动地址">
                    <el-input v-model="httpParam.htmlUrl" placeholder="请输入活动地址"></el-input>
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
    android: 'com.yaocaimaimai.yaocaimaimai.newmvp.viewimpl.MedicineActivity?breedName=',
    ios: 'YCMM://push/YCMMHerbsHotInfoViewController?breedName='
}]
export default {
    data() {
            let _self = this;
            return {
                breedName: '',
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
                    id: '',
                    name: '',
                    appUrl: '',
                    appImg: '',
                    htmlUrl: '',
                    htmlImg: '',
                    type: -1,
                },
            }
        },
        props: {
            httpParam: {
                default: null
            }
        },
        components: {
            imageUpload,
            imageUploadNoZip,
        },
        methods: {
            //app 图片
            recieveUrl(val) {
                this.httpParam.appImg = val.url;
            },
            //H5活动图片
            recieveUrlH5Img(val) {
                this.httpParam.htmlImg = val.url;
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
                this.httpParam.sendType = num;
            },
            getAppUrl() {
                this.httpParam.appUrl = 'apps://ycmm?android=' + configUrl[0].android + this.httpParam.breedName + '&ios=' + configUrl[0].ios + this.httpParam.breedName
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    this.getCheckInfo()
                    if (valid) {
                        _self.loading = true;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'herbBannerService',
                            biz_method: 'addHerbBannerInfo',
                            biz_param: this.sendObj
                        }
                        if (this.httpParam.id) {
                            this.sendObj.id = this.httpParam.id;
                            body = {
                                biz_module: 'herbBannerService',
                                biz_method: 'updateHerBannerInfo',
                                biz_param: this.sendObj
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
                if (this.httpParam.sendType <= 0) {
                    this.$message({
                        type: 'info',
                        message: '请至少选择一种活动类型，并上传该活动的图片'
                    });
                    return;
                }
                if (!this.httpParam.appImg && !this.httpParam.htmlImg) {
                    this.$message({
                        type: 'info',
                        message: '请至少上传一种活动类型的图片'
                    });
                    return;
                }
                //最少上传一种图片                     
                this.submitForm('httpParam');
            },
            getCheckInfo() {
                let num = 0
                let e = this.httpParam.checkList;
                if (e.length === 0) {
                    num = -1;
                } else {
                    for (var i = 0; i < e.length; i++) {
                        num += e[i];
                    }
                };
                this.httpParam.sendType = num;
                if (this.httpParam.sendType === 1 || this.httpParam.sendType === 3) {
                    this.sendObj.name = this.httpParam.name;
                    this.sendObj.appImg = this.httpParam.appImg;
                    this.sendObj.appUrl = this.httpParam.appUrl;
                    this.sendObj.type = this.httpParam.sendType;
                };
                if (this.httpParam.sendType === 2 || this.httpParam.sendType === 3) {
                    this.sendObj.name = this.httpParam.name;
                    this.sendObj.htmlImg = this.httpParam.htmlImg;
                    this.sendObj.htmlUrl = this.httpParam.htmlUrl;
                    this.sendObj.type = this.httpParam.sendType;
                }
            }
        }
}
</script>
