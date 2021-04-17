// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 添加评价，必要参数是order_id, evaluation, content
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID

  var user_detail = {}
  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_id == undefined || event.evaluation == undefined || event.content == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //查user_detail，取得用户的avatarUrl
  //实例化数据库连接并指定环境
  const db = cloud.database()
  const _ = db.command
  console.log("数据库连接成功")
  
  //根据openid查询，返回
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回user_detail信息")
     user_detail = res.data[0]
   }
   else {
    console.log("查询失败")
    errCode = 2
    errMsg = "找不到该用户，请先登录"
   }
 })
 if (errCode != 0) {
  return {
   "errCode": errCode,
   "errMsg": errMsg
  }
}

//检查订单是否存在并且状态为4、5、6
console.log(event.order_id)
const r1 = await db.collection('order_form')
.where({
  "order_id": "" + event.order_id,
  "order_stat": _.or(_.eq(4), _.eq(5), _.eq(6))
})
.count()
const t1 = r1.total
console.log("总共有", r1, "条记录")
if (t1 != 1) {
  return {
    "errCode": 2,
    "errMsg": "订单状态异常，请检查后重试"
  }
}

//检查评价是否存在
const r2 = await db.collection('evaluation_form')
.where({
  "order_id": event.order_id,
})
.count()
const t2 = r2.total
console.log("总共有" + t2 + "条记录")

//记录是否为新增评价
const is_new = !(t2 == 1)
var to_add_data = {}
var to_update_data = {}
var evaluation_form = {}

//找不到此评价，新增
if (is_new) {
  if (user_detail.type == 1) {
    to_add_data = {
      order_id: event.order_id,
      customer_openid: openid,
      customer_url: user_detail.userInfo.avatarUrl,
      customer_evaluation: event.evaluation,
      customer_content: event.content
    }
  }
  else {
    to_add_data = {
      order_id: event.order_id,
      maintain_openid: openid,
      maintain_url: user_detail.userInfo.avatarUrl,
      maintain_evaluation: event.evaluation,
      maintain_content: event.content
    }
  }
    //上传到数据库evaluation_form
    await db.collection('evaluation_form')
    .add({
      data: to_add_data
    })
    .then(res => {
      console.log(res)
      console.log("evaluation_form新增记录成功")
    })

    //读新的evaluation_form
    await db.collection('evaluation_form')
    .where({
      "order_id": event.order_id
    })
    .get()
    .then(res => {
      if (res.data.length == 0) {
        errCode = 5
        errMsg = "更新评价失败，请重试"
      }
      else {
        evaluation_form = res.data[0]
      }
    })

}
//找到了此评价，修改
else {
  if (user_detail.type == 1) {
    to_update_data = {
      customer_openid: openid,
      customer_url: user_detail.userInfo.avatarUrl,
      customer_evaluation: event.evaluation,
      customer_content: event.content
    }
  }
  else {
    to_update_data = {
      maintain_openid: openid,
      maintain_url: user_detail.userInfo.avatarUrl,
      maintain_evaluation: event.evaluation,
      maintain_content: event.content
    }
  }

await db.collection('evaluation_form')
.where({
  "order_id": event.order_id
})
.update({
  data: to_update_data
})
.then(res => {
  if (res.stats.updated != 1) {
    errCode = 4
    errMsg = "更新评价时出错，请重试"
  }
})

//取完整的评价
await db.collection('evaluation_form')
.where({
  "order_id": event.order_id
})
.get()
.then(res => {
  if (res.data.length == 0) {
    errCode = 5
    errMsg = "更新评价失败，请重试"
  }
  else {
    evaluation_form = res.data[0]
  }
})


}

//更新平均分
cloud.callFunction({
  name: 'update_quanity_and_aver',
})

return {
  "errCode": errCode,
  "errMsg": errMsg,
  "data": evaluation_form
}

}