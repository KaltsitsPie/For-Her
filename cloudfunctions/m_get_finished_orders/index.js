// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 修理工获取已完成订单列表，订单状态为7、10
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  //实例化数据库
  const db = cloud.database()
  const _ = db.command

  //取出集合中记录的总数 start
  const countResult = await db.collection('order_form')
  .where({
    "maintain_openid": event.openid,
    "order_stat": _.or(_.eq(4), _.eq(5), _.eq(6), _.eq(7), _.eq(10))
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
  var finished_orders_array = []

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('order_form')
    .where({
      "maintain_openid": event.openid,
      "order_stat": _.or(_.eq(4), _.eq(5), _.eq(6), _.eq(7), _.eq(10))
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('start_timestamp', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      finished_orders_array = finished_orders_array.concat(res.data)
    })
  }
  console.log(finished_orders_array)

  // ————————————————体验版start——————————————————
  to_add_data = {
    _id: "3333333333333333333333",
    order_id: "33333333333",
    customer_openid: "ow_LC4hPCvE4zock1PT6LZFSgV5M",
    maintain_openid: event.openid,
    order_type: 3,
    order_stat: 5,
    is_complaint: false,
    order_content: "问题描述示例，仅作展示UI用，无法进行任何操作",
    photo_num: 1,
    photo_array: ["cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/images/LOGO.png"],
    phone: "00000000000",
    address_simple: "四川省成都市成华区建设北路",
    adress_compli: "电子科技大学沙河校区",
    location: {
      lat: 30.675749,
      lng: 104.100
    },
    date: "2021-5-6",
    start_time: "14:00",
    end_time: "(仅展示)",
    start_timestamp: new Date("2021-5-6 14:00"),
    price: 100
  }
  
  finished_orders_array.push(to_add_data)
  //————————————————体验版end———————————————————————

  return {
    "finished_orders_array": finished_orders_array
  }
}