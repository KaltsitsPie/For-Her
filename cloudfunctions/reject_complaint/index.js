// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 管理员驳回申诉，必要参数是order_id
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var errCode = 0
  var errMsg = ""

  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }
  const db = cloud.database()

  //修改申诉状态
  db.collection('complaint_form')
  .where({
    "order_id": "" + event.order_id
  })
  .update({
    data: {
      "complaint_stat": 1
    }
  })
  .then(res => {
    if (res.stats.updated != 1) {
      errCode = 2
      errMsg = "修改申诉状态失败"
    }
  })
  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }

  //取订单信息
  var order_form = {}
  db.collection('order_form')
  .where({
    "order_id": "" + event.order_id
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 3
      errMsg = "获取订单信息失败，请检查参数"
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

  //恢复原本订单状态
  const order_stat = order_form.price == undefined ? 2 : 3
  db.collection('order_form')
  .where({
    "order_id": "" + event.order_id
  })
  .update({
    data: {
      order_stat: order_stat
    }
  })

  return {
    "errCode": errCode,
    "errMsg": errMsg
  }
}