import { post } from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
import {getNowTime,formatDate} from '../../utils/timeEffect'

// 编辑订单后进行保存
const submitForm = async(editData,fun)=>{
    const submitData = {
        cartId:'',
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        createTime:'',
        updateTime:''
    };
    submitData.cartId = editData.cartId;
    submitData.userId = editData.userId;
    submitData.userName = editData.userName;
    submitData.wareId = editData.wareId;
    submitData.wareName = editData.wareName;
    submitData.wareCount = Number(editData.wareCount);
    submitData.createTime = editData.createTime;
    submitData.updateTime = getNowTime();
    // console.log("请求路由：/cart/misercart/update")
    // console.log(submitData)
    try{
        const result = await post('misercart/updateCart',submitData)
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
// 将临时订单加入订单
const postCart = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择添加的订单！')
    }else{
        const submitData = JSON.parse(JSON.stringify(sels));
        for(let i = 0;i<submitData.length;i++){
            submitData[i].wareCount = Number(submitData[i].wareCount)
            submitData[i].createTime = formatDate(submitData[i].createTime);
            submitData[i].updateTime = formatDate(submitData[i].updateTime);
        }
        // console.log("请求路由：/auth/misercart/postcart")
        // console.log(submitData)
        try{
            // const result = await post('/auth/misercart/postcart',submitData)
            const result = await post('misercart/transCart',submitData)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
                fun()
            }else if(result?.msg === "库存物品数量不足"){
                ElMessage.info('某些库存物品数量不足')
                fun()
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        }catch{
            ElMessage.error('添加失败，请稍后再试！')
        }
    }
}
// 删除订单函数
const handleDetele = async(deleteIdList,fun)=>{
    // console.log("请求路由：/cart/misercart/delete")
    // console.log(deleteIdList)
    try{
        const result = await post('misercart/deleteCart',deleteIdList)
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
    deleteIdList.push(row.cartId)
    // console.log(deleteIdList)
    ElMessageBox.confirm('确定要删除吗?', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
    }).then(()=>{
        handleDetele(deleteIdList,fun)
    }).catch(() => {
        ElMessage.info("已取消删除")
    })
};
//批量删除
const batchDelete = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择需要删除的项！')
    }else{
        let deleteIdList = []
        for(let i = 0;i<sels.length;i++){
            deleteIdList.push(sels[i].cartId)
        }
        // console.log(deleteIdList)
        ElMessageBox.confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(()=>{
            handleDetele(deleteIdList,fun)
        }).catch(() => {
            ElMessage.info("已取消删除")
        })
    }
};
export {submitForm,postCart,singleDelete,batchDelete};