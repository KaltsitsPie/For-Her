// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 函数内部调用
 * @param {*} event 
 *  {
      "openid": openid    //默认自己的，可以不填
 *  }
 */
exports.main = async (event, context) => {
  console.log(event)
  var user_detail = {}
  var errCode = 0
  var errMsg = ""
  const openid = event.openid == undefined ? cloud.getWXContext().OPENID : event.openid

  //实例化数据库连接并指定环境
  const db = cloud.database()
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
     errCode = 0
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
 else {
  return {
    "errCode": 0,
    "errMsg": "",
    "data": user_detail
  }
   
 }

}