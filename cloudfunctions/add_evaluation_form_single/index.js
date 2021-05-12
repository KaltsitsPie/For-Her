// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 添加评价，必要参数是order_id, evaluation, content
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  var user_detail = {}
  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_id == undefined || event.evaluation == undefined || event.content == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //查user_detail，取得用户的avatarUrl
  //实例化数据库连接并指定环境
  const db = cloud.database()
  const _ = db.command
  console.log("数据库连接成功")
  
  //根据openid查询，返回
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回user_detail信息")
     user_detail = res.data[0]
   }
   else {
    console.log("查询失败")
    errCode = 2
    errMsg = "找不到该用户，请先登录"
   }
 })
 if (errCode != 0) {
  return {
   "errCode": errCode,
   "errMsg": errMsg
  }
}

//————————————————体验版————————————————————
if (event.order_id == "11111111111") {
  return {
    "errCode": 0,
    "errMsg": "",
    "data": {
      "order_id": event.order_id,
      "customer_content": event.content,
      "customer_evaluation": parseInt(event.evaluation),
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
  }
}
else if (event.order_id == "33333333333") {
  return {
    "errCode": 0,
    "errMsg": "",
    "data": {
      "order_id": event.order_id,
      "customer_content": "评价内容示例，对实际数据无影响",
      "customer_evaluation": 5,
      "customer_openid": "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      "customer_url": "https://thirdwx.qlogo.cn/mmopen/vi_32/5y6cJWjJgL0W27vMEGYb93ZPTFdczWyXdowN1PzXoE7xFYFVc8uK1ss62YBSG5tUvyDeYd96wBUuChsZQfmbMQ/132",
      "customer_timeString": "2021-5-6 20:30",
      "maintain_content": event.content,
      "maintain_evaluation": parseInt(event.evaluation),
      "maintain_openid": openid,
      "maintain_url": user_detail.userInfo.avatarUrl,
      "maintain_timeString": new Date().format('yyyy-MM-dd h:m:s'),
      "_id": "1111111111111111111111111"
}
  }
}
//—————————————————————————————————————————

//检查订单是否存在并且状态为4、5、6
console.log(event.order_id)
var order = {}

await db.collection('order_form')
.where({
  "order_id": "" + event.order_id,
  "order_stat": _.or(_.eq(4), _.eq(5), _.eq(6))
})
.get()
.then(res => {
 if (res.data.length > 0) {
   console.log("查询成功，将返回order_form信息")
   order = res.data[0]
   console.log('order:', order)
 }
 else {
  console.log("查询失败")
  errCode = 2
  errMsg = "订单状态异常，请检查后重试"
 }
})

if (errCode != 0) {
  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}

var order_stat = 4
//确认添加评价后order_stat的新值
if (order.order_stat == 5 || order.order_stat == 6) {
  order_stat = 7
}
else {
  if (user_detail.type == 1) {
    order_stat = 5
  }
  else {
    order_stat = 6
  }
}

//检查评价是否存在
const r2 = await db.collection('evaluation_form')
.where({
  "order_id": "" + event.order_id,
})
.count()
const t2 = r2.total
console.log("总共有" + t2 + "条记录")

//记录是否为新增评价
const is_new = !(t2 == 1)
var to_add_data = {}
var to_update_data = {}
var evaluation_form = {}

//找不到此评价，新增
if (is_new) {
  if (user_detail.type == 1) {
    to_add_data = {
      order_id: "" + event.order_id,
      customer_openid: openid,
      customer_url: user_detail.userInfo.avatarUrl,
      customer_evaluation: parseInt(event.evaluation),
      customer_content: event.content,
      customer_timeString: new Date().format('yyyy-MM-dd h:m:s'),
      maintain_openid: order.maintain_openid,
      maintain_url: order.maintain_url,
      // maintain_evaluation: 0,
      maintain_content: "",
      maintain_timeString: new Date().format('yyyy-MM-dd h:m:s')
    }
  }
  else {
    to_add_data = {
      order_id: "" + event.order_id,
      customer_openid: order.customer_openid,
      customer_url: order.customer_url,
      // customer_evaluation: 0,
      customer_content: "",
      customer_timeString: new Date().format('yyyy-MM-dd h:m:s'),
      maintain_openid: openid,
      maintain_url: user_detail.userInfo.avatarUrl,
      maintain_evaluation: parseInt(event.evaluation),
      maintain_content: event.content,
      maintain_timeString: new Date().format('yyyy-MM-dd h:m:s')
    }
  }
    //上传到数据库evaluation_form
    await db.collection('evaluation_form')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log(res)
      console.log("evaluation_form新增记录成功")
    })

    //读新的evaluation_form
    await db.collection('evaluation_form')
    .where({
      "order_id": "" + event.order_id
    })
    .get()
    .then(res => {
      if (res.data.length == 0) {
        errCode = 5
        errMsg = "更新评价失败，请重试"
      }
      else {
        evaluation_form = res.data[0]
      }
    })

    if (errCode != 0) {
      return {
        "errCode": errCode,
        "errMsg": errMsg
      }
    }

    //更新order_stat
    await db.collection('order_form')
    .where({
      "order_id": "" + event.order_id
    })
    .update({
      data: {
        order_stat: order_stat
      }
    })
    .then(res => {
      if (res.stats.updated == 0) {
        errCode = 6
        errMsg = "更新订单信息失败，请重试"
      }
    })

}
//找到了此评价，修改
else {
  if (user_detail.type == 1) {
    to_update_data = {
      customer_openid: openid,
      customer_url: user_detail.userInfo.avatarUrl,
      customer_evaluation: parseInt(event.evaluation),
      customer_content: event.content,
      customer_timeString: new Date().format('yyyy-MM-dd h:m:s')
    }
  }
  else {
    to_update_data = {
      maintain_openid: openid,
      maintain_url: user_detail.userInfo.avatarUrl,
      maintain_evaluation: parseInt(event.evaluation),
      maintain_content: event.content,
      maintain_timeString: new Date().format('yyyy-MM-dd h:m:s')
    }
  }

await db.collection('evaluation_form')
.where({
  "order_id": "" + event.order_id
})
.update({
  data: to_update_data
})
.then(res => {
  if (res.stats.updated != 1) {
    errCode = 4
    errMsg = "更新评价时出错，请重试"
  }
})

//取完整的评价
await db.collection('evaluation_form')
.where({
  "order_id": "" + event.order_id
})
.get()
.then(res => {
  if (res.data.length == 0) {
    errCode = 5
    errMsg = "更新评价失败，请重试"
  }
  else {
    evaluation_form = res.data[0]
  }
})

if (errCode != 0) {
  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}

//更新order_stat
await db.collection('order_form')
.where({
  "order_id": "" + event.order_id
})
.update({
  data: {
    order_stat: order_stat
  }
})
.then(res => {
  if (res.stats.updated == 0) {
    errCode = 6
    errMsg = "更新订单信息失败，请重试"
  }
})

}

//更新平均分
cloud.callFunction({
  name: 'update_quanity_and_aver',
})

return {
  "errCode": errCode,
  "errMsg": errMsg,
  "data": evaluation_form
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