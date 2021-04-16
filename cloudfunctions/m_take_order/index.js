// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 修理工接单
 * 参数是event.order_id
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var result = {}
  var order_form = {}

  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "参数不完整，请重试"
    }
  }

  //检查该用户是否被拉黑
  console.log('正在检查用户类型')
  const db = cloud.database()
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功")
    console.log(res.data[0])
    if (res.data[0].is_black == true) {
      console.log('用户已被拉黑')
      errCode = 99
      errMsg = "已被拉黑，操作失败"
    }
    if (res.data[0].type == 1) {
      console.log('用户不是修理工')
      errCode = 8
      errMsg = "用户类型检查失败"
    }
   }
   else {
    console.log("查询失败")
    errCode = 2
    errMsg = "找不到该用户，请先登录"
   }
 })

  if (errCode != 0) {
    console.log('出错返回')
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  } 

  //检查order_id是否存在
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回order_id信息")
     result = res.data[0]
     if (result.order_stat != 0) {
       errCode = 3
       errMsg = "接单失败，该订单不是未接单状态"
     }
   }
   else {
    console.log("查询失败")
    errCode = 2
    errMsg = "该订单不存在，请检查订单id是否正确"
   }
 })
 
  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }

  console.log('订单查询成功，准备修改订单状态')
  console.log(result)

  //修改数据
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .update({
    data: {
      "maintain_openid": openid,
      "order_stat": 1
    }
  })
  .then(res => {
    console.log("操作成功")
    //输出修改了多少条数据
    console.log('修改了' + res.stats.updated + '条数据')
    if (res.stats.updated == 0) {
      errCode = 2
      errMsg = "修改失败，该订单可能不存在"
    }
  })
  //取更改信息之后的order_form
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .get()
  .then(res => {
    if (res.data.length == 0) {
      errCode = 10
      errMsg = "接单失败，请重试"
    }
    else {
      order_form = res.data[0]
    }
  })

  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": order_form
  }


}