<style scoped>
.news_content{
    background-color: #fff;
    padding: 20px;
}
</style>
<template>
    <div :v-loading.body="loading" class="news_content">
        <el-form :model="pushParam" :rules="rules" ref="pushParam" label-width="100px" class="demo-ruleForm">
            <el-form-item label="推送类型">
                <el-radio-group v-model="pushParam.type">
                    <el-radio :label="item.value" v-for="item in type "></el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="资源名称" v-if="pushParam.type=='资源'" prop="resourceName">
                <el-input v-model="pushParam.resourceName" :disabled="disabled" style="width:300px;margin-right:10px"></el-input>
                <el-button type="primary" @click="selectSource()">选择</el-button>
            </el-form-item>
            <el-form-item label="活动url" v-if="pushParam.type=='活动'" prop="url">
                <el-input v-model="pushParam.url"></el-input>
            </el-form-item>
            <el-form-item label="订单号" v-if="pushParam.type=='订单'" prop="orderNumber">
                <el-input v-model="pushParam.orderNumber" :disabled="disabled" style="width:300px;margin-right:10px"></el-input>
                <el-button type="primary" @click="selectSource()">选择</el-button>
            </el-form-item>
            <el-form-item label="推送提示" prop="alert">
                <el-input v-model="pushParam.alert"></el-input>
            </el-form-item>
            <el-form-item label="推送标题" prop="title">
                <el-input v-model="pushParam.title"></el-input>
            </el-form-item>
            <el-form-item label="推送内容" prop="message">
                <el-input v-model="pushParam.message"></el-input>
            </el-form-item>
            <el-form-item label="接收用户列表" >
                <el-table :data="pushParam.userArr" border style="width:342px;float:left;" v-if="pushParam.userArr.length!=0">
                    <el-table-column prop="index" label="序号" width="120">
                    </el-table-column>
                    <el-table-column prop="name" label="姓名" width="120">
                    </el-table-column>
                    <el-table-column label="操作" width="100">
                        <template scope="scope">
                            <el-button @click.native.prevent="del(scope.$index)" type="text" size="small">删除</el-button>
                        </template>
                    </el-table-column>
                </el-table>
                <el-input value="全部用户" :disabled="disabled" style="float:left;margin-right:10px;width:300px;"></el-input>
                <el-button type="primary" @click="dialogShow.dialogUser=true" style="float:left;margin-left:10px;">选择用户</el-button>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="submitForm('pushParam')">立即创建</el-button>
                <el-button @click="resetForm('pushParam')">重置</el-button>
            </el-form-item>
        </el-form>
         <el-dialog title="添加用户" v-model="dialogShow.dialogUser">
            <addUser></addUser>
        </el-dialog>
         <el-dialog title="选择订单" v-model="dialogShow.dialogOrder">
            <selectOrder></selectOrder>
        </el-dialog>
         <el-dialog title="选择资源" v-model="dialogShow.dialogResource">
            <selectSource></selectSource>
        </el-dialog>
    </div>
</template>
<script>
import addUser from '../../components/news/addUser.vue';
import selectOrder from '../../components/news/selectOrder.vue';
import selectSource from '../../components/news/selectSource.vue';
export default {
    data() {
            var checkArrLength = (rule, value, callback) => {
                if (value.length == 0) {
                    return callback(new Error('请选择推送用户'));
                }
                callback();
            };
            return {
                disabled: true,
                loading: true,
                dialogShow: {
                    dialogResource: false,
                    dialogOrder: false,
                    dialogUser: false
                },
                type: [{
                    key: 1,
                    value: '资源'
                }, {
                    key: 2,
                    value: '活动'
                }, {
                    key: 3,
                    value: '订单'
                }],
                pushParam: {
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
                        url: ''
                    },
                    type: '资源',
                    userArr: []
                },
                rules: {
                    alert: [{
                        required: true,
                        message: '请输入推送提示',
                        trigger: 'blur'
                    }],
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
                        message: '请输入活动的url',
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
            selectOrder,
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
            checkout(param) {},
            submitForm(formName) {
                this.$refs[formName].validate((valid) => {
                    if (valid) {

                    } else {
                        return false;
                    }
                });
            },
            resetForm(formName) {
                this.$refs[formName].resetFields();
            }
        }
}
</script>
