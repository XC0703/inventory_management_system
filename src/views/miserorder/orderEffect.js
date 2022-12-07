import {post} from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
// import {getNowTime} from '../../utils/timeEffect'
// 导出为表格
const handleExport = (orderList)=>{
    import('@/utils/exportExcel').then(excel => {
        // excel表示导入的模块对象
        const res = orderList;
        // const one = res[0] // 返回的数组取第一项
        // const header = Object.keys(one) // 拿对象中的所有的键
        const header = ['订单id','用户id','用户名称','物品id','物品名称','物品数量','创建时间']
        const data = res.map(item => Object.values(item)) //拿到里面的每一个值
        excel.export_json_to_excel({
            header, // 表头 必填
            data, // 具体数据 必填
            filename: 'orderList', // 文件名称
            autoWidth: true, // 宽度是否自适应
            bookType: 'xlsx' // 生成的文件类型
        })
    })
}
// 删除订单函数
const handleDetele = async(deleteIdList,fun)=>{
    // console.log("请求路由：/order/miserorder/delete")
    // console.log(deleteIdList)
    try{
        const result = await post('/order/miserorder/delete',deleteIdList)
        if (result?.msg === "success") {
            ElMessage.success('删除成功！')
            fun();
        }else{
            ElMessage.error('删除失败，请稍后再试！')
        }
    }catch{
        ElMessage.error('删除失败，请稍后再试！')
    }
};
// 删除单个
const singleDelete = async (index,row,fun)=>{
    let deleteIdList = []
    deleteIdList.push(row.orderId)
    // console.log(deleteIdList)
    ElMessageBox.confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
    }).then(()=>{
        handleDetele(deleteIdList,fun)
    }).catch(() => {
        ElMessage.info("'已取消删除'")
    })
};
//批量删除
const batchDelete = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择需要删除的项！')
    }else{
        let deleteIdList = []
        for(let i = 0;i<sels.length;i++){
            deleteIdList.push(sels[i].orderId)
        }
        // console.log(deleteIdList)
        ElMessageBox.confirm('确定要删除吗?', '删除', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
        }).then(()=>{
            handleDetele(deleteIdList,fun)
        }).catch(() => {
            ElMessage.info("'已取消删除'")
        })
    }
};
// 编辑订单后进行保存
const submitForm = async(editData,fun)=>{
    const submitData = {
        orderId:'',
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        //creatTime:'',
        //updateTime:''
    };
    submitData.orderId = editData.orderId;
    submitData.userId = editData.userId;
    submitData.userName = editData.userName;
    submitData.wareId = editData.wareId;
    submitData.wareName = editData.wareName;
    submitData.wareCount = editData.wareCount;
    //submitData.creatTime = editData.creatTime;
    //submitData.updateTime = getNowTime();
    // console.log("请求路由：/order/miserorder/update")
    // console.log(submitData)
    try{
        const result = await post('/order/miserorder/update',submitData)
        if (result?.msg === "success") {
            ElMessage.success('更新成功！')
            fun();
        }else{
            ElMessage.error('更新失败，请稍后再试！')
        }
    }catch{
        ElMessage.error('更新失败，请稍后再试！')
    }
};
export {submitForm,handleExport,singleDelete,batchDelete};