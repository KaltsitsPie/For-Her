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
    if (res.data[0].type != 2) {
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
     errCode = 0
     result = res.data[0]
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

  console.log('订单查询成功')
  console.log(result)


  return {
    errCode: errCode,
    errMsg: errMsg
  }


}