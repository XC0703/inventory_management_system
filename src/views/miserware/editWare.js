import {post} from '../../utils/request';
import { ElMessage } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'

// 添加/编辑物品后进行保存
const submitForm = async(editData,fun,title)=>{
    const submitData = {
        wareId:'后端处理wareId',
        wareName:'',
        warePower:'',
        wareCount:'',
        createTime:'',
        updateTime:''
    };
    submitData.wareName = editData.wareName;
    submitData.warePower = editData.warePower;
    submitData.wareCount = editData.wareCount;
    const nowTime = getNowTime();
    // console.log(nowTime)
    // 添加
    if(title == '添加'){
        submitData.createTime = nowTime;
        submitData.updateTime = nowTime;
        // console.log("添加")
        console.log(submitData)
        const result = await post('/ware/miserware/save',submitData)
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
        submitData.updateTime = nowTime;
        // console.log('编辑')
        console.log(submitData)
        const result = await post('/ware/miserware/update',editData)
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