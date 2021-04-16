// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 用户获取进行中订单
 * 订单状态为 1、2、3、4、5、6、8
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  
  //刷新order_form
  // await cloud.callFunction({
  //   name: 'check_order_stat_with_time',
  //   data: {}
  // })

  //实例化数据库
  const db = cloud.database()
  const _ = db.command

  //取出集合中记录的总数 start
  const countResult = await db.collection('order_form')
  .where({
    "customer_openid": openid,
    "order_stat": _.or(_.eq(1), _.eq(2), _.eq(3), _.eq(4), _.eq(5), _.eq(6), _.eq(8))
  })
  .count()
  const total = countResult.total
  console.log("总共有" + total + "条记录")
  //取出集合记录总数 end

  //设置每页最多可以获取多少条记录
  const MAX_LIMIT = 20

  //计算总共需要分多少页（向上取整）
  const total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")

  //定义一个数组接收汇总每次查询的记录
  var ongoing_orders_array = []

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('order_form')
    .where({
      "customer_openid": openid,
      "order_stat": _.or(_.eq(1), _.eq(2), _.eq(3), _.eq(4), _.eq(5), _.eq(6), _.eq(8))
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('start_timestamp', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      ongoing_orders_array = ongoing_orders_array.concat(res.data)
    })
  }
  console.log(ongoing_orders_array)

  return {
    "ongoing_orders_array": ongoing_orders_array
  }
}