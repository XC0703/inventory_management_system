<template>
<div class="mainContainer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="cardContainer">
        <!-- 按钮区域 -->
        <el-row :gutter="20">
                <el-col :span="7">
                    <!-- 搜索、导出、添加区域 -->
                    <el-input placeholder="请输入用户id（默认筛选全部）" style="position:relative" clearable @clear="showUser" v-model="query">
                        <template #append>
                            <el-button type="primary" class="iconfont icon-sousuo" @click="showUser"></el-button>
                        </template>
                    </el-input>
                </el-col>
                <el-col :span="3.5">
                    <el-button type="primary"  @click="handleEdit()">
                        <el-icon class="iconfont icon-tianjiayonghu"></el-icon>
                        <span>添加用户</span>
                    </el-button>
                </el-col>
                <el-col :span="3.5">
                    <el-button type="primary" @click="handleExport(userList)">
                        <el-icon class="iconfont icon-daochubiaoge"></el-icon>
                        <span>导出表格</span>
                    </el-button>
                </el-col>
                <el-col :span="3.5">
                    <el-button type="danger" @click="batchDelete(sels,showUser)">
                        <el-icon class="iconfont icon-shanchupiliangshanchu"></el-icon>
                        <span>批量删除</span>
                    </el-button>
                </el-col>
        </el-row>
        <!-- 用户列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="userList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
                <el-table-column align="center" type="selection" width="60"></el-table-column>
                <el-table-column align="center" label="用户id" prop="userId" :show-overflow-tooltip='true' min-width="70"></el-table-column>
                <el-table-column align="center" label="用户名称" prop="userName" :show-overflow-tooltip='true' min-width="110"></el-table-column>
                <el-table-column align="center" label="用户密码" prop="userPassword" :show-overflow-tooltip='true' min-width="110"></el-table-column>
                <el-table-column align="center" label="用户权限" prop="userPower" :show-overflow-tooltip='true' filter-multiple min-width="100" sortable="custom"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
                <el-table-column align="center" label="更新时间" prop="updateTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
                <el-table-column align="center" label="操作" min-width="140">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row,showUser)">删除</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
        <!-- 编辑/增加界面 -->
        <el-dialog :title="title" v-model="editFormVisible" width="30%" :before-close="closeDialog">
                <el-form label-width="1.2rem" :model="editForm" :rules="rules" ref="editForm">
                    <el-form-item label="用户名称" prop="userName">
                    <el-input size="small" v-model="editForm.userName" auto-complete="off" placeholder="请输入用户名称"></el-input>
                    </el-form-item>
                    <el-form-item label="用户密码" prop="userPassword">
                    <el-input size="small" v-model="editForm.userPassword" auto-complete="off" placeholder="请输入用户密码"></el-input>
                    </el-form-item>
                    <el-form-item label="用户权限" prop="userPower">
                    <el-input size="small" v-model.number="editForm.userPower" auto-complete="off" placeholder="请输入用户权限(最高为999)"></el-input>
                    </el-form-item>
                </el-form>
                <div slot:footer class="dialog-footer" style="padding-left:0.8rem">
                    <el-button style="margin-right:0.6rem;" size="small" @click="closeDialog">取消</el-button>
                    <el-button size="small" type="primary" :loading="loading" class="title"  @click="submitForm(editForm,showUser,title);closeDialog()">保存</el-button>
                </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script>
import tableSortChange from '../../utils/tableSortChange'
import {formatDate} from '../../utils/timeEffect'
import {get} from '../../utils/request';
import PaginateView from '../../components/PaginateView'
import {singleDelete,batchDelete,submitForm,handleExport} from './userEffect'
import simulateDataList from '@/assets/simulateData/dataUser.json'
export default {
    name:'MiserUser',
    components:{PaginateView},
    data () {
        return {
            //是否显示加载
            loading: false, 
            // 分页的中间变量
            formInline: {
                page: 1,
                limit: 10,
            },
            // 查询参数
            query:'',
            // 分页参数
            pageparm: {
                currentPage: 1,
                pageSize: 10,
                total: 0
            },
            // 排序时的列数类型参数
            column:'',
            // 页面此时需要展示的用户列表
            userList: [],
            // 编辑/增加操作需要的参数
            title: '添加',
            editFormVisible: false, //控制编辑/增加页面显示与隐藏
            editForm: { 
                userId:'',
                userName:'',
                userPassword:'',
                userPower:'',
                createTime:''
            },
            // 编辑/增加操作时的rules表单验证
            rules: {
                userName:[{ required: true, message: '请输入用户名称', trigger: 'blur' }],
                userPassword:[{ required: true, message: '请输入用户密码', trigger: 'blur' }],
                userPower: [{ required: true, message: '请输入用户权限', trigger: 'blur' },{ type:'number',message:'必须是数字',trigger: 'blur' }]
            },
            //选中的值显示--用于批量删除
            sels: []
        }
    },
    created () {
        // this.getUserList()
        this.showUser()
    },
    methods: {
        // 模拟的全部用户列表
        async getUserList () {
            // 模拟获取全部数据
            // 模拟数据--实际上通过接口获取
            // 将接口获取的数据进行处理
            this.userList = simulateDataList; //初始时全部展示
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.userList.length
        },
        // 获取用户列表（包括全部与单个两种情况）
        async getUser(query){
            this.userList = [];
            if(query!=''){
                // console.log("请求路由：/user/miseruser/info/user000001")
                try{
                    const result = await get(`miseruser/getUser/${query}`)
                    if (result?.msg === "success" && result?.userInfo) {
                        this.userList.push(result.userInfo) //获取到数据
                        this.loading = false
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total =  this.userList.length
                    }else if(result?.msg === "该用户信息不存在"){
                        this.$message.info("该用户信息不存在！");
                    }else{
                        this.$message.error("未获取到数据，请重新输入！");
                    }
                }catch{
                    this.$message.error("未获取到数据，请重新输入！");
                }
            }else{
                try{
                    // console.log("请求路由：/user/miseruser/list")
                    const result = await get('miseruser/getUserlist')
                    if (result?.msg === "success" && result?.userList) {
                        this.userList = result.userList
                        this.loading = false
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total =  this.userList.length
                    }else{
                        this.$message.error("未获取到数据，请重新获取！");
                    }
                }catch{
                    this.$message.error("未获取到数据，请重新获取！");
                }
            }
        },
        // 展示查询数据
        async showUser(){
            this.getUser(this.query);
        },
        // 选中的值显示--用于批量删除
        selsChange(sels) {
            this.sels = sels 
        },
        // 删除有关函数
        singleDelete,
        batchDelete,
        // 编辑/添加
        async handleEdit(index, row){
            this.query='' //添加/编辑之前记得清空搜索栏
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.title = '编辑'
                this.editForm.userId = row.userId
                this.editForm.userName = row.userName
                this.editForm.userPassword = row.userPassword
                this.editForm.userPower = row.userPower
                this.editForm.createTime = formatDate(row.createTime)
            } else {
                this.title = '添加'
                this.editForm.userId = ''
                this.editForm.userName = ''
                this.editForm.userPassword = ''
                this.editForm.userPower = ''
                this.editForm.createTime = ''
            }
        },
        // 添加/编辑用户后进行保存
        submitForm,
        // 关闭编辑、增加弹出框
        closeDialog() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields();
        },
        // 分页插件事件--通过改变分页中间变量来改变分页参数
        callFather(parm) {
            this.formInline.page = parm.currentPage
            this.formInline.limit = parm.pageSize
            // this.getUserList()
            this.showUser()
            this.sortChange(this.column)
        },
        // 导出为表格函数 
        handleExport,
        // 自定义表格排序规则
        sortChange(column){
            // 拷贝排序时的列数类型参数
            this.column = column;
            this.userList = JSON.parse(JSON.stringify(tableSortChange(column,this.userList)));
        },
        // 将后端传递过来的时间进行格式转换
        formatDate(row, column) {
            // 获取单元格数据
            let data = row[column.property]
            return formatDate(data)
        }
    }
}
</script>

<style lang="scss" scoped>
.mainContainer{
    width:100%;
    height: 100%;
    padding:0.15rem;
    .cardContainer{
        margin: 0.15rem 0 0rem 0;
    }
}
.icon-sousuo{
    width:100%;
    height: 100%;
    position: absolute;
    margin:0 auto;
}
.icon-sousuo:hover::before{
    color:#409eff;
}
.iconfont{
    margin-right: 0;
}
.icon-tianjiayonghu,.icon-daochubiaoge,.icon-shanchupiliangshanchu{
    color:#fff !important;
}
</style>