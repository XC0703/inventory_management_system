<template>
<div class="mainContainer">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item>临时订单</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card class="cardContainer">
        <!-- 将临时订单加入订单 -->
        <el-button type="primary" @click="postCart(sels,getCart)">
            <el-icon class="iconfont icon-ziyuan35"></el-icon>
            <span>加入订单</span>
        </el-button>
        <!-- 用户列表区域  -->
        <el-table height='3.2rem' @sort-change="sortChange" @selection-change="selsChange" :data="cartList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column align="center" label="物品id" prop="wareId" min-width="100"></el-table-column>
            <el-table-column align="center" label="物品名称" prop="wareName" min-width="100"></el-table-column>
            <el-table-column align="center" label="物品数量" prop="wareCount" min-width="100" sortable="custom"></el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
    </el-card>
</div>
</template>

<script >
import tableSortChange from '../../utils/tableSortChange'
import PaginateView from '../../components/PaginateView'
import { getCart,postCart } from './cartEffect'
import simulateDataList from './simulateDataList.json'
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
            this.cartList = JSON.parse(JSON.stringify(getCart()));
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.cartList.length
        },
        // 将临时订单加入订单
        postCart,
        // 选中的值显示--用于批量加入订单
        selsChange(sels) {
            this.sels = sels 
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
.icon-ziyuan35{
    color:#fff !important;
}
</style>