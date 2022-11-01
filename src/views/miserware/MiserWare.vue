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
                <el-input placeholder="请输入物品id（默认筛选全部）" style="position:relative" clearable @clear="getWare" v-model="query">
                    <template #append>
                        <el-button type="primary" class="iconfont icon-sousuo" @click="getWare"></el-button>
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
                <el-button type="primary" @click="handleExport()">
                    <el-icon class="iconfont icon-daochubiaoge"></el-icon>
                    <span>导出表格</span>
                </el-button>
            </el-col>
            <el-col :span="3.5">
                <el-button type="danger" @click="batchDelete(sels)">
                    <el-icon class="iconfont icon-shanchupiliangshanchu"></el-icon>
                    <span>批量删除</span>
                </el-button>
            </el-col>
        </el-row>
        <!-- 用户列表区域  -->
        <el-table @selection-change="selsChange" :data="wareList.slice((pageparm.currentPage - 1) * pageparm.pageSize, pageparm.currentPage * pageparm.pageSize)"  v-loading="loading" border element-loading-text="拼命加载中" stripe style="margin:0.15rem 0rem 0.15rem 0rem;max-height: 3.2rem;">
            <el-table-column align="center" type="selection" width="60"></el-table-column>
            <el-table-column align="center" label="物品id" prop="wareId" min-width="70"></el-table-column>
            <el-table-column align="center" label="物品名称" prop="wareName" min-width="120"></el-table-column>
            <el-table-column align="center" label="物品价格" prop="warePower" min-width="100"></el-table-column>
            <el-table-column align="center" label="库存数量" prop="wareCount" min-width="100"></el-table-column>
            <el-table-column align="center" label="创建时间" prop="createTime" min-width="145"></el-table-column>
            <el-table-column align="center" label="更新时间" prop="updateTime" min-width="145"></el-table-column>
            <el-table-column align="center" label="操作" min-width="140">
                <template #default="scope">
                    <el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                    <el-button size="small" type="danger" @click="singleDelete(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <!-- 分页组件 -->
        <PaginateView v-bind:child-msg="pageparm" @callFather="callFather"></PaginateView>
        <!-- 编辑/增加界面 -->
        <el-dialog :title="title" v-model="editFormVisible" width="30%" :before-close="closeDialog">
            <el-form label-width="120px" :model="editForm" :rules="rules" ref="editForm">
                <el-form-item label="物品id" prop="wareId">
                    <el-input size="small" v-model="editForm.wareId" auto-complete="off" placeholder="请输入物品id"></el-input>
                </el-form-item>
                <el-form-item label="物品名称" prop="wareName">
                <el-input size="small" v-model="editForm.wareName" auto-complete="off" placeholder="请输入物品名称"></el-input>
                </el-form-item>
                <el-form-item label="物品价格" prop="warePower">
                <el-input size="small" v-model="editForm.warePower" auto-complete="off" placeholder="请输入物品价格"></el-input>
                </el-form-item>
                <el-form-item label="库存数量" prop="wareCount">
                <el-input size="small" v-model="editForm.wareCount" auto-complete="off" placeholder="请输入库存数量"></el-input>
                </el-form-item>
            </el-form>
            <div slot:footer class="dialog-footer">
                <el-button size="small" @click="closeDialog">取消</el-button>
                <el-button size="small" type="primary" :loading="loading" class="title"  @click="submitForm(editForm)">保存</el-button>
            </div>
        </el-dialog>
    </el-card>
</div>
</template>

<script >
import PaginateView from '../../components/PaginateView'
import {get,post} from '../../utils/request';
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
            // 页面此时需要展示的物品列表
            wareList: [],
            // 编辑/增加操作需要的参数
            title: '添加',
            editFormVisible: false, //控制编辑/增加页面显示与隐藏
            editForm: { 
                wareId:'',
                wareName:"",
                warePower:'',
                wareCount:'',
            },
            // 编辑/增加操作时的rules表单验证
            rules: {
                wareId: [{ required: true, message: '请输入物品id', trigger: 'blur' }],
                wareName:[{ required: true, message: '请输入物品名称', trigger: 'blur' }],
                warePower: [{ required: true, message: '请输入物品价格', trigger: 'blur' }],
                wareCount:[{ required: true, message: '请输入库存数量', trigger: 'blur' }]
            },
            //选中的值显示--用于批量删除
            sels: []
        }
    },
    created () {
        this.getWareList()
        // this.getWare()
    },
    methods: {
        // 模拟的全部物品列表
        async getWareList () {
            // 模拟获取全部数据
            // 模拟数据--实际上通过接口获取
            let simulateDataList = [
                {
                    "wareId":1,
                    "wareName":"丁真珍珠",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2018-05-19 11:23:20",
                    "updateTime":"2018-05-19 11:23:20"
                },
                {
                    "wareId":2,
                    "wareName":"谷圣人",
                    "warePower":20020703,
                    "wareCount":40,
                    "createTime":"2018-05-18 22:04:51",
                    "updateTime":"2018-05-18 22:04:51"
                },
                {
                    "wareId":3,
                    "wareName":"赛博顶针",
                    "warePower":20020703,
                    "wareCount":100,
                    "createTime":"2019-05-18 22:04:51",
                    "updateTime":"2018-05-18 22:04:51"
                },
                {
                    "wareId":4,
                    "wareName":"考编丁真",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":5,
                    "wareName":"赢学家",
                    "warePower":20020703,
                    "wareCount":100,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":6,
                    "wareName":"丁真珍珠",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":7,
                    "wareName":"考编丁真",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":8,
                    "wareName":"赢学家",
                    "warePower":20020703,
                    "wareCount":100,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":9,
                    "wareName":"丁真珍珠",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":10,
                    "wareName":"赢学家",
                    "warePower":20020703,
                    "wareCount":100,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
                {
                    "wareId":11,
                    "wareName":"丁真珍珠",
                    "warePower":20020703,
                    "wareCount":10,
                    "createTime":"2021-05-16 14:45:07",
                    "updateTime":"2022-05-16 14:45:07"
                },
            ]
            // 将接口获取的数据进行处理
            this.wareList = simulateDataList; //初始时全部展示
            this.loading = false
            this.pageparm.currentPage = this.formInline.page
            this.pageparm.pageSize = this.formInline.limit
            this.pageparm.total =  this.wareList.length
        },
        // 获取物品列表（包括全部与单个两种情况）
        async getWare(){
            let simulateData = [];
            let wareId = this.query;
            // 模拟过程
            // console.log(this.query)
            // if(this.query!=''){
            //     let isFound = 0;
            //     simulateDataList.forEach((item)=>{
            //         if(item.wareId==this.query){
            //             console.log(item)
            //             simulateData.push(item)
            //             isFound =1;
            //         }
            //     })
            //     if(isFound==0){
            //         console.log("未找到数据，请重新输入！")
            //     }
            // }
            // 模拟数据
            // const result = {
            //     "msg":"success",
            //     "code":0,
            //     "page":{
            //         "totalCount":0,
            //         "pageSize":10,
            //         "totalPage":0,
            //         "currPage":1,
            //         "list":[
            //             {
            //                 "wareId":2,
            //                 "wareName":"谷圣人",
            //                 "warePower":20020703,
            //                 "wareCount":40,
            //                 "createTime":"2018-05-18 22:04:51",
            //                 "updateTime":"2018-05-18 22:04:51"
            //             }
            //         ]
            //     }
            // }
            if(wareId!=''){
                const result = await get('/ware/miserware/info',{
                    wareId
                })
                .then(()=>{
                    // console.log(result)
                    if (result?.msg === "success" && result?.page?.list) {
                        simulateData = result.page.list //获取到数据
                        // 将接口获取的数据进行处理
                        this.wareList = simulateData; 
                        this.loading = false
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total =  this.wareList.length
                    }else{
                        this.$message({
                            type: 'info',
                            message: '未获取到数据，请重新输入！'
                        })
                    }
                })
                .catch(() => {
                    this.$message.error('获取失败，请稍后再试！')
                })
            }else{
                const result = await get('/ware/miserware/list')
                .then(()=>{
                    // console.log(result)
                    if (result?.msg === "success" && result?.page?.list) {
                        simulateData = result.page.list //获取到数据
                        // 将接口获取的数据进行处理
                        this.wareList = simulateData; 
                        this.loading = false
                        this.pageparm.currentPage = this.formInline.page
                        this.pageparm.pageSize = this.formInline.limit
                        this.pageparm.total =  this.wareList.length
                    }else{
                        this.$message({
                            type: 'info',
                            message: '未获取到数据，请重新输入！'
                        })
                    }
                })
                .catch(() => {
                    this.$message.error('获取失败，请稍后再试！')
                })
            }
        },
        // 添加/编辑物品
        async handleEdit(index, row) {
            this.query='' //添加/编辑之前记得清空搜索栏
            this.editFormVisible = true
            if (row != undefined && row != 'undefined') {
                this.title = '编辑'
                this.editForm.wareId = row.wareId
                this.editForm.wareName = row.wareName
                this.editForm.warePower = row.warePower
                this.editForm.wareCount = row.wareCount
            } else {
                this.title = '添加'
                this.editForm.wareId = ''
                this.editForm.wareName = ''
                this.editForm.warePower = ''
                this.editForm.wareCount = ''
            }
        },
        // 添加/编辑物品后进行保存
        async submitForm(editData) {
            const submitData = { 
                wareId:'',
                wareName:"",
                warePower:'',
                wareCount:'',
                createTime:'',
                updateTime:''
            };
            submitData.wareId = editData.wareId;
            submitData.wareName = editData.wareName;
            submitData.warePower = editData.warePower;
            submitData.wareCount = editData.wareCount;
            const nowTime = this.getTime();
            // 添加
            if(this.title == '添加'){
                submitData.createTime = nowTime;
                submitData.updateTime = nowTime;
                // console.log("添加")
                const result = await post('/ware/miserware/save',submitData)
                .then(()=>{
                    // console.log(result)
                    if (result?.msg === "success") {
                        this.$message({
                            type: 'success',
                            message: '添加成功！'
                        })
                        this.getWare();
                    }else{
                        this.$message.error('添加失败，请稍后再试！')
                    }
                })
                .catch(() => {
                    this.$message.error('添加失败，请稍后再试！')
                })
            }else if(this.title == '编辑'){
                submitData.createTime = editData.createTime;
                submitData.updateTime = editData.nowTime;
                // console.log('编辑')
                const result = await post('/ware/miserware/update',editData)
                .then(()=>{
                    // console.log(result)
                    if (result?.msg === "success") {
                        this.$message({
                            type: 'success',
                            message: '更新成功！'
                        })
                        this.getWare();
                    }else{
                        this.$message.error('更新失败，请稍后再试！')
                    }
                })
                .catch(() => {
                    this.$message.error('更新失败，请稍后再试！')
                })
            }
        },
        // 删除单个
        async singleDelete(index,row){
            let deleteIdList = []
            deleteIdList.push(row.wareId)
            // console.log(deleteIdList)
            this.$confirm('确定要删除吗?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
            }).then(()=>{
                this.handleDetele(deleteIdList)
            })
            .catch(() => {
                this.$message({
                    type: 'info',
                    message: '已取消删除'
                })
            })
        },
        //批量删除
        selsChange(sels) {
            this.sels = sels 
        },
        async batchDelete(sels){
            if(sels==0){
                this.$message({
                    type: 'info',
                    message: '请选择需要删除的项！'
                })
            }else{
                let deleteIdList = []
                for(let i = 0;i<sels.length;i++){
                    deleteIdList.push(sels[i].wareId)
                }
                // console.log(deleteIdList)
                this.$confirm('确定要删除吗?', '删除', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(()=>{
                    this.handleDetele(deleteIdList)
                })
                .catch(() => {
                    this.$message({
                        type: 'info',
                        message: '已取消删除'
                    })
                })
            }
        },
        // 关闭编辑、增加弹出框
        closeDialog() {
            this.editFormVisible = false
            this.$refs.editForm.resetFields();
        },
        // 分页插件事件--通过改变分页中间变量来改变分页参数
        callFather(parm) {
            this.formInline.page = parm.currentPage
            this.formInline.limit = parm.pageSize
            this.getWareList()
            // this.getWare()
        },
        // 获取添加/修改的时间
        getTime(){
            let yy = new Date().getFullYear();
            let mm = new Date().getMonth()+1;
            let dd = new Date().getDate();
            return yy+'-'+mm+'-'+dd;
        },
        // 删除物品函数
        handleDetele(deleteIdList){
            const result = post('/ware/miserware/delete',deleteIdList)
            .then(()=>{
                // console.log(result)
                if (result?.msg === "success") {
                    this.$message({
                        type: 'success',
                        message: '删除成功！'
                    })
                    this.getWare();
                }else{
                    this.$message.error('删除失败，请稍后再试！')
                }
            })
            .catch(()=>{
                this.$message.error('删除失败，请稍后再试！')
            })
        },
        // 导出为表格
        handleExport(){
            import('@/utils/exportExcel').then(excel => {
                // excel表示导入的模块对象
                const res = this.wareList;
                // const one = res[0] // 返回的数组取第一项
                // const header = Object.keys(one) // 拿对象中的所有的键
                const header = ['物品id','物品名称','物品价格','库存数量','创建时间','更新时间']
                const data = res.map(item => Object.values(item)) //拿到里面的每一个值
                excel.export_json_to_excel({
                    header, // 表头 必填
                    data, // 具体数据 必填
                    filename: 'wareList', // 文件名称
                    autoWidth: true, // 宽度是否自适应
                    bookType: 'xlsx' // 生成的文件类型
                })
            })
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
// 滚动条样式设置
.el-table:hover{
    overflow-x: hidden;
    overflow-y: auto;
}
.el-table::-webkit-scrollbar {
    width: 0.1rem;
}
/*定义滚动条轨道 内阴影+圆角*/
.el-table::-webkit-scrollbar-track {
    border-radius: 0.06rem;
    background:rgba(15, 38, 80,0.1);  
}
/*定义滑块 内阴影+圆角*/
.el-table::-webkit-scrollbar-thumb {
  /*滚动条里面小方块*/
  border-radius   : 0.05rem;
  background-color: rgba(15, 38, 80,0.4);
  background-image: -webkit-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  background-image: -moz-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  background-image: -o-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
  background-image: -ms-linear-gradient(
    45deg,
    rgba(255, 255, 255, 0.3) 25%,
    transparent 25%,
    transparent 50%,
    rgba(255, 255, 255, 0.3) 50%,
    rgba(255, 255, 255, 0.3) 75%,
    transparent 75%,
    transparent
  );
}
// 去除表格滚动条
::v-deep .el-scrollbar__bar.is-horizontal {
    height:0;
}
</style>