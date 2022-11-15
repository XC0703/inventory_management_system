<template>
<div class="mainContainer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>库存管理</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="cardContainer">
        <!-- 按钮区域 -->
        <el-row :gutter="20">
            <el-col :span="7">
                <!-- 搜索、导出、添加区域 -->
                <el-input placeholder="请输入物品id（默认筛选全部）" style="position:relative" clearable @clear="showWare" v-model="query">
                    <template #append>
                        <el-button type="primary" class="iconfont icon-sousuo" @click="showWare"></el-button>
                    </template>
                </el-input>
            </el-col>
            <el-col :span="3.5">
                <el-button type="primary"  @click="handleEdit()">
                    <el-icon class="iconfont icon-tianjiawupin"></el-icon>
                    <span>添加物品</span>
                </el-button>
            </el-col>
            <el-col :span="3.5">
                <el-button type="primary" @click="handleExport(wareList)">
                    <el-icon class="iconfont icon-daochubiaoge"></el-icon>
                    <span>导出表格</span>
                </el-button>
            </el-col>
            <el-col :span="3.5">
                <el-button type="danger" @click="batchDelete(sels,showWare)">
                    <el-icon class="iconfont icon-shanchupiliangshanchu"></el-icon>
                    <span>批量删除</span>
                </el-button>
            </el-col>
        </el-row>
        <!-- 物品列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="wareList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column align="center" label="物品id" prop="wareId" :show-overflow-tooltip='true' min-width="70"></el-table-column>
            <el-table-column align="center" label="物品名称" prop="wareName" :show-overflow-tooltip='true' min-width="120"></el-table-column>
            <el-table-column align="center" label="物品价格" prop="warePower" :show-overflow-tooltip='true' min-width="100" sortable="custom"></el-table-column>
            <el-table-column align="center" label="库存数量" prop="wareCount" :show-overflow-tooltip='true' min-width="100" sortable="custom"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="createTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
            <el-table-column align="center" label="更新时间" prop="updateTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
            <el-table-column align="center" label="操作" min-width="175">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="primary" @click="handleAddOrder(scope.$index, scope.row)">交易</el-button>
                    <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row,showWare)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
        <!-- 编辑/增加界面 -->
        <el-dialog :title="title" v-model="editFormVisible" width="30%" :before-close="closeDialog">
            <el-form label-width="1.2rem" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="物品名称" prop="wareName">
                <el-input size="small" v-model="editForm.wareName" auto-complete="off" placeholder="请输入物品名称"></el-input>
                </el-form-item>
                <el-form-item label="物品价格" prop="warePower">
                <el-input size="small" v-model.number="editForm.warePower" auto-complete="off" placeholder="请输入物品价格"></el-input>
                </el-form-item>
                <el-form-item label="库存数量" prop="wareCount">
                <el-input size="small" v-model.number="editForm.wareCount" auto-complete="off" placeholder="请输入库存数量"></el-input>
                </el-form-item>
            </el-form>
            <div slot:footer class="dialog-footer" style="padding-left:0.8rem">
                <el-button style="margin-right:0.6rem;" size="small" @click="closeDialog">取消</el-button>
                <el-button size="small" type="primary" :loading="loading" class="title"  @click="submitForm(editForm,showWare,title);closeDialog()">保存</el-button>
            </div>
        </el-dialog>
        <!-- 订单交易页面 -->
        <el-dialog title="交易" v-model="addOrderVisible" width="30%" :before-close="closeOrderDialog">
            <el-form label-width="1.2rem" :model="addOrder" ref="addOrder">
                <el-form-item label="物品id" prop="wareId">
                <el-input size="small" v-model="addOrder.wareId" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="wareName">
                <el-input size="small" v-model="addOrder.wareName" auto-complete="off" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="物品数量" prop="wareCount">
                    <el-input-number v-model="addOrder.wareCount" size="small" :min="1" />
                </el-form-item>
            </el-form>
            <div slot:footer class="dialog-footer" style="padding-left:0.5rem">
                <el-button  size="small" type="primary" style="margin-right:0.4rem" @click="submitOrder(addOrder,'cart');closeOrderDialog()">加入临时订单</el-button>
                <el-button size="small" type="primary" :loading="loading" @click="submitOrder(addOrder,'order');closeOrderDialog()">直接加入订单</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script >
import tableSortChange from '../../utils/tableSortChange'
import {formatDate} from '../../utils/timeEffect'
import PaginateView from '../../components/PaginateView'
import {getWare,singleDelete,batchDelete,submitForm,handleExport} from './wareEffect'
import submitOrder from './addOrderOrCart'
import simulateDataList from '@/assets/simulateData/dataWare.json'
export default {
    name:'MiserWare',
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
            // 页面此时需要展示的物品列表
            wareList: [],
            // 编辑/增加操作需要的参数
            title: '添加',
            editFormVisible: false, //控制编辑/增加页面显示与隐藏
            editForm: {
                wareId:'',
                wareName:'',
                warePower:'',
                wareCount:'',
                createTime:''
            },
            // 编辑/增加操作时的rules表单验证
            rules: {
                wareName:[{ required: true, message: '请输入物品名称', trigger: 'blur' }],
                warePower: [{ required: true, message: '请输入物品价格', trigger: 'blur' },{ type:'number',message:'必须是数字',trigger: 'blur' }],
                wareCount:[{ required: true, message: '请输入库存数量', trigger: 'blur' },{ type:'number',message:'必须是数字',trigger: 'blur' }]
            },
            // 交易操作时需要的参数
            addOrderVisible: false, //控制添加订单页面显示与隐藏
            addOrder:{
                wareId:'',
                wareName:'',
                wareCount:0
            },
            //选中的值显示--用于批量删除
            sels: []
        }
    },
    created () {
        this.getWareList()
        // this.showWare()
    },
    methods: {
        // 模拟的全部物品列表
        async getWareList () {
            // 模拟获取全部数据
            // 模拟数据--实际上通过接口获取
            // 将接口获取的数据进行处理
            this.wareList = simulateDataList; //初始时全部展示
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.wareList.length
        },
        // 展示查询数据
        async showWare(){
            // 将接口获取的数据进行处理
            this.wareList = JSON.parse(JSON.stringify(getWare(this.query)));
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.wareList.length
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
                this.editForm.wareId = row.wareId
                this.editForm.wareName = row.wareName
                this.editForm.warePower = row.warePower
                this.editForm.wareCount = row.wareCount
                this.editForm.createTime = formatDate(row.createTime)
            } else {
                this.title = '添加'
                this.editForm.wareId = ''
                this.editForm.wareName = ''
                this.editForm.warePower = ''
                this.editForm.wareCount = ''
                this.editForm.createTime = ''
            }
        },
        // 添加/编辑物品后进行保存
        submitForm,
        // 关闭编辑、增加弹出框
        closeDialog() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields();
        },
        // 交易操作
        async handleAddOrder(index,row){
            this.addOrderVisible = true
            this.addOrder.wareId = row.wareId
            this.addOrder.wareName = row.wareName
            this.addOrder.wareCount = 0
        },
        submitOrder,
        closeOrderDialog(){
            this.addOrderVisible = false
            this.$refs.addOrder.resetFields();
        },
        // 分页插件事件--通过改变分页中间变量来改变分页参数
        callFather(parm) {
            this.formInline.page = parm.currentPage
            this.formInline.limit = parm.pageSize
            this.getWareList()
            // this.showWare()
            this.sortChange(this.column)
        },
        // 导出为表格函数 
        handleExport,
        // 自定义表格排序规则
        sortChange(column){
            // 拷贝排序时的列数类型参数
            this.column = column;
            this.wareList = JSON.parse(JSON.stringify(tableSortChange(column,this.wareList)));
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
::v-deep .el-input-number__decrease{
    top: 0.025rem;
} 
::v-deep .el-input-number__increase{
    top: 0.025rem;
}
</style>