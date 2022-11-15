import { get,post } from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'
import {formatDate} from '../../utils/timeEffect'
// 获取临时订单
const getCart = ()=>{
    let isReq = false;//是否请求成功的标志
    const getOrderByQuery = async ()=>{
        let tempArr = [];
        const result = await get('/auth/misercart/list')
        .then(()=>{
            isReq = true
            // console.log(result)
            if (result?.msg === "success" && result?.page?.list) {
                tempArr = JSON.parse(JSON.stringify(result.page.list)); //获取到数据
                return tempArr
            }else{
                ElMessage.error("未获取到数据，请重新获取！");
            }
        })
        .catch(()=>{
            ElMessage.error("未获取到数据，请重新获取！");
        })
    }
    getOrderByQuery() //判断请求是否成功
    if(isReq){
        return getOrderByQuery().then()
    }else{
        return []
    }
}
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
    submitData.wareCount = editData.wareCount;
    submitData.createTime = editData.createTime;
    submitData.updateTime = getNowTime();
    console.log("请求路由：/cart/misercart/update")
    console.log(submitData)
    const result = await post('/cart/misercart/update',submitData)
    .then(()=>{
        // console.log(result)
        if (result?.msg === "success") {
            ElMessage.success('更新成功！')
            fun();
        }else{
            ElMessage.error('更新失败，请稍后再试！')
        }
    })
    .catch(() => {
        ElMessage.error('更新失败，请稍后再试！')
    })
};
// 将临时订单加入订单
const postCart = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择添加的订单！')
    }else{
        const submitData = JSON.parse(JSON.stringify(sels));
        for(let i = 0;i<submitData.length;i++){
            submitData[i].createTime = formatDate(submitData[i].createTime);
            submitData[i].updateTime = formatDate(submitData[i].updateTime);
        }
        console.log("请求路由：/auth/misercart/postcart")
        console.log(submitData)
        const result = await post('/auth/misercart/postcart',submitData)
        .then(()=>{
            // console.log(result)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
                fun()
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        })
        .catch(() => {
            ElMessage.error('添加失败，请稍后再试！')
        })
    }
}
// 删除订单函数
const handleDetele = async(deleteIdList,fun)=>{
    console.log("请求路由：/cart/misercart/delete")
    console.log(deleteIdList)
    const result = post('/cart/misercart/delete',deleteIdList)
    .then(()=>{
        // console.log(result)
        if (result?.msg === "success") {
            ElMessage.success('删除成功！')
            fun();
        }else{
            ElMessage.error('删除失败，请稍后再试！')
        }
    })
    .catch(()=>{
        ElMessage.error('删除失败，请稍后再试！')
    })
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
            ElMessage.info("'已取消删除'")
        })
    }
};
export {getCart,submitForm,postCart,singleDelete,batchDelete};