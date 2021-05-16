// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var complaint_array = []

  const db = cloud.database()


  //取出集合中记录的总数 start
  const countResult = await db.collection('complaint_form')
  .where({
    "from_openid": openid
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


  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('complaint_form')
    .where({
      "from_openid": openid
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('timestamp', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      complaint_array = complaint_array.concat(res.data)
    })
  }

  //——————————————————————体验版————————————————
  to_add_data = {
    "complaint_content": "申诉示例，仅作展示UI用，无法进行更改",
    "complaint_stat": 0,
    "complaint_type": 0,
    "from_openid": openid,
    "order_id": "22222222222",
    "phone": "12345678901",
    "photo_array": [],
    "timestamp": new Date('2021-5-7 10:30'),
    "timeString": "2021-5-7 10:30(仅展示)",
    "to_openid": "ow_LC4loxbxM5VENJnsgd27QC9Bo",
    "_id": "222222222222222222222"
  }
  complaint_array.push(to_add_data)

  //————————————————————————————————————————————
  console.log(complaint_array)

  return {
    "errCode": 0,
    "errMsg": "",
    "data": {
      "complaint_array": complaint_array
    }
    
  }

}