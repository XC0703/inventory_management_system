import store from '../../store'
import {post} from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'
import router from '@/router'
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
    submitData.userName = editData.userName;
    submitData.userPassword = editData.userPassword;
    submitData.userPower = Number(editData.userPower);
    const nowTime = getNowTime();
    // console.log(nowTime)
    // 添加
    if(title == '添加'){
        submitData.userId = "后端处理userId"
        submitData.createTime = nowTime;
        submitData.updateTime = nowTime;
        // console.log("请求路由：/user/miseruser/save")
        // console.log(submitData)
        try{
            const result = await post('miseruser/addUser',submitData)
            if (result?.msg === "success") {
                ElMessage.success('添加成功！')
                fun();
            }else if(result?.msg === "用户名或密码过长"){
                ElMessage.info('用户名或密码过长！')
            }else if(result?.msg === "用户已存在"){
                ElMessage.info('用户已存在！')
            }else if(result?.msg === "请输入有效信息"){
                ElMessage.info('请输入有效信息！')
            }else{
                ElMessage.error('添加失败，请稍后再试！')
            }
        }catch{
            ElMessage.error('添加失败，请稍后再试！')
        }
    }else if(title == '编辑'){
        submitData.userId = editData.userId;
        // submitData.createTime = editData.createTime;
        // submitData.updateTime = nowTime;
        // console.log("请求路由：/user/miseruser/update")
        // console.log(submitData)
        try{
            // console.log(store.state.userInfo.userId)
            const result = await post('miseruser/updateUser',submitData)
            if (result?.msg === "success") {
                ElMessage.success('更新成功！')
                fun();
                if(submitData.userId == store.state.userInfo.userId){
                    ElMessage.info("需要重新登录！");
                    sessionStorage.removeItem('isLogin')
                    sessionStorage.removeItem('userInfo')
                    router.replace({ name: 'LoginView'})
                }
            }else if(result?.msg === "用户名或密码过长"){
                ElMessage.info('用户名或密码过长！')
            }else if(result?.msg === "用户名已存在"){
                ElMessage.info('用户名已存在！')
            }else if(result?.msg === "请输入有效信息"){
                ElMessage.info('请输入有效信息！')
            }else{
                ElMessage.error('更新失败，请稍后再试！')
            }
        }catch{
            ElMessage.error('更新失败，请稍后再试！')
        }
    }
};
// 删除用户函数
const handleDetele = async(deleteIdList,fun)=>{
    // console.log("请求路由：/user/miseruser/delete")
    // console.log(deleteIdList)
    try{
        const result = await post('miseruser/deleteUser',deleteIdList)
        if (result?.msg === "success") {
            ElMessage.success('删除成功！')
            fun();
        }else{
            ElMessage.error('删除失败，请稍后再试！')
        }
    }catch{
        ElMessage.error('删除失败，请稍后再试！')
    }
};
// 删除单个
const singleDelete = async (index,row,fun)=>{
    let deleteIdList = []
    deleteIdList.push(row.userId)
    // console.log(deleteIdList)
    ElMessageBox.confirm('确定要删除吗?', '删除', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
    }).then(()=>{
        handleDetele(deleteIdList,fun)
    }).catch(() => {
        ElMessage.info("已取消删除")
    })
};
//批量删除
const batchDelete = async(sels,fun)=>{
    if(sels.length==0){
        ElMessage.info('请选择需要删除的项！')
    }else{
        let deleteIdList = []
        for(let i = 0;i<sels.length;i++){
            deleteIdList.push(sels[i].userId)
        }
        // console.log(deleteIdList)
        ElMessageBox.confirm('确定要删除吗?', '删除', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
        }).then(()=>{
            handleDetele(deleteIdList,fun)
        }).catch(() => {
            ElMessage.info("已取消删除")
        })
    }
};
// 导出为表格
const handleExport = (userList)=>{
    import('@/utils/exportExcel').then(excel => {
        const res = []
        // excel表示导入的模块对象
        for(let i =0;i<userList.length;i++){
            delete userList[i].id
            res.push(userList[i])
        }
        // const one = res[0] // 返回的数组取第一项
        // const header = Object.keys(one) // 拿对象中的所有的键
        const header = ['用户id','用户名称','用户密码','用户权限','创建时间','更新时间']
        const data = res.map(item => Object.values(item)) //拿到里面的每一个值
        excel.export_json_to_excel({
            header, // 表头 必填
            data, // 具体数据 必填
            filename: 'userList', // 文件名称
            autoWidth: true, // 宽度是否自适应
            bookType: 'xlsx' // 生成的文件类型
        })
    })
}
export { submitForm,singleDelete,batchDelete,handleExport};