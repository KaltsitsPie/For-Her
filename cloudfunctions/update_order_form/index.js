// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var errCode = 0
  var errMsg = ""
  var updated_num = 0
  var order_form = {}

  //检查参数是否完整
  console.log(event)
  if (event.to_update_data == undefined || event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //实例化数据库连接并指定环境
  const db = cloud.database()
  console.log("数据库连接成功")

  //修改数据
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .update({
    data: event.to_update_data
  })
  .then(res => {
    console.log("操作成功")
    //输出修改了多少条数据
    console.log(res.stats.updated)
    if (res.stats.updated == 0) {
      errCode = 2
      errMsg = "修改失败，该用户可能不存在"
    }
    else {
      updated_num = res.stats.updated
    }
    
  })

  console.log("查询修改结果...")
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .get()
  .then(res => {
    console.log(res)
    if (res.data.length > 0) {
      errCode = 0
      errMsg = ""
      console.log("修改成功，order_form已经被修改为")
      console.log(res.data[0])
      order_form = res.data[0]
    }
    else {
      errCode = 3
      errMsg = "修改失败"
    }
  })

  result = {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": {
      "updated_num": updated_num,
      "order_form": order_form
    }
  }
  return result

  
}