// 获取当前时间
const getNowTime = () =>{
    let dateTime
    let yy = new Date().getFullYear()
    let mm = new Date().getMonth() + 1
    let dd = new Date().getDate()
    let hh = new Date().getHours()
    let mf = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes():new Date().getMinutes()
    let ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds():new Date().getSeconds()
    dateTime = yy + '-' + mm + '-' + dd + ' ' + hh + ':' + mf + ':' + ss
    return dateTime
}

// 将后端传过来的时间转换格式
const formatDate = (oldDate)=>{
    // 方式1 转换为'yyyy-MM-dd HH:mm:ss'
    function add0(num) { return num < 10 ? '0' + num : num } // 个位数的值在前面补0
    const date = new Date(oldDate)
    const Y = date.getFullYear()
    const M = date.getMonth() + 1
    const D = date.getDate()
    const h = date.getHours()
    const m = date.getMinutes()
    const s = date.getSeconds()

    const dateString = Y + '-' + add0(M) + '-' + add0(D) + ' ' + add0(h) + ':' + add0(m) + ':' + add0(s)
    return dateString

    // 方式2 转换为'yyyy/MM/dd HH:mm:ss'
    // return new Date(oldDate).toLocaleString()
}

export {getNowTime,formatDate};