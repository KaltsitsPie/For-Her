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

  //修改订单状态，并匿名化订单的地址及联系方式信息
  db.collection('order_form')
  .where({
    "order_id": "" + event.order_id,
  })
  .update({
    data: {
      order_stat: 10,
      adress_simple: "***订单结束，地址已删除***",
      adress_compl: "***订单结束，地址已删除***",
      phone: "***订单结束，联系方式已删除***"
    }
  })
  .then(res => {
    if (res.stats.updated == 0) {
      errCode = 3
      errMsg = "订单信息获取失败，请检查参数"
    }
  })

  //拉黑或不拉黑该用户，将用户is_bail置false
  db.collection('user_detail')
  .where({
    "openid": "" + event.to_openid
  })
  .update({
    data: {
      is_black: event.is_black,
      is_bail: false
    }
  })

  //——————————————————体验版————————————————

  //——————————————赔偿保证金—————————————————

  //————————————————————————————————————————

  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}