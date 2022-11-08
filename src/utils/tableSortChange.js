import moment from 'moment'

// 自定义表格排序规则
function tableSortChange(column,dataList){
    //获取字段名称和排序类型
    var fieldName = column.prop;
    var sortingType = column.order;
    //如果字段名称为“创建时间”，将“创建时间”转换为时间戳，才能进行大小比较
    if(fieldName=="createTime"){
        dataList.map(item => {
            item.createTime = moment(item.createTime).valueOf();
        });
    }
    //如果字段名称为“更新时间”，将“更新时间”转换为时间戳，才能进行大小比较
    if(fieldName=="updateTime"){
        dataList.map(item => {
            item.updateTime = moment(item.updateTime).valueOf();
        });
    }
    //按照降序排序
    if(sortingType == "descending"){
        dataList = dataList.sort((a, b) => b[fieldName] - a[fieldName]);
    }
    //按照升序排序
    else{
        dataList = dataList.sort((a, b) => a[fieldName] - b[fieldName]);
    }
    //如果字段名称为“创建时间”，将时间戳格式的“创建时间”再转换为时间格式
    if(fieldName=="createTime"){
        dataList.map(item => {
            item.createTime = moment(item.createTime).format(
                "YYYY-MM-DD HH:mm:ss"
            );
        });
    }
    //如果字段名称为“更新时间”，将时间戳格式的“更新时间”再转换为时间格式
    if(fieldName=="updateTime"){
        dataList.map(item => {
            item.updateTime = moment(item.updateTime).format(
                "YYYY-MM-DD HH:mm:ss"
            );
        });
    }

    return dataList
}

export default tableSortChange;