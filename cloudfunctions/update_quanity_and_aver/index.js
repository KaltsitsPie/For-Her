// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

/**
 * 更新user_detail中所有用户的平均分
 */
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var res = {}
  var res2 = {}

  const db = cloud.database()
  const $ = db.command.aggregate

    console.log('是用户，正在计算平均分')
    res = await db.collection('evaluation_form')
    .aggregate()
    .group({
      _id: '$customer_openid',
      average: $.avg('$maintain_evaluation')
    })
    .end()

    console.log('res=', res)

    for(i = 0; i < res.list.length; i++){
      console.log('i=', i)
      db.collection('user_detail')
      .where({
        "openid": res.list[i]._id
      })
      .update({
        data: {
          "evaluation_aver": res.list[i].average
        }
      })
      .then(res => {
        console.log('修改了', res.stats.updated)
      })
    }

    console.log('是修理工，正在计算平均分')
    res2 = await db.collection('evaluation_form')
    .aggregate()
    .group({
      _id: '$maintain_openid',
      average: $.avg('$customer_evaluation')
    })
    .end()

    console.log('res2=', res2)


  for(i = 0; i < res2.list.length; i++){
    console.log('i=', i)
    db.collection('user_detail')
    .where({
      "openid": res2.list[i]._id
    })
    .update({
      data: {
        "evaluation_aver": res2.list[i].average
      }
    })
    .then(res => {
      console.log('修改了', res.stats.updated)
    })
  }

  return 0
}