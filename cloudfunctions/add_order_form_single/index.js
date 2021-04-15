// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let appid = "wx42728c8b4522d4a1"
  let secret = "fee03d96af2081cb9f22c564b03d0174"
  const wxContext = cloud.getWXContext()
  var lat = 0 //北纬
  var lng = 0 //东经
  
  errCode = 0
  errMsg = ""
  //以下是需要处理的数据
  var geo = null
  // var start_timestamp = null
  var end_timestamp = ""


  //检查参数是否完整
  if (event.customer_info == undefined || event.order_type == undefined ||
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
    //post
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
    

    //检查地址api有没出错，没有的话存以下经纬度

    const data = eval("("+post_res.data+")")
    console.log(post_res.data)
    console.log(data)

    console.log(data.status)
    if (post_res.errcode != 0 && data.result.location == undefined) {
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
    customer_info: {
      openid: "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      nickName: "凯尔希单推人",
      avatarUrl: "cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/certification/ow_LC4hPCvE4zock1PT6LZFSgV5M/1618387207355.jpg"
    },
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
  
  
}