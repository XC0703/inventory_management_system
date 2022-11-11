import {post} from '../../utils/request';
import { ElMessage,ElMessageBox } from "element-plus";
// 删除物品函数
const handleDetele = async(deleteIdList,fun)=>{
    console.log(deleteIdList)
    const result = post('/ware/miserware/delete',deleteIdList)
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
    deleteIdList.push(row.wareId)
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
            deleteIdList.push(sels[i].wareId)
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

export {singleDelete,batchDelete};