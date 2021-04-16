// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 检查用户是否被拉黑，请求参数的openid可不填，返回值中包含is_black字段
 */
exports.main = async (event, context) => {
  var openid = event.openid == undefined ? cloud.getWXContext().OPENID : event.openid
  const open_id = openid.toString()

  // var result = {}
  var is_black = false
  var type = 1
  // var errCode = 0
  // var errMsg = ""

  console.log('开始查找数据库')
  console.log(open_id)

  const db = cloud.database()
  await db.collection('user_detail')
  .where({
    "openid": openid
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回user_detail信息")
    //  errCode = 0
     is_black = res.data[0].is_black
     type = res.data[0].type
    
   }
   else {
    console.log("查询失败")
    // errCode = 2
    // errMsg = "找不到该用户，请先登录"
   }
 })


 return {
   "openid": openid,
   "is_black": is_black,
   "type": type
}
  

  
}