// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 无必要参数，获取订单列表前调用，会对订单状态进行检查，把开始时间已过的订单的状态改为进行中或已过时
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  //实例化数据库连接
  const db = cloud.database()
  //实例化指令查询
  const _ = db.command

  //查找过了开始时间，订单状态为未接单的订单，修改状态为已过时
  await db.collection('order_form')
  .where({
    "start_timestamp": _.lt(new Date()),
    "order_stat": 0
  })
  .update({
    data: {
      "order_stat": 11
    }
  })
  .then( res => {
    console.log('修改了' + res.stats.updated + '条数据，状态更新为已过时')
  })

  //查找过了开始时间，订单状态为已接单的订单，修改状态为进行中
  await db.collection('order_form')
  .where({
    "start_timestamp": _.lt(new Date()),
    "order_stat": 1
  })
  .update({
    data: {
      "order_stat": 2
    }
  })
  .then( res => {
    console.log('修改了' + res.stats.updated + '条数据，状态更新为进行中')
  })



  return true
}