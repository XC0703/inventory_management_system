import { post } from '../../utils/request';
import { ElMessage } from "element-plus";
// import {formatDate} from '../../utils/timeEffect'

// 将临时订单加入订单
const postCart = async(fun)=>{
    // const submitData = JSON.parse(JSON.stringify(sels));
    // for(let i = 0;i<submitData.length;i++){
    //     submitData[i].createTime = formatDate(submitData[i].createTime);
    //     submitData[i].updateTime = formatDate(submitData[i].updateTime);
    // }
    // console.log("请求路由：/auth/misercart/postcart")
    // console.log(submitData)
    try{
        // const result = await post('/auth/misercart/postcart',submitData)
        const result = await post('/auth/misercart/postcart')
        if (result?.msg === "success") {
            ElMessage.success('添加成功！')
            fun()
        }else{
            ElMessage.error('添加失败，请稍后再试！')
        }
    }catch{
        ElMessage.error('添加失败，请稍后再试！')
    }
}
export {postCart};