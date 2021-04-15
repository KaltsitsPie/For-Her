// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 函数内部调用
 * @param {*} event 
 *  {
        "nickName": nickName,
        "avatarUrl": avatarUrl
      
 */
exports.main = async (event, context) => {
  console.log(event)
  // var openid = event.openid
  //是否新用户
  var is_new = false
  var result = {}
  var user_detail = {}
  var errCode = 0
  var errMsg = ''
  const openid = cloud.getWXContext().OPENID
  var userid = '12'

  console.log('将生成access_token')
  // const access_token = await cloud.callFunction({
  //   name: 'get_access_token',
  //   data: {
  //     "key": "value"
  //   }
  // })
  // console.log("登录时token=")
  // console.log(access_token)

  const res = await cloud.callFunction({
    name: 'get_access_token',
    data: {
      "openid": openid
    }
  })
  let access_token = res.result;
  console.log(access_token)

  //检查参数是否完整
  if (event.nickName == undefined || event.avatarUrl == undefined) {
    errCode = 1
    errMsg = "缺少必要参数"
    console.log("缺少必要参数，登录失败")
    result = {
      "errCode": errCode,
      "errMsg": errMsg
    }
    return result
  }

  //实例化数据库连接并指定环境
  const db = cloud.database()
  console.log("数据库连接成功")

  //检查是否新用户
   const countResult = await db.collection('user_detail')
    .where({
        "openid": openid
      })
    .count()
    const total = countResult.total
    console.log("总共有" + total + "条记录")
    if (total == 0) {
      is_new = true
    }

  //如果是新用户，新增记录
  if (is_new) {
    console.log("该用户是新用户，准备新增记录")
    //需要添加的数据
    to_add_data = {
      "openid": openid,
      "userInfo": {
        "nickName": event.nickName,
        "avatarUrl": event.avatarUrl,
        "openid": openid
      },
      "is_black": false,
      "is_manager": false,
      "type": 1,
      "order_quanity": 0,
      "evaluation_aver": 0,
      "is_bail": true
    }
  
      //异步调用api，往user-info集合中添加数据
      await db.collection('user_detail')
      .add({
        data: to_add_data
      })
      .then(res => {
        console.log(res)
        console.log("user_detail新增记录成功")
      })
  }
  //不是新用户，更新用户信息
  else {
    console.log("用户头像url将更新为" + event.avatarUrl)
    await db.collection('user_detail')
    .where({
      "openid": openid
    })
    .get()
    .then( res => {
      userid = res.data[0]._id
    })
    const _ = db.command
    await db.collection('user_detail')
    .doc(userid)
    .update({
      data: {
        userInfo: _.set({
          nickName: event.nickName,
          avatarUrl: event.avatarUrl,
          open_id: cloud.getWXContext().OPENID
        })
      }
    })
    .then(res => {
      console.log("更新用户信息成功")
      console.log(res)
    })
  }
  
  //根据openid查询，返回
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("登录成功，将返回user_detail信息")
     errCode = 0
     user_detail = res.data[0]
   }
   else {
    console.log("登录失败")
    errCode = 2
    errMsg = "新增用户失败，请重试"
   }
 })

 if (errCode != 0) {
   return {
    "errCode": errCode,
    "errMsg": errMsg
   }
 }
 else {
  //  console.log('将生成access_token')
  //  const access_token = await cloud.callFunction({
  //    name: 'get_access_token',
  //    data: {
  //      a: 1
  //    }
  //  })
  //  console.log("登录时token=")
  //  console.log(access_token)
   if (is_new) {
     return {
       "errCode": 0,
       "errMsg": "",
       "data": {
         "is_new": true,
         "user_detail": user_detail
       }
     }
   }
   else {
    return {
      "errCode": 0,
      "errMsg": "",
      "data": {
        "is_new": false,
        "user_detail": user_detail
      }
    }
   }
 }
// return result

}