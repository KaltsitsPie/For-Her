// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 管理员同意申诉，必要参数是order_id, is_black, to_openid
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var errCode = 0
  var errMsg = ""

  if (event.order_id == undefined || event.is_black == undefined || event.to_openid == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  const db = cloud.database()
  const _ = db.command

  //修改申诉状态
  db.collection('complaint_form')
  .where({
    "order_id": "" + event.order_id
  })
  .update({
    data: {
      complaint_stat: 2
    }
  })
  .then(res => {
    if (res.stats.updated == 0) {
      errCode = 2
      errMsg = "修改申诉状态失败，请检查参数"
    }
  })

  //修改订单状态
  db.collection('order_form')
  .where({
    "order_id": "" + event.order_id,
  })
  .update({
    data: {
      order_stat: 10
    }
  })
  .then(res => {
    if (res.stats.updated == 0) {
      errCode = 3
      errMsg = "订单信息获取失败，请检查参数"
    }
  })

  //拉黑或用户
  db.collection('user_detail')
  .where({
    "openid": "" + event.to_openid
  })
  .update({
    data: {
      is_black: event.is_black
    }
  })

  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}