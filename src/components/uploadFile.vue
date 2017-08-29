<style scoped>
.img_upload {
    position: relative;
}

.img_upload .input_image {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}

.img_upload .image_show {
    width: 100%;
    height: 100%;
}

.img_upload .close_image {
    position: absolute;
    top: -5px;
    right: -5px;
    max-width: 10px;
}
</style>
<template>
    <div class="img_upload">
        <form>
            <input ref="input" type="file" @change="previewImg" class="input_image" name="photo">
            <span style="margin-right:10px">{{fileName}}</span>
            <el-button slot="trigger" size="small" :loading="isBtnLoading" type="primary">选取文件</el-button>
        </form>
    </div>
</template>
<script>
import common from '../common/common.js'
import httpService from '../common/httpService.js'
export default {
    data() {
            return {
                loading: false,
                fileList: [],
                fileName: '',//文件名
                suffix: '', //後綴名
                size: '',
                isBtnLoading: false
            }
        },
        props: {
            param: {
                default: null
            }
        },
        methods: {
            previewImg(e) {
                let _self = this;
                if (!this.param.version) {
                    this.$refs.input.value = '';
                    return _self.$message({
                        type: 'error',
                        message: '先填写版本号,再选择文件'
                    });
                }
                let input = e.target;
                if (input.files && input.files[0]) {
                    let reader = new FileReader();
                    _self.size = input.files[0].size;
                    // input.files[0].name='ycmm.'+_self.param.version.apk;
                    _self.fileName = input.files[0].name;
                    //拿到后缀
                    _self.suffix = _self.fileName.split('.')[_self.fileName.split('.').length - 1];
                    _self.upload(input.files[0]);
                }
            },
            upload: function(file) {
                this.loading = true;
                let _self = this;
                let url = common.addSID(common.urlCommon + common.apiUrl.most);
                var bucketName = _self.param.type === 1? 'android' : 'erpapp';
                let body = {
                    biz_module: 'filesService',
                    biz_method: 'getQiNiuToken',
                    version: 1,
                    time: 0,
                    sign: '',
                    biz_param: {
                        bucketName: bucketName
                    }
                };
                body.time = Date.parse(new Date()) + parseInt(common.difTime);
                body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                httpService.commonPost(url, body, function(res) {
                    _self.isBtnLoading = true;
                    if (res.code == '1c01') {
                        var timestamp = new Date().getTime();
                        var pic = file;
                        var url = 'http://upload.qiniu.com';
                        var xhr = new XMLHttpRequest();
                        var formData = new FormData();
                        formData.append('token', res.biz_result.token);
                        formData.append('file', file);
                        //判断是android端 还是移动erp端 配置不同的文件名称 拼接後綴是為了 解決升級包文集的問題
                        if(_self.param.type === 1){
                            formData.append('key', 'ycmm.' + _self.param.version + '.' + _self.suffix);
                        }else if(_self.param.type === 2){
                            formData.append('key', 'ERP.' + _self.param.version + '.' + _self.suffix);
                        }
                        xhr.onreadystatechange = function() {
                            _self.loading = false;
                            if (xhr.readyState == 4) {
                                if (xhr.status == 614) {
                                    _self.isBtnLoading = false;
                                    _self.$message({
                                        type: 'error',
                                        message: '上传的版本,不能低于目前版本, 刷新重试'
                                    });

                                } else {
                                    let response = JSON.parse(xhr.response);
                                    if (response.key) {
                                        _self.key = response.key;
                                        _self.$emit("postUrl", {
                                            url: res.biz_result.url + '/' + _self.key
                                        });
                                        _self.isBtnLoading = false;
                                    } else {
                                        _self.loading = false;

                                    }
                                }

                            }

                        }
                        xhr.open("POST", url, true);
                        xhr.send(formData);
                    } else {
                        _self.isBtnLoading = false;
                        _self.loading = false;
                        _self.$message({
                            type: 'info',
                            message: '获取token失败'
                        });

                    }
                }, function(err) {
                    _self.loading = false;

                })
            }
        }
}
</script>
<style scoped>
.img_upload {
    position: relative;
}

.img_upload .input_image {
    opacity: 0;
    width: 100%;
    height: 100%;
    position: absolute;
}

.img_upload .image_show {
    width: 100%;
    height: 100%;
}

.img_upload .close_image {
    position: absolute;
    top: -5px;
    right: -5px;
    max-width: 10px;
}
</style>
