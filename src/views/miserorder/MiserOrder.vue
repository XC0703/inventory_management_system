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
        <!-- 订单列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="orderList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column align="center" label="订单id" prop="orderId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="负责人id" prop="userId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="负责人名称" prop="userName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
            <el-table-column align="center" label="物品id" prop="wareId" :show-overflow-tooltip='true' min-width="85"></el-table-column>
            <el-table-column align="center" label="物品名称" prop="wareName" :show-overflow-tooltip='true' min-width="100"></el-table-column>
            <el-table-column align="center" label="物品数量" prop="wareCount" :show-overflow-tooltip='true' min-width="100" sortable="custom"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="creatTime" :show-overflow-tooltip='true' :formatter="formatDate" min-width="145" sortable="custom"></el-table-column>
            <el-table-column align="center" label="操作" min-width="100">
                <template #default="scope">
                    <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row,showOrder)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
    </el-card>
</div>
</template>

<script >
import tableSortChange from '../../utils/tableSortChange'
import {formatDate} from '../../utils/timeEffect'
import {get} from '../../utils/request';
import PaginateView from '../../components/PaginateView'
import { handleExport,singleDelete,batchDelete } from './orderEffect'
import simulateDataList from '@/assets/simulateData/dataOrder.json'
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
                //选中的值显示--用于批量删除
                sels: []
        }
    },
    created () {
        // this.getOrderList()
        this.showOrder()
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
        // 获取订单列表（包括全部与单个两种情况）
        async getOrder(query){
            this.orderList = [];
            if(query!=''){
                // console.log("请求路由：/order/miserorder/info/order000001")
                try{
                    const result = await get(`/order/miserorder/info/${query}`)
                    if (result?.msg === "success" && result?.page?.list) {
                    this.orderList.push(result.miserOrder) //获取到数据
                    }else{
                        this.$message.error("未获取到数据，请重新输入！");
                    }
                }catch{
                    this.$message.error("未获取到数据，请重新输入！");
                }
            }else{
                try{
                    // console.log("请求路由：/order/miserorder/list")
                    const result = await get('/order/miserorder/list')
                    if (result?.msg === "success" && result?.page?.list) {
                        this.orderList = result.page.list
                    }else{
                        this.$message.error("未获取到数据，请重新获取！");
                    }
                }catch{
                    this.$message.error("未获取到数据，请重新获取！");
                }
            }
        },
        // 展示查询数据
        async showOrder(){
            this.getOrder(this.query)
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
        // 关闭编辑弹出框
        closeDialog() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields();
        },
        // 分页插件事件--通过改变分页中间变量来改变分页参数
        callFather(parm) {
            this.formInline.page = parm.currentPage
            this.formInline.limit = parm.pageSize
            // this.getOrderList()
            this.showOrder()
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