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

  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }
  const db = cloud.database()

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