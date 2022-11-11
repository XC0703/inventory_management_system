import {post} from '../../utils/request';
import { ElMessage } from "element-plus";

// 编辑订单后进行保存
const submitForm = async(editData,fun)=>{
    const submitData = {
        orderId:'',
        userId:'',
        userName:'',
        wareId:'',
        wareName:'',
        wareCount:'',
        createTime:'',
    };
    submitData.orderId = editData.orderId;
    submitData.userId = editData.userId;
    submitData.userName = editData.userName;
    submitData.wareId = editData.wareId;
    submitData.wareName = editData.wareName;
    submitData.wareCount = editData.wareCount;
    submitData.createTime = editData.createTime;
    console.log(submitData)
    const result = await post('/order/miserorder/update',submitData)
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

export default submitForm;