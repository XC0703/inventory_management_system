import {get} from '../../utils/request';
import { ElMessage } from "element-plus";
// 获取订单列表（包括全部与单个两种情况）
const getOrder = (query)=>{
    let isReq = false;//是否请求成功的标志
    const getOrderByQuery = async (query)=>{
        let tempArr = [];
        let orderId = query;
        if(orderId!=''){
            const result = await get('/order/miserorder/info',{
                orderId
            })
            .then(()=>{
                isReq = true
                // console.log(result)
                if (result?.msg === "success" && result?.page?.list) {
                    tempArr.push(result.miserOrder) //获取到数据
                    return tempArr
                }
            })
            .catch(()=>{
                ElMessage.error("未获取到数据，请重新输入！");
            })
        }else{
            const result = await get('/order/miserorder/list')
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
    }
    getOrderByQuery(query) //判断请求是否成功
    if(isReq){
        return getOrderByQuery(query).then()
    }else{
        return []
    }
}
export default getOrder;