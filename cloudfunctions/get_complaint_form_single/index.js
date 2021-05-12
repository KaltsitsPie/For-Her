// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 获取单个申诉，必要参数是order_id 
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var complaint_form = {}
  var errCode = 0
  var errMsg = ""

  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //——————————————————————体验版————————————————
  if (event.order_id == "11111111111") {
    return {
      "errCode": errCode,
      "errMsg": errMsg,
      "data": {
        "complaint_content": "申诉示例，对实际数据无影响",
        "complaint_stat": 0,
        "complaint_type": 0,
        "from_openid": openid,
        "order_id": "11111111111",
        "phone": "12345678901",
        "photo_array": [],
        "timestamp": new Date('2021-5-7 10:30'),
        "timeString": "2021-5-7 10:30",
        "to_openid": "ow_LC4loxbxM5VENJnsgd27QC9Bo",
        "_id": "11111111111111111111"
      }
    }
  }
  //————————————————————————————————————————————

  const db = cloud.database()

  await db.collection('complaint_form')
  .where({
    "order_id": "" + event.order_id,
    "from_openid": openid
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 2,
      errMsg = "申诉异常，请检查参数后重试"
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