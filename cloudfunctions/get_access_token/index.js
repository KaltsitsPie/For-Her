// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {

  const db = cloud.database()
  const wxContext = cloud.getWXContext()
  const openid = wxContext.OPENID
    const collection = 'access_token';//数据库集合名称
    let gapTime = 600000; // 10 分钟

    if (event.openid == undefined) {
      return {
        errCode: 1,
        errMsg: "缺少必要参数"
      }
    }
    
    console.log('开始读取access_token数据库')
    let result = await db.collection(collection)
    .where({
        _id: event.openid
      
    })
                // .doc('ow_LC4loxbxM5VENJnsgd27QC9Bo')
                .get();
    console.log('result=')
    console.log(result)

    // 数据库没有，获取新的access_token，存储进数据库并返回新access_token
    if (result.data.length == 0) {
      const res = await cloud.callFunction({
        name: 'getAccessToken',
        data: {
          a: 1
        }
      })
      let new_token = res.result.access_token;
      // let ein = accessTokenBody.expires_in * 1000;
      await db.collection(collection)
              .add({
              data: {
                _id: event.openid,
                access_token: new_token,
                createTime: Date.now()
              }
            });
      return new_token;
    }
    //数据库有，检查是否过期
    else {
      let data = result.data[0];
      let {
        _id,
        access_token,
        createTime
      } = data;
      // 判断access_token是否有效
      if (Date.now() < createTime + gapTime) {
        console.log('access_token有效')
        return access_token;
      }
      // 失效，重新获取
      else {
        console.log('失效，将重新获取access_token')
        const res = await cloud.callFunction({
          name: 'getAccessToken',
          data: {
            a: 1
          }
        })
        let new_token = res.result.access_token;
        // let accessTokenBody = await this.getAccessToken();
        // let act = accessTokenBody.access_token;
        // let ein = accessTokenBody.expires_in * 1000;
        await db.collection('access_token')
                    .doc(_id)
                    .update({
                      data: {
                        _id: _id,
                        access_token: new_token,
                        createTime: Date.now()
                      }
                      
                    })
        console.log('access_token更新成功')
        return new_token
      }
    }
  


  

    //以下试着调用位置api
    //post
    const post_options = {
      method: 'POST',
      url: 'https://api.weixin.qq.com/wxa/servicemarket?access_token=' + new_token,
      body: {
        "service" : "wxc1c68623b7bdea7b",
        "api" : "geoc",
        "data" : {
          "address": "四川省成都市成华区建设北路电子科技大学沙河小区"
        },
      "client_msg_id" : "id123"
      },
      json: true
    };
    //获取post请求数据
    const post_res= await rp(post_options);
    console.log("地址api调用结果为")
    console.log(post_res)
}

