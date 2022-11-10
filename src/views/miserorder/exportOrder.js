// 导出为表格
const handleExport = (orderList)=>{
    import('@/utils/exportExcel').then(excel => {
        // excel表示导入的模块对象
        const res = orderList;
        // const one = res[0] // 返回的数组取第一项
        // const header = Object.keys(one) // 拿对象中的所有的键
        const header = ['订单id','用户id','用户名称','物品id','物品名称','物品数量','创建时间']
        const data = res.map(item => Object.values(item)) //拿到里面的每一个值
        excel.export_json_to_excel({
            header, // 表头 必填
            data, // 具体数据 必填
            filename: 'orderList', // 文件名称
            autoWidth: true, // 宽度是否自适应
            bookType: 'xlsx' // 生成的文件类型
        })
    })
}

export default handleExport;