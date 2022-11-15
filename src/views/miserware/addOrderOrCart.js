import {post} from '../../utils/request';
import { ElMessage } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'

// 编辑订单后进行保存
const submitOrder = async(addOrder,addFlag)=>{
    const submitData = {
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        createTime:''
    };
    const nowTime = getNowTime();
    submitData.userId = "接口获取登录信息后得到userId";
    submitData.userName = "接口获取登录信息后得到userName";
    submitData.wareId = addOrder.wareId;
    submitData.wareName = addOrder.wareName;
    submitData.wareCount = addOrder.wareCount;
    submitData.createTime = nowTime;
    if(addFlag=='cart'){
        submitData.updateTime = nowTime;
        submitData.cartId = '后端处理cartId';
        console.log("请求路由：/auth/misercart/loginout")
        console.log(submitData)
        const result = await post('/auth/misercart/loginout',{wareId:submitData.wareId,wareCount:submitData.wareCount})
        .then(()=>{
            // console.log(result)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        })
        .catch(() => {
            ElMessage.error('添加失败，请稍后再试！')
        })
    }else if(addFlag=='order'){
        submitData.orderId = '后端处理orderId';
        console.log("请求路由：/order/miserorder/save")
        console.log(submitData)
        const result = await post('/order/miserorder/save',submitData)
        .then(()=>{
            // console.log(result)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        })
        .catch(() => {
            ElMessage.error('添加失败，请稍后再试！')
        })
    }
};

export default submitOrder;