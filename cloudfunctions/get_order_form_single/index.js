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

  //更新一下订单状态
  await cloud.callFunction({
    name: 'check_order_stat_with_time',
    data: {}
  })
  
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
 
   
  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": order_form
  }
}