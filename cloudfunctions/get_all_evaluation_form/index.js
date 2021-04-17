// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 查看收到的所有评价，openid不填默认是自己的
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = 0
  var errCode = 0
  var errMsg = ""
  var user_detail = {}
  var evaluation_array = []

  if (event.openid == undefined) {
    openid = wxContext.OPENID
  }
  else {
    openid = event.openid
  }

  //检查用户类型
  const db = cloud.database()
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 17
      errMsg = "用户信息获取失败"
    }
    else {
      user_detail = res.data[0]
    }
  })

  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }

  if (user_detail.type == 1) {
    await db.collection('evaluation_form')
    .where({
      "maintain_openid": "" + openid
    })
    .orderBy('order_id', 'desc')
    .get()
    .then(res => {
      console.log('res=', res)
      evaluation_array = res.data
    })
  }
  else {
    await db.collection('evaluation_form')
    .where({
      "customer_openid": "" + openid
    })
    .orderBy('order_id', 'desc')
    .get()
    .then(res => {
      console.log('res=', res)
      evaluation_array = res.data
    })
  }

    return {
      "errCode": errCode,
      "errMsg": errMsg,
      "data": evaluation_array
    }
}