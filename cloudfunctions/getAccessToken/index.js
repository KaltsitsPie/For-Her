// 云函数入口文件
const cloud = require('wx-server-sdk')
const rp = require('request-promise')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
cloud.init()
const wxContext = cloud.getWXContext()
const openid = wxContext.OPENID
const appid = "wx42728c8b4522d4a1"
const secret = "fee03d96af2081cb9f22c564b03d0174"

/**
 * 云函数getAccessToken获取新的access_token并返回
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
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
    console.log('新的token=' + token)

    return {
      access_token: token
    }
}