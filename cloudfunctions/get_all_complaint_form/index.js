// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 管理员处理申诉信息
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var errCode = 0
  var errMsg = ""
  var user_detail = {}

  const db = cloud.database()
  const _ = db.command

  //检查用户类型
  db.collection('user_detail')
  .where({
    "openid": openid,
    "is_manager": true
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 2
      errMsg = "用户类型检查失败，请先登录"
    }
    else {
      user_detail = res.data[0]
    }
  })

  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }

  //定义每页做多可以取的记录数量
  const MAX_LIMIT = 20

  var pending_array = []
  //取未处理申诉列表

    //取出集合中记录的总数 start
    var countResult = await db.collection('complaint_form')
    .where({
      complaint_stat: 0
    })
    .count()
    var total = countResult.total
    console.log("总共有" + total + "条未处理申诉记录")
    //取出集合记录总数 end

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")


  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('complaint_form')
    .where({
      complaint_stat: 0
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('timestamp', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      pending_array = pending_array.concat(res.data)
    })
  }
  console.log(pending_array)

  var solved_array = []
  //取已处理申诉列表

    //取出集合中记录的总数 start
    var countResult = await db.collection('complaint_form')
    .where({
      complaint_stat: _.or(_.eq(1), _.eq(2))
    })
    .count()
    var total = countResult.total
    console.log("总共有" + total + "条未处理申诉记录")
    //取出集合记录总数 end

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")


  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('complaint_form')
    .where({
      complaint_stat: _.or(_.eq(1), _.eq(2))
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('timestamp', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      solved_array = solved_array.concat(res.data)
    })
  }
  console.log(solved_array)


  const complaint_array = pending_array.concat(solved_array)


  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": complaint_array
  }
}