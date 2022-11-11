import {post} from '../../utils/request';
import { ElMessage } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'

// 编辑订单后进行保存
const submitOrder = async(addOrder,addFlag)=>{
    const submitData = {
        orderId:'',
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        createTime:''
    };
    const nowTime = getNowTime();
    submitData.orderId = '后端处理orderId';
    submitData.userId = "后端处理userId";
    submitData.userName = "后端处理userName";
    submitData.wareId = addOrder.wareId;
    submitData.wareName = addOrder.wareName;
    submitData.wareCount = addOrder.wareCount;
    submitData.createTime = nowTime;
    console.log(submitData)
    if(addFlag=='cart'){
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