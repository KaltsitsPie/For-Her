// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 用户确认订单，order_stat = 3时修改为4
 * 必要参数是订单编号order_id
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  var errCode = 0
  var errMsg = ""
  var order_form = {}

  //检查参数是否完整
  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数，请重试"
    }
  }

  const db = cloud.database()

  //检查订单是否存在及订单状态
  const countResult = await db.collection('order_form')
  .where({
    "order_id": event.order_id,
    "order_stat": 3
  })
  .count()
  const total = countResult.total
  console.log("总共有" + total + "条记录")
  if (total != 1) {
    return {
      "errCode": 11,
      "errMsg": "订单不存在或订单状态错误，请重试"
    }
  }

    //修改数据
    await db.collection('order_form')
    .where({
      "order_id": event.order_id
    })
    .update({
      data: {
        order_stat: 4
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
        console.log("修改成功，order_form已经被修改为")
        console.log(res.data[0])
        order_form = res.data[0]
      }
      else {
        errCode = 3
        errMsg = "修改失败"
      }
    })

    /* ——————————留给将来发起收款start ——————————*/
    /* ——————————order_form.price   ——————————*/
    /* ——————————留给将来发起收款start ——————————*/
    
  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": order_form
  }
}