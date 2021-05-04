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
  console.log(complaint_array)

  return {
    "errCode": 0,
    "errMsg": "",
    "data": {
      "complaint_array": complaint_array
    }
    
  }

}