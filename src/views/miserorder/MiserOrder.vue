<template>
<div class="mainContainer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>订单管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="cardContainer">
        <!-- 按钮区域 -->
        <el-row :gutter="20">
            <el-col :span="7">
                    <!-- 搜索、导出、添加区域 -->
                    <el-input placeholder="请输入订单id（默认筛选全部）" style="position:relative" clearable @clear="showOrder" v-model="query">
                        <template #append>
                            <el-button type="primary" class="iconfont icon-sousuo" @click="showOrder"></el-button>
                        </template>
                    </el-input>
            </el-col>
            <el-col :span="3.5">
                    <el-button type="primary" @click="handleExport(orderList)">
                        <el-icon class="iconfont icon-daochubiaoge"></el-icon>
                        <span>导出表格</span>
                    </el-button>
            </el-col>
            <el-col :span="3.5">
                    <el-button type="danger" @click="batchDelete(sels,showOrder)">
                        <el-icon class="iconfont icon-shanchupiliangshanchu"></el-icon>
                        <span>批量删除</span>
                    </el-button>
            </el-col>
        </el-row>
        <!-- 用户列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="orderList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column align="center" label="订单id" prop="orderId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="用户id" prop="userId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="用户名称" prop="userName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
            <el-table-column align="center" label="物品id" prop="wareId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="物品名称" prop="wareName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
            <el-table-column align="center" label="物品数量" prop="wareCount" :show-overflow-tooltip='true' min-width="100" sortable="custom"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="createTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
            <el-table-column align="center" label="操作" min-width="140">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row,showOrder)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
        <!-- 编辑/增加界面 -->
        <el-dialog title="编辑" v-model="editFormVisible" width="30%" :before-close="closeDialog">
            <el-form label-width="1.2rem" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="订单id" prop="orderId">
                    <el-input size="small" v-model="editForm.orderId" auto-complete="off" placeholder="请输入订单id"></el-input>
                </el-form-item>
                <el-form-item label="用户id" prop="userId">
                <el-input size="small" v-model="editForm.userId" auto-complete="off" placeholder="请输入用户id"></el-input>
                </el-form-item>
                <el-form-item label="用户名称" prop="userName">
                <el-input size="small" v-model="editForm.userName" auto-complete="off" placeholder="请输入用户名称"></el-input>
                </el-form-item>
                <el-form-item label="物品id" prop="wareId">
                <el-input size="small" v-model="editForm.wareId" auto-complete="off" placeholder="请输入物品id"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="wareName">
                <el-input size="small" v-model="editForm.wareName" auto-complete="off" placeholder="请输入物品名称"></el-input>
                </el-form-item>
                <el-form-item label="物品数量" prop="wareCount">
                <el-input size="small" v-model="editForm.wareCount" auto-complete="off" placeholder="请输入物品数量"></el-input>
                </el-form-item>
            </el-form>
            <div slot:footer class="dialog-footer" style="padding-left:0.8rem">
                <el-button style="margin-right:0.6rem;" size="small" @click="closeDialog">取消</el-button>
                <el-button size="small" type="primary" :loading="loading" class="title"  @click="submitForm(editForm,showOrde)">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script >
import tableSortChange from '../../utils/tableSortChange'
import PaginateView from '../../components/PaginateView'
import getOrder from './getOrder'
import {singleDelete,batchDelete} from './deleteOrder'
import submitForm from './editOrder'
import handleExport from './exportOrder'
import {formatDate} from '../../utils/timeEffect'
import simulateDataList from './simulateDataList.json'
export default {
    name:'MiserOrder',
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
                // 页面此时需要展示的订单列表
                orderList: [],
                // 编辑操作需要的参数
                editFormVisible: false, //控制编辑页面显示与隐藏
                editForm: {
                    orderId:'',
                    userId:'',
                    userName:'',
                    wareId:'',
                    wareName:'',
                    wareCount:''
                },
                // 编辑/增加操作时的rules表单验证
                rules: {
                    orderId: [{ required: true, message: '请输入订单id', trigger: 'blur' }],
                    userId:[{ required: true, message: '请输入用户id', trigger: 'blur' }],
                    userName: [{ required: true, message: '请输入用户名称', trigger: 'blur' }],
                    wareId:[{ required: true, message: '请输入物品id', trigger: 'blur' }],
                    wareName: [{ required: true, message: '请输入物品名称', trigger: 'blur' }],
                    wareCount:[{ required: true, message: '请输入物品数量', trigger: 'blur' }]
                },
                //选中的值显示--用于批量删除
                sels: []
        }
    },
    created () {
            this.getOrderList()
            // this.showOrder()
    },
    methods: {
        // 模拟的全部订单列表
        async getOrderList () {
            // 模拟获取全部数据
            // 模拟数据--实际上通过接口获取
            // 将接口获取的数据进行处理
            this.orderList = simulateDataList; //初始时全部展示
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.orderList.length
        },
        // 展示查询数据
        async showOrder(){
                // 将接口获取的数据进行处理
                this.orderList = JSON.parse(JSON.stringify(getOrder(this.query)));
                this.loading = false
                this.pageparm.currentPage = this.formInline.page
                this.pageparm.pageSize = this.formInline.limit
                this.pageparm.total =  this.orderList.length
        },
        // 选中的值显示--用于批量删除
        selsChange(sels) {
            this.sels = sels 
        },
        // 删除有关函数
        singleDelete,
        batchDelete,
        // 编辑
        async handleEdit(index, row){
            this.query='' //编辑之前记得清空搜索栏
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.editForm.orderId = row.orderId
                this.editForm.userId = row.userId
                this.editForm.userName = row.userName
                this.editForm.wareId = row.wareId
                this.editForm.wareName = row.wareName
                this.editForm.wareCount = row.wareCount
            }
        },
        // 编辑订单后进行保存
        submitForm,
        // 关闭编辑弹出框
        closeDialog() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields();
        },
        // 分页插件事件--通过改变分页中间变量来改变分页参数
        callFather(parm) {
            this.formInline.page = parm.currentPage
            this.formInline.limit = parm.pageSize
            this.getOrderList()
            // this.showOrder()
            this.sortChange(this.column)
        },
        // 导出为表格函数 
        handleExport,
        // 自定义表格排序规则
        sortChange(column){
                // 拷贝排序时的列数类型参数
                this.column = column;
                this.orderList = JSON.parse(JSON.stringify(tableSortChange(column,this.orderList)));
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
.icon-tianjiawupin,.icon-daochubiaoge,.icon-shanchupiliangshanchu{
    color:#fff !important;
}
</style>