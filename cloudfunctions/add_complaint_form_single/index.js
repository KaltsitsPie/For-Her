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
  if (event.order_id == undefined || event.complaint_type == undefined || 
      event.complaint_content == undefined || event.photo_array == undefined || 
      event.phone == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //查user_detail，取得用户的type
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

//存放订单信息
var order_form = {}
//检查订单是否存在并且状态为2、3，并且为未申诉状态
console.log(event.order_id)
await db.collection('order_form')
.where({
  "order_id": "" + event.order_id,
  "order_stat": _.or(_.eq(2), _.eq(3)),
  "is_complaint": false
})
.get()
.then(res => {
  if (res.data.length != 1) {
    errCode = 2
    errMsg = "订单状态异常，请检查后重试"
  }
  else {
    order_form = res.data[0]
  }
})

if (errCode != 0) {
  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}

var to_add_data = {}
var complaint_form = {}

//新增申诉
  if (user_detail.type == 1) {
    to_add_data = {
      order_id: "" + event.order_id,
      timestamp: new Date(),
      from_openid: openid,
      to_openid: order_form.maintain_openid,
      complaint_type: event.complaint_type,
      complaint_content: event.complaint_content,
      photo_array: event.photo_array,
      phone: event.phone,
      complaint_stat: 0
    }
  }
  else {
    to_add_data = {
      order_id: "" + event.order_id,
      timestamp: new Date(),
      from_openid: openid,
      to_openid: order_form.customer_openid,
      complaint_type: event.complaint_type,
      complaint_content: event.complaint_content,
      photo_array: event.photo_array,
      phone: event.phone,
      complaint_stat: 0
    }
  }
    //上传到数据库complaint_form
    await db.collection('complaint_form')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log(res)
      console.log("complaint_form新增记录成功")
    })


    //更新order_form表
    await db.collection('order_form')
    .where({
      "order_id": "" + event.order_id
    })
    .update({
      data: {
        is_complaint: true,
        order_stat: 8
      }
    })
    .then(res => {
      console.log('order_form更新结果', res)
      if (res.stats.updated != 1) {
        errCode = 9
        errMsg = "更新order_form失败，请重试"
      }
    })


    //读新的complaint_form
    await db.collection('complaint_form')
    .where({
      "order_id": "" + event.order_id
    })
    .get()
    .then(res => {
      if (res.data.length == 0) {
        errCode = 5
        errMsg = "上传失败，请重试"
      }
      else {
        complaint_form = res.data[0]
      }
    })
    
return {
  "errCode": errCode,
  "errMsg": errMsg,
  "data": complaint_form
}

}