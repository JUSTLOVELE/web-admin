function formatDate(date, fmt) {

    let ret;
    const opt = {
        "y+": date.getFullYear().toString(),        // 年
        "M+": (date.getMonth() + 1).toString(),     // 月
        "d+": date.getDate().toString(),            // 日
        "H+": date.getHours().toString(),           // 时
        "m+": date.getMinutes().toString(),         // 分
        "s+": date.getSeconds().toString()          // 秒
        // 有其他格式化字符需求可以继续添加，必须转化成字符串
    };
    for (let k in opt) {
        ret = new RegExp("(" + k + ")").exec(fmt);
        if (ret) {
            fmt = fmt.replace(ret[1], (ret[1].length == 1) ? (opt[k]) : (opt[k].padStart(ret[1].length, "0")))
        };
    };
    return fmt;
}

function handlerDateRange(obj) {

    for(var key in obj) {
        
        var matched = key.match(/(.*)-daterange$/)
        if(matched != null) {
            if(obj[key] != null) {
                if(matched[1] === '') {
                    obj['startTime'] = obj[key][0]
                    obj['endTime'] = obj[key][1]
                } else {
                    obj[matched[1] + 'StartTime'] = obj[key][0]
                    obj[matched[1] + 'EndTime'] = obj[key][1]
                }
                // delete _this.queryObj[key] *不能删除，vue需要追踪这个值的变化
            } else { //搜索条件清空后
                if(matched[1] === '') {
                    obj['startTime'] = ''
                    obj['endTime'] = ''
                } else {
                    obj[matched[1] + 'StartTime'] = ''
                    obj[matched[1] + 'EndTime'] = ''
                }
            }
        }
    }
}