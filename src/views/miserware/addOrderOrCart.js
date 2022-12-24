import {post} from '../../utils/request';
import { ElMessage } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'

// 编辑订单后进行保存
const submitOrder = async(addOrder,addFlag,fun)=>{
    const submitData = {
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        createTime:''
    };
    const nowTime = getNowTime();
    submitData.userId = addOrder.userId;
    submitData.userName = addOrder.userName;
    submitData.wareId = addOrder.wareId;
    submitData.wareName = addOrder.wareName;
    submitData.wareCount = addOrder.wareCount;
    submitData.createTime = nowTime;
    if(addFlag=='cart'){
        // submitData.updateTime = nowTime;
        // submitData.cartId = '后端处理cartId';
        // console.log("请求路由：/auth/misercart/loginout")
        // console.log(submitData)
        try{
            const result = await post('misercart/addCart',submitData)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
            }else if(result?.msg === "库存物品数量不足"){
                ElMessage.info('库存物品数量不足！')
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        }catch{
            ElMessage.error('添加失败，请稍后再试！')
        }
    }else if(addFlag=='order'){
        // submitData.orderId = '后端处理orderId';
        // console.log("请求路由：/order/miserorder/save")
        // console.log(submitData)
        try{
            const result = await post('miserorder/addOrder',submitData)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
                fun();
            }else if(result?.msg === "库存物品数量不足"){
                ElMessage.info('库存物品数量不足！')
            }
            else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        }catch{
            ElMessage.error('添加失败，请稍后再试！')
        }
    }
};

export default submitOrder;