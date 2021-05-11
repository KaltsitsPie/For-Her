// pages/orderPages/reEvaluationDetail/reEvaluationDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    maintain_openid: '',
    customer_openid: '',
    avatarUrl: "../../../images/LOGO.png",
    nickName: "昵称",
    ratePic: [0, 0, 0, 0, 0],
    inputArea: '',
    score: 0,
    order_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order_reEvaluate_item_str = JSON.parse(options.order_reEvaluate_item_str)
    console.log(order_reEvaluate_item_str)
    this.setData({
      order_id: order_reEvaluate_item_str.order_id,
      maintain_openid: order_reEvaluate_item_str.maintain_openid,
      customer_openid: order_reEvaluate_item_str.customer_openid,
    })
    var that = this
    if (app.globalData.type == 1) {
      wx.cloud.callFunction({
        name: 'get_user_detail_single',
        data: {
          "openid": that.data.maintain_openid
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            nickName: res.result.data.userInfo.nickName,
            avatarUrl: res.result.data.userInfo.avatarUrl
          })
        },
        fail: err => {
          console.error('云函数[get_user_detail_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    } else if (app.globalData.type == 2) {
      wx.cloud.callFunction({
        name: 'get_user_detail_single',
        data: {
          "openid": that.data.customer_openid
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            nickName: res.result.data.userInfo.nickName,
            avatarUrl: res.result.data.userInfo.avatarUrl
          })
        },
        fail: err => {
          console.error('云函数[get_user_detail_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    }
    if (app.globalData.type == 1) {
      wx.cloud.callFunction({
        name: "get_evaluation_form_single",
        data: {
          "order_id": that.data.order_id
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            score: res.result.data.maintain_evaluation,
            inputArea: res.result.data.maintain_content
          })
          var i = this.data.score - 1
          var tempindex = [0, 0, 0, 0, 0]
          for (var m = 0; m <= i; m++) {
            tempindex[m] = 1
          }
          this.setData({
            ratePic: tempindex
          })
        },
        fail: err => {
          console.error('云函数[get_evaluation_form_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    } else if (app.globalData.type == 2) {
      wx.cloud.callFunction({
        name: "get_evaluation_form_single",
        data: {
          "order_id": that.data.order_id
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            score: res.result.data.customer_evaluation,
            inputArea: res.result.data.customer_content
          })
          var i = this.data.score - 1
          var tempindex = [0, 0, 0, 0, 0]
          for (var m = 0; m <= i; m++) {
            tempindex[m] = 1
          }
          this.setData({
            ratePic: tempindex
          })
        },
        fail: err => {
          console.error('云函数[get_evaluation_form_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})