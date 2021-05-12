// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 查看收到的所有评价，openid不填默认是自己的
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var openid = ""
  var errCode = 0
  var errMsg = ""
  var user_detail = {}
  var evaluation_array = []

  if (event.openid == undefined) {
    openid = wxContext.OPENID
  }
  else {
    openid = event.openid
  }

  //检查用户类型
  const db = cloud.database()
  const _ = db.command

  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
    if (res.data.length != 1) {
      errCode = 17
      errMsg = "用户信息获取失败"
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

  //存放所有order_id
  var evaluation_array = []

  if (user_detail.type == 1) {
    console.log('是客户，正在获取该客户收到的评价')

  //取出集合中记录的总数 start
  var countResult = await db.collection('evaluation_form')
  .where({
    "customer_openid": openid
  })
  .count()
  var total = countResult.total
  console.log("总共有" + total + "条记录")
  //取出集合记录总数 end

  //设置每页最多可以获取多少条记录
  var MAX_LIMIT = 20

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('evaluation_form')
    .where({
      "customer_openid": openid
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('order_id', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      evaluation_array = evaluation_array.concat(res.data)
    })
  }
  console.log(evaluation_array)

  console.log('正在将对方未评价的列表项删除')
  evaluation_array = evaluation_array.filter(function(item) {
       return item.maintain_openid != undefined
  });

  console.log(evaluation_array)


  }
  else {
    console.log('是修理工，正在获取该修理工收到的评价')
    
  //取出集合中记录的总数 start
  var countResult = await db.collection('evaluation_form')
  .where({
    "maintain_openid": openid
  })
  .count()
  var total = countResult.total
  console.log("总共有" + total + "条记录")
  //取出集合记录总数 end

  //设置每页最多可以获取多少条记录
  var MAX_LIMIT = 20

  //计算总共需要分多少页（向上取整）
  var total_times = Math.ceil(total / MAX_LIMIT)
  console.log("总共可以分" + total_times + "页")

  //每次取出一页
  for (var i = 1; i <= total_times; i++) {
    await db.collection('evaluation_form')
    .where({
      "maintain_openid": openid
    })
    //指定顺序：按照订单开始时间逆序
    .orderBy('order_id', 'desc')
    .skip((i-1) * MAX_LIMIT)
    .get()
    .then(res => {
      console.log('第' + i + '页', res)
      //这一页中的每个数据为res.data[index]
      evaluation_array = evaluation_array.concat(res.data)
    })
  }
  console.log(evaluation_array)

  console.log('正在将对方未评价的列表项删除')
  evaluation_array = evaluation_array.filter(function(item) {
       return item.maintain_openid != undefined
  });

  console.log(evaluation_array)

  }

    return {
      "errCode": errCode,
      "errMsg": errMsg,
      "data": evaluation_array
    }
}