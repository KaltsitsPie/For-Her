// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

/**
 * 查询单个订单
 * 必要参数是order_id
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var order_form = {}
  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_id == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数"
    }
  }

  //————————————————————体验版————————————
  if (event.order_id == "11111111111" || event.order_id == "22222222222") {
        to_add_data = {
          _id: "1111111111111111111111111",
          order_id: event.order_id,
          customer_openid: event.openid,
          maintain_openid: "ow_LC4loxbxM5VENJnsgd27QC9Bo",
          order_type: 3,
          order_stat: 6,
          is_complaint: false,
          order_content: "问题描述示例，仅作展示UI用，无法进行任何操作",
          photo_num: 1,
          photo_array: ["cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/images/LOGO.png"],
          phone: "00000000000",
          address_simple: "四川省成都市成华区建设北路",
          adress_compli: "电子科技大学沙河校区",
          location: {
            lat: 30.675749,
            lng: 104.100
          },
          date: "2021-5-6",
          start_time: "14:00",
          end_time: "16:00",
          start_timestamp: new Date("2021-5-6 14:00"),
          price: 100
        }
        return {
          "errCode": 0,
          "errMsg": "",
          "data": to_add_data
        }
      }
      else if (event.order_id == "33333333333" || event.order_id == "44444444444") {
        to_add_data = {
          _id: "3333333333333333333333",
          order_id: event.order_id,
          customer_openid: "ow_LC4hPCvE4zock1PT6LZFSgV5M",
          maintain_openid: event.openid,
          order_type: 3,
          order_stat: 5,
          is_complaint: false,
          order_content: "问题描述示例，仅作展示UI用，无法进行任何操作",
          photo_num: 1,
          photo_array: ["cloud://for-her-3gaft6e9c1774eb8.666f-for-her-3gaft6e9c1774eb8-1305448068/images/LOGO.png"],
          phone: "00000000000",
          address_simple: "四川省成都市成华区建设北路",
          adress_compli: "电子科技大学沙河校区",
          location: {
            lat: 30.675749,
            lng: 104.100
          },
          date: "2021-5-6",
          start_time: "14:00",
          end_time: "16:00",
          start_timestamp: new Date("2021-5-6 14:00"),
          price: 100
        }
        return {
          "errCode": 0,
          "errMsg": "",
          "data": to_add_data
        }
      }

  //——————————————————————————————————————
  //更新一下订单状态
  await cloud.callFunction({
    name: 'check_order_stat_with_time',
    data: {}
  })
  
  const db = cloud.database()
  await db.collection('order_form')
  .where({
    "order_id": event.order_id
  })
  .get()
  .then(res => {
   if (res.data.length > 0) {
     console.log("查询成功，将返回order_id信息")
     errCode = 0
     order_form = res.data[0]
   }
   else {
    console.log("查询失败")
    errCode = 2
    errMsg = "该订单不存在，请检查订单id是否正确"
   }
 })

 if (errCode != 0) {
   return {
     "errCode": errCode,
     "errMsg": errMsg
   }
 }
 
   
  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": order_form
  }
}