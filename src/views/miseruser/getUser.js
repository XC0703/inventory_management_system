import {get} from '../../utils/request';
import { ElMessage } from "element-plus";
// 获取用户列表（包括全部与单个两种情况）
const getUser = (query)=>{
    let isReq = false;//是否请求成功的标志
    const getUserByQuery = async (query)=>{
        let tempArr = [];
        let userId = query;
        if(userId!=''){
            console.log(userId)
            const result = await get('/user/miseruser/info',{
                userId
            })
            .then(()=>{
                isReq = true
                // console.log(result)
                if (result?.msg === "success" && result?.page?.list) {
                    tempArr.push(result.miserUser) //获取到数据
                    return tempArr
                }
            })
            .catch(()=>{
                ElMessage.error("未获取到数据，请重新输入！");
            })
        }else{
            const result = await get('/user/miseruser/list')
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
    getUserByQuery(query) //判断请求是否成功
    if(isReq){
        return getUserByQuery(query).then()
    }else{
        return []
    }
}
export default getUser;