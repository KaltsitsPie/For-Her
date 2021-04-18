// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  let appid = "wx42728c8b4522d4a1"
  let secret = "fee03d96af2081cb9f22c564b03d0174"
  const wxContext = cloud.getWXContext()
  var lat = 0 //北纬
  var lng = 0 //东经
  
  //以下是返回的数据
  var order_form = {}
  var errCode = 0
  var errMsg = ""

  //以下是需要处理的数据
  var geo = null
  // var start_timestamp = null
  var end_timestamp = ""

    //实例化数据库连接并指定环境
    const db = cloud.database()
    console.log("数据库连接成功")


  //检查参数是否完整
  if (//event.customer_info == undefined || 
    event.order_type == undefined ||
      event.order_content == undefined || event.photo_num == undefined ||
      event.photo_array == undefined || event.phone == undefined ||
      event.adress_simple == undefined || event.adress_compli == undefined ||
      event.date == undefined || event.start_time == undefined ||
      event.end_time == undefined) {
        return {
          "errCode": 1,
          "errMsg": "缺少必要参数"
        }
      }

      //检查用户类型（is_black & type）
      console.log('正在检查用户类型')
      await db.collection('user_detail')
      .where({
        "openid": wxContext.OPENID
      })
      .get()
      .then(res => {
       if (res.data.length > 0) {
         console.log("查询成功")
        console.log(res.data[0])
        if (res.data[0].is_black == true) {
          console.log('用户已被拉黑')
          errCode = 99
          errMsg = "已被拉黑，操作失败"
        }
        if (!res.data[0].is_manager && res.data[0].type != 1) {
          console.log('用户不是客户')
          errCode = 8
          errMsg = "用户类型检查失败"
        }
       }
       else {
        console.log("查询失败")
        errCode = 2
        errMsg = "找不到该用户，请先登录"
       }
     })
    
      if (errCode != 0) {
        console.log('出错返回')
        return {
          "errCode": errCode,
          "errMsg": errMsg
        }
      } 

  /*处理时间 start*/
  var dateString = new Date(event.date + " " + event.start_time)
  if (dateString instanceof Date && !isNaN(dateString.getTime())) {   //判断日期格式是否规范
    console.log("时间格式符合规范")
    console.log(dateString)
    if (dateString.getHours() < 9 || dateString.getHours() > 18) {
      errCode = 5
      errMsg = "服务时间必须在09:00-18:00之间"
    }
    else if (dateString < new Date()) {
      console.log("开始时间必须在当前时间之后")
      errCode = 6
      errMsg = "开始时间必须在当前时间之后"
    }
  }
  else {
    errCode = 4
    errMsg = "请传入正确的时间格式"
  }
  if (errCode != 0) {
    return {
      "errCode": errCode,
      "errMsg": errMsg
    }
  }
  /*处理时间 end*/

  const res = await cloud.callFunction({
    name: 'get_access_token',
    data: {
      "openid": wxContext.OPENID
    }
  })
  let access_token = res.result;
  console.log("token为：")
  console.log(access_token)

  

    //以下试着调用位置api
    const post_options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/servicemarket?access_token=' + access_token,
      body: {
        "service" : "wxc1c68623b7bdea7b",
        "api" : "geoc",
        "data" : {
          "address": event.adress_simple + event.adress_compli
        },
      "client_msg_id" : "id123"
      },
      json: true
    };
    //获取post请求数据
    const post_res= await rp(post_options);
    console.log("地址api调用结果为")
    console.log(post_res)
    

    //检查地址api有没出错，如果没有，存以下经纬度
    const data = eval("("+post_res.data+")")
    console.log(post_res.data)
    console.log(data)

    console.log(data.status)
    if (post_res.errcode != 0 || data.result == undefined || data.result.location == undefined) {
      return {
        "errCode": 7,
        "errMsg": "地址信息无效，请检查后重新上传"
      }
    }
    else {
      console.log('地址获取成功')
      lat = data.result.location.lat
      lng = data.result.location.lng
      console.log('北纬:' + lat + ', 东经: ' + lng)
    }

  to_add_data = {
    order_id: new Date().getTime().toString(),
    customer_openid: wxContext.OPENID,
    // customer_info: event.customer_info,
    order_type: event.order_type,
    order_stat: 0,
    is_complaint: false,
    order_content: event.order_content,
    photo_num: event.photo_num,
    photo_array: event.photo_array,
    phone: event.phone,
    address_simple: event.adress_simple,
    adress_compli: event.adress_compli,
    location: {
      lat: lat,
      lng: lng
    },
    date: event.date,
    start_time: event.start_time,
    end_time: event.end_time,
    start_timestamp: dateString
  }

  console.log('正在添加数据')
  console.log(to_add_data)
  
  //上传到数据库order_form
  await db.collection('order_form')
  .add({
    data: to_add_data
  })
  .then(res => {
    console.log(res)
    console.log("order_form新增记录成功")
    // _id = res._id
  })

  //检查是否上传成功并返回
  await db.collection('order_form')
  .where({
    "customer_openid": wxContext.OPENID
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("下单成功，将返回order_form信息")
     errCode = 0
     order_form = res.data[0]
   }
   else {
    console.log("登录失败")
    errCode = 2
    errMsg = "下单失败，请重试"
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
     "errMsg": errMsg,
     "data": order_form
   }
 }
 
}