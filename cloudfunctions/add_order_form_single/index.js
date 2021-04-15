// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  let appid = "wx42728c8b4522d4a1"
  let secret = "fee03d96af2081cb9f22c564b03d0174"
  const wxContext = cloud.getWXContext()
  errCode = 0
  errMsg = ""
  //以下是需要处理的数据
  var geo = null
  // var start_timestamp = null
  var end_timestamp = ""


  //检查参数是否完整
  if (//event.customer_info == undefined || event.order_type == undefined ||
      //event.order_content == undefined || event.photo_num == undefined ||
      //event.photo_array == undefined || event.phone_num == undefined ||
      //event.adress_simple == undefined || event.adress_compli == undefined ||
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
    else if (dateString > new Date()) {
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


  const AccessToken_options = {
    method: 'GET',
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    qs: {
    appid,
    secret,
    grant_type: 'client_credential'
    },
    json: true
    
    };
    
    //获取AccessToken
    const resultValue = await rp(AccessToken_options);
    const token = resultValue.access_token;

    console.log("token为：")
    console.log(token)
  to_add_data = {
    "order_id": new Date().getTime(),
    "customer_info": {
      "openid": "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      "nickName": "凯尔希单推人",
      "avatarUrl": "cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/certification/ow_LC4hPCvE4zock1PT6LZFSgV5M/1618387207355.jpg"
    },
    "maintain_info": {
      "openid": "ow_LC4hPCvE4zock1PT6LZFSgV5M",
      "nickName": "凯尔希单推人",
      "avatarUrl": "cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/certification/ow_LC4hPCvE4zock1PT6LZFSgV5M/1618387207355.jpg"
    },


    "start_date": dateString
  }

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}