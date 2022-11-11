import { get,post } from '../../utils/request';
import { ElMessage } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'
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
// 将临时订单加入订单
const postCart = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择添加的订单！')
    }else{
        const submitData = JSON.parse(JSON.stringify(sels));
        for(let i = 0;i<submitData.length;i++){
            submitData[i].createTime = getNowTime();
        }
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
export {getCart,postCart};