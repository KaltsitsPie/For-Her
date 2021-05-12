// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 查看收到的所有评价，openid不填默认是自己的
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = ""
  var errCode = 0
  var errMsg = ""
  var user_detail = {}
  var evaluation_array = []

  if (event.openid == undefined) {
    openid = wxContext.OPENID
  }
  else {
    openid = event.openid
  }

  //检查用户类型
  const db = cloud.database()
  const _ = db.command

  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 17
      errMsg = "用户信息获取失败"
    }
    else {
      user_detail = res.data[0]
    }
  })

  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }

  //存放所有order_id
  var evaluation_array = []

  if (user_detail.type == 1) {
    console.log('是客户，正在获取该客户收到的评价')

  //取出集合中记录的总数 start
  var countResult = await db.collection('evaluation_form')
  .where({
    "customer_openid": openid
  })
  .count()
  var total = countResult.total
  console.log("总共有" + total + "条记录")
  //取出集合记录总数 end

  //设置每页最多可以获取多少条记录
  var MAX_LIMIT = 20

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('evaluation_form')
    .where({
      "customer_openid": openid
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('order_id', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      evaluation_array = evaluation_array.concat(res.data)
    })
  }
  console.log(evaluation_array)

  console.log('正在将对方未评价的列表项删除')
  evaluation_array = evaluation_array.filter(function(item) {
       return item.maintain_openid != undefined
  });

  //————————————————体验版——————————————————
  to_add_data = {
    "order_id": "11111111111",
    "customer_content": "评价内容示例，对实际数据无影响",
    "customer_evaluation": 5,
    "customer_openid": openid,
    "customer_url": user_detail.userInfo.avatarUrl,
    "customer_timeString": new Date().format('yyyy-MM-dd h:m:s'),
    "maintain_content": "评价内容示例，对实际数据无影响",
    "maintain_evaluation": 5,
    "maintain_openid": "ow_LC4loxbxM5VENJnsgd27QC9Bo",
    "maintain_url": "https://thirdwx.qlogo.cn/mmopen/vi_32/cu1lTluMCVHmxLiahxkmsubjwCJorVtFKiaicYpfyuoLNdtlrPVB9n2IeArwDDtRKPKpbnavcrWbiaMESmUVeicVaNw/132",
    "maintain_timeString": "2021-5-6 20:30",
    "_id": "1111111111111111111111111"
  }
  evaluation_array.push(to_add_data)
  //——————————————————————————————————————
  
  console.log(evaluation_array)


  }
  else {
    console.log('是修理工，正在获取该修理工收到的评价')
    
  //取出集合中记录的总数 start
  var countResult = await db.collection('evaluation_form')
  .where({
    "maintain_openid": openid
  })
  .count()
  var total = countResult.total
  console.log("总共有" + total + "条记录")
  //取出集合记录总数 end

  //设置每页最多可以获取多少条记录
  var MAX_LIMIT = 20

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('evaluation_form')
    .where({
      "maintain_openid": openid
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('order_id', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      evaluation_array = evaluation_array.concat(res.data)
    })
  }
  console.log(evaluation_array)

  console.log('正在将对方未评价的列表项删除')
  evaluation_array = evaluation_array.filter(function(item) {
       return item.maintain_openid != undefined
  });

    //————————————————体验版——————————————————
    to_add_data = {
      "order_id": "33333333333",
      "customer_content": "评价内容示例，对实际数据无影响",
      "customer_evaluation": 5,
      "customer_openid": "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      "customer_url": "https://thirdwx.qlogo.cn/mmopen/vi_32/5y6cJWjJgL0W27vMEGYb93ZPTFdczWyXdowN1PzXoE7xFYFVc8uK1ss62YBSG5tUvyDeYd96wBUuChsZQfmbMQ/132",
      "customer_timeString": "2021-5-6 20:30",
      "maintain_content": "评价内容示例，对实际数据无影响",
      "maintain_evaluation": 5,
      "maintain_openid": openid,
      "maintain_url": user_detail.userInfo.avatarUrl,
      "maintain_timeString": new Date().format('yyyy-MM-dd h:m:s'),
      "_id": "1111111111111111111111111"
}
    evaluation_array.push(to_add_data)
    //——————————————————————————————————————

  console.log(evaluation_array)

  }

    return {
      "errCode": errCode,
      "errMsg": errMsg,
      "data": evaluation_array
    }
}


Date.prototype.format = function(format) {
  var date = {
         "M+": this.getMonth() + 1,
         "d+": this.getDate(),
         "h+": this.getHours(),
         "m+": this.getMinutes(),
         "s+": this.getSeconds(),
         "q+": Math.floor((this.getMonth() + 3) / 3),
         "S+": this.getMilliseconds()
  };
  if (/(y+)/i.test(format)) {
         format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
  }
  for (var k in date) {
         if (new RegExp("(" + k + ")").test(format)) {
                format = format.replace(RegExp.$1, RegExp.$1.length == 1
                       ? date[k] : ("00" + date[k]).substr(("" + date[k]).length));
         }
  }
  return format;
}