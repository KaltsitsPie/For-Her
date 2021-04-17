// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 获取用户全部订单
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var notstart_orders_array = []
  var ongoing_orders_array = []
  var finished_orders_array = []
  var all_orders_array = []

  //刷新order_form
  await cloud.callFunction({
    name: 'check_order_stat_with_time',
    data: {
      "openid": openid
    }
  })

  console.log('开始获取订单列表')

  //未开始订单
  const r1 = await cloud.callFunction({
    name: 'm_get_notstart_orders',
    data: {
      "openid": openid
    }
  })
  notstart_orders_array = r1.result.notstart_orders_array
  console.log('notstart_orders_array', notstart_orders_array)

  //进行中订单
  const r2 = await cloud.callFunction({
    name: 'm_get_ongoing_orders',
    data: {
      "openid": openid
    }
  })
  ongoing_orders_array = r2.result.ongoing_orders_array
  console.log('ongoing_orders_array', ongoing_orders_array)

  //已完成订单
  const r3 = await cloud.callFunction({
    name: 'm_get_finished_orders',
    data: {
      "openid": openid
    }
  })
  finished_orders_array = r3.result.finished_orders_array
  console.log('finished_orders_array', finished_orders_array)

  //连接数组
  all_orders_array = notstart_orders_array.concat(ongoing_orders_array).concat(finished_orders_array)
  console.log('排序前', all_orders_array)
  //对数组进行排序
  all_orders_array = all_orders_array.sort((a, b) => b.order_id - a.order_id)
  console.log('排序后', all_orders_array)

  return {
    "errCode": 0,
    "data": {
      "all_orders_array": all_orders_array,
      "notstart_orders_array": notstart_orders_array,
      "ongoing_orders_array": ongoing_orders_array,
      "finished_orders_array": finished_orders_array
    }
  }
}

  
  