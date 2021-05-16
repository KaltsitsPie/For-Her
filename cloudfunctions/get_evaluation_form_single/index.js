// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 获取单个评价，必要参数是order_id
 * @param {*} event 
 * @param {*} context 
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var errCode = 0
  var errMsg = ""
  var evaluation_form = {}
  var user_detail = {}

  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }
  
  //查user_detail，取得用户的avatarUrl
  //实例化数据库连接并指定环境
  const db = cloud.database()

  //————————————————体验版————————————————————
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


if (event.order_id == "11111111111") {
  return {
    "errCode": 0,
    "errMsg": "",
    "data": {
      "order_id": event.order_id,
      "customer_content": "评价内容示例，仅作展示UI用，不可进行修改",
      "customer_evaluation": 5,
      "customer_openid": openid,
      "customer_url": user_detail.userInfo.avatarUrl,
      "customer_timeString": new Date().format('yyyy-MM-dd h:m:s').toString() + "(仅展示)",
      "maintain_content": "评价内容示例，仅作展示UI用，不可进行修改",
      "maintain_evaluation": 5,
      "maintain_openid": "ow_LC4loxbxM5VENJnsgd27QC9Bo",
      "maintain_url": "https://thirdwx.qlogo.cn/mmopen/vi_32/cu1lTluMCVHmxLiahxkmsubjwCJorVtFKiaicYpfyuoLNdtlrPVB9n2IeArwDDtRKPKpbnavcrWbiaMESmUVeicVaNw/132",
      "maintain_timeString": "2021-5-6 20:30" + "(仅展示)",
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
      "customer_content": "评价内容示例，仅作展示UI用，不可进行修改",
      "customer_evaluation": 5,
      "customer_openid": "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      "customer_url": "https://thirdwx.qlogo.cn/mmopen/vi_32/5y6cJWjJgL0W27vMEGYb93ZPTFdczWyXdowN1PzXoE7xFYFVc8uK1ss62YBSG5tUvyDeYd96wBUuChsZQfmbMQ/132",
      "customer_timeString": "2021-5-6 20:30" + "(仅展示)",
      "maintain_content": "评价内容示例，仅作展示UI用，不可进行修改",
      "maintain_evaluation": 5,
      "maintain_openid": openid,
      "maintain_url": user_detail.userInfo.avatarUrl,
      "maintain_timeString": new Date().format('yyyy-MM-dd h:m:s').toString() + "(仅展示)",
      "_id": "1111111111111111111111111"
}
  }
}
//—————————————————————————————————————————

  await db.collection('evaluation_form')
  .where({
    "order_id": "" + event.order_id
  })
  .get()
  .then(res => {
    console.log('res=', res)
    if (res.data.length != 1) {
      errCode = 8
      errMsg = "获取评价失败，请检查参数后重试"
    }
    else {
      evaluation_form = res.data[0]
    }
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