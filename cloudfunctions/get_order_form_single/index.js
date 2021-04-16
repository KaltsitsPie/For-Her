// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 查询单个订单
 * 必要参数是order_id
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var order_form = {}
  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  const db = cloud.database()
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回order_id信息")
     errCode = 0
     order_form = res.data[0]
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

 //检查订单状态，若现在时间超过了订单开始时间，修改已接单订单为进行中，修改未接单订单为已过时
 if (order_form.start_timestamp < new Date()) {
   console.log('订单已过时，正在检查状态')
   if (order_form.order_stat == 0) {
     console.log('未接单，修改订单状态为已过时')
       //修改数据
    await db.collection('order_form')
    .where({
      "order_id": order_form.order_id
    })
    .update({
      data: {
          "order_stat": 11
      }
    })
    .then(res => {
      console.log("操作成功")
      //输出修改了多少条数据
      console.log(res.stats.updated)
      if (res.stats.updated == 0) {
        errCode = 2
        errMsg = "修改失败，该用户可能不存在"
      }
      // else {
      //   updated_num = res.stats.updated
      // }
    })
   }
   else if (order_form.order_stat == 1) {
     console.log('已接单，修改订单为进行中')
    await db.collection('order_form')
    .where({
      "order_id": order_form.order_id
    })
    .update({
      data: {
          "order_stat": 2
      }
    })
    .then(res => {
      console.log("操作成功")
      //输出修改了多少条数据
      console.log(res.stats.updated)
      if (res.stats.updated == 0) {
        errCode = 2
        errMsg = "修改失败，该用户可能不存在"
      }
      // else {
      //   updated_num = res.stats.updated
      // }
    })
   }
   }
   else {
    console.log('订单未过时，将返回')
   }
 
   
  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": order_form
  }
}