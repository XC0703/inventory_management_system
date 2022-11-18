import {get} from './request'
import { ElMessage } from "element-plus";
// 获得当前登录信息，需要用到的地方：
// 1、登录时验证是否为超级管理员，是的话开放用户管理功能，同时临时订单展示所有；不是则关闭用户管理功能，同时临时订单展示该管理员对应的临时订单
// 2、在物品管理页面加入订单或者临时订单时，绑定当前所登录用户信息
const getLoginUser = async()=>{
    try{
        const result = await get('/auth/miserauth/getloginUser')
        if (result?.msg === "success") {
            ElMessage.success('获取当前所登录用户信息成功！')
        }else{
            ElMessage.error('获取当前所登录用户信息失败！')
        }
    }catch{
        ElMessage.error('获取当前所登录用户信息失败！')
    }
}

export default getLoginUser