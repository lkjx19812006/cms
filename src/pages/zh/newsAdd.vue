<style scoped>
.news_content {
    background-color: #fff;
    padding: 20px;


}
</style>
<template>
    <div>
        <div class="news_content">
            <el-form :model="pushParam" :rules="rules" ref="pushParam" label-width="100px" class="demo-ruleForm" v-loading.body="loading">
                <el-form-item label="推送类型">
                    <el-radio-group v-model="pushParam.type">
                        <el-radio :label="item.value" v-for="item in type "></el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="资源名称" v-if="pushParam.type=='资源'" prop="resourceName">

                    <el-input v-model="pushParam.resourceName" :disabled="disabled" style="float: left; width:300px;margin-right:10px"></el-input>

                    <!-- 添加写入数据库字段 name -->
                    <el-input v-show="false"  v-model="pushParam.extras.name" :disabled="disabled" style="float: left;width:300px;margin-right:10px"></el-input>

                    <el-button style="float: left" type="primary" @click="dialogShow.dialogUser=false,dialogShow.dialogResource=true,dialogShow.dialog=true,title='选择资源'">选择</el-button>
                </el-form-item>
                <el-form-item label="活动url" v-if="pushParam.type=='活动'"  prop="url">
                    <el-input v-model="pushParam.url"></el-input>
                </el-form-item>
                <el-form-item label="订单号" v-if="pushParam.type=='订单'" prop="orderNumber">
                    <el-input v-model="pushParam.orderNumber" :disabled="disabled" style="width:300px;margin-right:10px"></el-input>
                    <el-button type="primary" @click="dialogShow.dialogOrder=true">选择</el-button>
                </el-form-item>
                <!--删除推送提示 让推送提示内容与推送标题一致即可 -->               
                <!-- <el-form-item  label="推送提示" prop="alert">
                    <el-input  v-model="pushParam.alert"></el-input>
                </el-form-item> --> 
                <el-form-item label="推送标题" prop="title">
                    <el-input v-model="pushParam.title"></el-input>
                </el-form-item>  

                <el-form-item label="推送内容" prop="message">
                    <el-input v-model="pushParam.message"></el-input>
                </el-form-item>
                <el-form-item label="接收用户列表"> 
                    <!-- 修改表格最大高度 让其实现滚动 -->
                    <el-table class="table_wrap" :data="pushParam.userArr" border 
                    style="width:600px;float:left" max-height="400" 
                    v-show="pushParam.userArr.length!=0">
                        <el-table-column prop="fullname" label="名称" width="150">
                        </el-table-column>
                        <el-table-column prop="phone" label="手机号" width="150">
                        </el-table-column>
                        <el-table-column prop="gender" label="性别" width="120">
                        </el-table-column>
                        <el-table-column prop="grade" label="会员等级" width="120">
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="100">
                            <template scope="scope">
                                <el-button @click.native.prevent="del(scope.$index)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <el-input value="全部用户" :disabled="disabled" style="float:left;margin-right:10px;width:300px;" v-show="pushParam.userArr.length==0"></el-input>
                    <el-button type="primary" @click="dialogShow.dialogResource=false,dialogShow.dialogUser=true,dialogShow.dialog=true,title='添加用户'" style="float:left;margin-left:10px;">选择用户</el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitForm('pushParam')">立即发送</el-button>
                    <el-button @click="resetForm('pushParam')">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>       
            <el-dialog :title="title" v-model="dialogShow.dialog">
                <addUser v-on:message="recieveUser" v-on:brakSend="dialogHide" v-if="dialogShow.dialogUser">
                    
                </addUser>
                <selectSource v-on:resource="recieveResource" v-if="dialogShow.dialogResource">                    
                </selectSource>
            </el-dialog>
            <!-- <el-dialog title="选择资源" v-model="dialogShow.dialogResource">
                <selectSource v-on:resource="recieveResource"></selectSource>
            </el-dialog> -->
        </div>
    </div>
</template>
<script>
import addUser from '../../components/news/addUser.vue';
import selectSource from '../../components/news/selectSource.vue';
import common from '../../common/common.js'
export default {
    data() {
            var checkArrLength = (rule, value, callback) => {
                if (value.length == 0) {
                    return callback(new Error('请选择推送用户'));
                }
                callback();
            };
            return {
                title:'添加用户',             
                disabled: true,
                loading: false,
                dialogShow: {
                    dialog:false,
                    dialogResource: false,
                    dialogUser: false
                },
                type: [{
                    key: '1',
                    value: '资源'
                }, {
                    key: '2',
                    value: '活动'
                }],
                pushParam: {
                    breedType:'',
                    resourceName: '',
                    orderNumber: '',
                    url: '',
                    alias: '',
                    tag: '',
                    alert: '',
                    title: '',
                    message: '',
                    extras: {
                        type: 1,
                        id: '',
                        name:'',
                        url: ''
                    },
                    type: '资源',
                    userArr: []
                },
                rules: {
                    // alert: [{
                    //     required: true,
                    //     message: '请输入推送提示',
                    //     trigger: 'blur'
                    // }],
                    title: [{
                        required: true,
                        message: '请输入推送标题',
                        trigger: 'change'
                    }],
                    message: [{
                        required: true,
                        message: '请输入推送内容',
                        trigger: 'change'
                    }],
                    url: [{
                        required: true,
                        message: '请输入活动正确的url',
                        type: 'url',
                        trigger: 'change'
                    }],
                    resourceName: [{
                        required: true,
                        message: '请选择一个资源',
                        trigger: 'change'
                    }],
                    orderNumber: [{
                        required: true,
                        message: '请选择一个订单',
                        trigger: 'change'
                    }]
                }
            }
        },
        components: {
            addUser,
            selectSource
        },
        computed: {
            products() {
                return this.$store.state.products.all
            },
            langConfig() {
                return require('../../i18n/' + this.$route.meta.lang + '.i18n.json')
            }
        },
        methods: {
            recieveResource: function(val) {
                if(val){                    
                    this.pushParam.breedType=val.type;                
                    this.pushParam.extras.id = val.id;
                    this.pushParam.extras.name = val.breedName;//新增Name字段
                    this.pushParam.resourceName = val.breedName + '---' + val.location + '---' + val.price;
                }
                this.dialogShow.dialog = false;
            },
            // dialogHide 点击实现隐藏 模态框
            dialogHide: function(obj){
                this.dialogShow.dialog = obj.dialog;
                this.dialogShow.dialogResource = obj.dialogResource;
                this.dialogShow.dialogUser = obj.dialogUser;                
            },
            recieveUser: function(arr) { 
                for (let n = 0; n < arr.length; n++) {
                    let m = 1;
                    for (let i = 0; i < this.pushParam.userArr.length; i++) {
                        if (arr[n].id == this.pushParam.userArr[i].id) {
                            m = 0;
                        }
                    }
                    if (m) {
                        this.pushParam.userArr.push(arr[n]);
                    }
                }

            },
            del(index) {
                this.pushParam.userArr.splice(index, 1);
            },
            submitForm(formName) {
                let _self = this;
                this.$refs[formName].validate((valid) => {
                    if (valid) {
                        _self.loading = true;
                        let type = '';
                        let id = '';
                        let breedname ='';
                        let activityUrl = '';
                        let alias = '';
                        _self.type.forEach(function(item) {
                            if (item.value == _self.pushParam.type) {
                                type = item.key;
                            }
                        })
                        for (let i = 0; i < _self.pushParam.userArr.length; i++) {
                            alias += _self.pushParam.userArr[i].id + ',';
                        }
                        console.log(type);                       
                        switch (type) {
                            // 新增判断类型为资源 物品名称为name
                            case '1':
                                breedname =  _self.pushParam.extras.name; 
                                break                                                             
                            case '2':
                                activityUrl = _self.pushParam.url;  
                                break                                                            
                            default:                               
                                break;
                        }
                        id = _self.pushParam.extras.id;
                        let url = common.urlCommon + common.apiUrl.most;
                        let body = {
                            biz_module: 'pushService',
                            biz_method: 'pushAllAlertMessageExtras',
                            biz_param: {
                                alias: alias,
                                alert: _self.pushParam.title,//修改提示信息
                                title: _self.pushParam.title,
                                message: _self.pushParam.message,
                                extras: {
                                    type: type,
                                    id: id,
                                    url: activityUrl,
                                    name: breedname,//新增name属性
                                    breedType:_self.pushParam.breedType.toString()
                                },
                                type: parseInt(type)
                            }
                        }

                        if (common.KEY) {
                            url = common.addSID(url);
                            body.version = 1;
                            body.time = Date.parse(new Date()) + parseInt(common.difTime);
                            body.sign = common.getSign('biz_module=' + body.biz_module + '&biz_method=' + body.biz_method + '&time=' + body.time);
                        }
                        let obj = {
                            body: body,
                            path: url
                        }
                        _self.$store.dispatch('pushNews', obj).then(() => {
                            _self.loading = false
                            _self.$message({
                                type: 'info',
                                message: '发送成功'
                            });

                        }, () => {
                            _self.loading = false
                        });

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.pushParam.userArr = [];
                this.$refs[formName].resetFields();
            }
        }
}
</script>
