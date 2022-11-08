import {post} from '../../utils/request';
import { ElMessage } from "element-plus";
import getNowTime from '../../utils/getNowTime'

// 添加/编辑用户后进行保存
const submitForm = async(editData,fun,title)=>{
    const submitData = {
        userId:'',
        userName:'',
        userPassword:'',
        userPower:'',
        createTime:'',
        updateTime:''
    };
    submitData.userId = editData.userId;
    submitData.userName = editData.userName;
    submitData.userPassword = editData.userPassword;
    submitData.userPower = editData.userPower;
    const nowTime = getNowTime();
    // console.log(nowTime)
    // 添加
    if(title == '添加'){
        submitData.createTime = nowTime;
        submitData.updateTime = nowTime;
        // console.log("添加")
        const result = await post('/user/miseruser/save',submitData)
        .then(()=>{
            // console.log(result)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
                fun();
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        })
        .catch(() => {
            ElMessage.error('添加失败，请稍后再试！')
        })
    }else if(title == '编辑'){
        submitData.createTime = editData.createTime;
        submitData.updateTime = editData.nowTime;
        // console.log('编辑')
        const result = await post('/user/miseruser/update',editData)
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
    }
};

export default submitForm;