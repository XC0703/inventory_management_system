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
            <el-col :span="3.5">
                <el-button type="primary" @click="postCart(sels,showCart)">
                    <el-icon class="iconfont icon-ziyuan35"></el-icon>
                    <span>加入订单</span>
                </el-button>
            </el-col>
            <el-col :span="3.5">
                <el-button type="danger" @click="batchDelete(sels,showCart)">
                    <el-icon class="iconfont icon-shanchupiliangshanchu"></el-icon>
                    <span>批量删除</span>
                </el-button>
            </el-col>
        </el-row>
        <!-- 订单列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="cartList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  border v-loading="loading" bcart element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
                <el-table-column align="center" type="selection" width="60"></el-table-column>
                <el-table-column align="center" label="负责人名称" prop="userName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
                <el-table-column align="center" label="物品名称" prop="wareName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
                <el-table-column align="center" label="物品数量" prop="wareCount" :show-overflow-tooltip='true' min-width="100" sortable="custom"></el-table-column>
                <el-table-column align="center" label="创建时间" prop="createTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
                <el-table-column align="center" label="更新时间" prop="updateTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
                <el-table-column align="center" label="操作" min-width="140">
                    <template #default="scope">
                        <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                        <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row,showCart)">删除</el-button>
                    </template>
                </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
        <!-- 编辑界面 -->
        <el-dialog title="编辑" v-model="editFormVisible" width="30%" :before-close="closeDialog">
            <el-form label-width="1.2rem" :model="editForm" ref="editForm">
                    <el-form-item label="负责人名称" prop="userName">
                    <el-input size="small" v-model="editForm.userName" auto-complete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="物品名称" prop="wareName">
                    <el-input size="small" v-model="editForm.wareName" auto-complete="off" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="物品数量" prop="wareCount">
                        <el-input-number v-model="editForm.wareCount" size="small" :min="1" />
                    </el-form-item>
            </el-form>
            <div slot:footer class="dialog-footer" style="padding-left:0.8rem">
                <el-button style="margin-right:0.6rem;" size="small" @click="closeDialog">取消</el-button>
                <el-button size="small" type="primary" :loading="loading" class="title"  @click="submitForm(editForm,showCart);closeDialog()">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script >
import tableSortChange from '../../utils/tableSortChange'
import {formatDate} from '../../utils/timeEffect'
import PaginateView from '../../components/PaginateView'
import {getCart,submitForm,postCart,singleDelete,batchDelete} from './cartEffect'
import simulateDataList from '@/assets/simulateData/dataCart.json'
export default {
    name:'MiserCart',
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
            cartList: [],
            // 编辑操作需要的参数
            editFormVisible: false, //控制编辑页面显示与隐藏
            editForm: {
                cartId:'',
                userId:'',
                userName:'',
                wareId:'',
                wareName:'',
                wareCount:'',
                createTime:''
            },
            //选中的值显示--用于批量删除
            sels: []
        }
    },
    created () {
            this.getCartList()
            // this.showCart()
    },
    methods: {
        // 模拟的全部订单列表
        async getCartList () {
            // 模拟获取全部数据
            // 模拟数据--实际上通过接口获取
            // 将接口获取的数据进行处理
            this.cartList = simulateDataList; //初始时全部展示
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.cartList.length
        },
        // 展示查询数据
        async showCart(){
            // 将接口获取的数据进行处理
            this.cartList = JSON.parse(JSON.stringify(getCart(this.query)));
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.cartList.length
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
                this.editForm.cartId = row.cartId
                this.editForm.userId = row.userId
                this.editForm.userName = row.userName
                this.editForm.wareId = row.wareId
                this.editForm.wareName = row.wareName
                this.editForm.wareCount = row.wareCount
                this.editForm.createTime = formatDate(row.createTime)
            }
        },
        // 将临时订单加入订单
        postCart,
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
            this.getCartList()
            // this.showCart()
            this.sortChange(this.column)
        },
        // 自定义表格排序规则
        sortChange(column){
            // 拷贝排序时的列数类型参数
            this.column = column;
            this.cartList = JSON.parse(JSON.stringify(tableSortChange(column,this.cartList)));
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
.icon-ziyuan35,.icon-shanchupiliangshanchu{
    color:#fff !important;
}
::v-deep .el-input-number__decrease{
    top: 0.025rem;
} 
::v-deep .el-input-number__increase{
    top: 0.025rem;
}
</style>