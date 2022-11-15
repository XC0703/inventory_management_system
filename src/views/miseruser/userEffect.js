import {get,post} from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
import {getNowTime} from '../../utils/timeEffect'
// 获取用户列表（包括全部与单个两种情况）
const getUser = (query)=>{
    let isReq = false;//是否请求成功的标志
    const getUserByQuery = async (query)=>{
        let tempArr = [];
        let userId = query;
        if(userId!=''){
            console.log("请求路由：/user/miseruser/info")
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
            console.log("请求路由：/user/miseruser/list")
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
    submitData.userPower = editData.userPower;
    const nowTime = getNowTime();
    // console.log(nowTime)
    // 添加
    if(title == '添加'){
        submitData.userId = '后端处理userId'
        submitData.createTime = nowTime;
        submitData.updateTime = nowTime;
        // console.log("添加")
        console.log("请求路由：/user/miseruser/save")
        console.log(submitData)
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
        submitData.userId = editData.userId;
        submitData.createTime = editData.createTime;
        submitData.updateTime = nowTime;
        // console.log('编辑')
        console.log("请求路由：/user/miseruser/update")
        console.log(submitData)
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
// 删除用户函数
const handleDetele = async(deleteIdList,fun)=>{
    console.log("请求路由：/user/miseruser/delete")
    console.log(deleteIdList)
    const result = post('/user/miseruser/delete',deleteIdList)
    .then(()=>{
        // console.log(result)
        if (result?.msg === "success") {
            ElMessage.success('删除成功！')
            fun();
        }else{
            ElMessage.error('删除失败，请稍后再试！')
        }
    })
    .catch(()=>{
        ElMessage.error('删除失败，请稍后再试！')
    })
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
        ElMessage.info("'已取消删除'")
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
            ElMessage.info("'已取消删除'")
        })
    }
};
// 导出为表格
const handleExport = (userList)=>{
    import('@/utils/exportExcel').then(excel => {
        // excel表示导入的模块对象
        const res = userList;
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
export { getUser,submitForm,singleDelete,batchDelete,handleExport};