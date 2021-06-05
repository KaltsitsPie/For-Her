// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 修理工根据类型获取订单
 * 必要参数order_type
 * 可选参数lat, lng
 */
exports.main = async (event, context) => {
  const openid = cloud.getWXContext().OPENID
  var lat = 30.68
  var lng = 104.12
  var orders_array = []


  var errCode = 0
  var errMsg = ""

  //检查参数是否完整
  if (event.order_type == undefined) {
    return {
      "errCode": 1,
      "errMsg": "缺少必要参数",
      "event": event
    }
  }
  //对地址信息赋值
  if (event.lat != undefined && event.lng != undefined) {
    lat = event.lat
    lng = event.lng
  }

  //更新订单状态
  await cloud.callFunction({
    name: 'check_order_stat_with_time'
  })

  //先判断是否被拉黑了
  console.log('正在检查用户类型')
  const db = cloud.database()
  await db.collection('user_detail')
  .where({
        "openid": openid
      })
  .get()
  .then(res => {
    if (res.data.length > 0) {
      console.log("查询成功")
    if (res.data[0].is_black == true) {
      console.log('用户已被拉黑')
      errCode = 99
      errMsg = "已被拉黑，操作失败"
    }
    if (!res.data[0].is_manager && res.data[0].type != 2) {
      console.log('用户不是修理工')
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
      "errMsg": errMsg,
      "event": event
    }
  } 

  //判断该类型是否存在订单
  const countResult = await db.collection('order_form')
  .where({
    "order_type": event.order_type,
    "order_stat": 0
  })
  .count()
  const total = countResult.total
  console.log(event.order_type + "类型" + "总共有" + total + "条未接订单")
  if (total == 0) {
    console.log('搜索结果为空，将返回')
    return {
      "errCode": errCode,
      "errMsg": errMsg,
      "data": {
        "order_type": event.order_type,
        "orders_array": orders_array
      }
    }
  }

  //拿到该订单类型下所有订单
  await db.collection('order_form')
  .where({
    "order_type": event.order_type,
    "order_stat": 0
  })
  .get()
  .then(res => {
    orders_array = res.data
  })
  //去掉订单的详细信息，并计算与自己的举例
  orders_array.forEach((value , index) => {
    delete value.phone
    delete value.adress_compli
    value['distance'] = get_ciecle_distance(lat, lng, value.location.lat, value.location.lng)
  })
  // orders_array.forEach((value , index) => {
  //   value['distance'] = get_ciecle_distance(lat, lng, value.location.lat, value.location.lng)
  // })
  console.log('删除字段后', orders_array)

  //数组根据距离进行升序排序
  orders_array = orders_array.sort((a, b) => a.distance - b.distance)
  console.log('排序后', orders_array)

  return {
    "errCode": errCode,
    "errMsg": errMsg,
    "data": {
      "order_type": event.order_type,
      "orders_array": orders_array
    },
    "event": event
  }
}

function get_ciecle_distance(lat1, lng1, lat2, lng2) {
  console.log(lat1, lng1, lat2, lng2)
  var radLat1 = lat1 * Math.PI / 180.0;
  var radLat2 = lat2 * Math.PI / 180.0;
  var a = radLat1 - radLat2;
  var b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
  var s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
  s = s * 6378.137;
  s = Math.round(s * 10000) / 10000;
  return s  // 单位千米
}

