// miniprogram/pages/myPage/yourComments/yourComments.js

var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    evaluation_array: [],
    evaluation: 0,
    order_id: "",
    myRate: 4.6,
    type: 0,
    nickName: '',
    avatarUrl: '',
    your_openid: ''
  },

  goto_reEvaluationDetail: function (event) {
    console.log(event.currentTarget.dataset.order_reevaluate_item)
    var order_reEvaluate_item_str = JSON.stringify(event.currentTarget.dataset.order_reevaluate_item)
    console.log(order_reEvaluate_item_str)
    wx.navigateTo({
      url: "../../orderPages/reEvaluationDetail/reEvaluationDetail?order_reEvaluate_item_str=" + order_reEvaluate_item_str,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var order_your_item_str = JSON.parse(options.order_your_item_str)
    console.log(order_your_item_str)
    if (app.globalData.type == 1) {
      this.setData({
        your_openid: order_your_item_str.maintain_openid
      })
    }
    var that = this
    wx.cloud.callFunction({
      name: 'get_user_detail_single',    /*云函数名字，不能重复*/
      data: {										/*输入数据，使用JSON格式*/
        "openid": that.data.your_openid
      },
      success: res => {
        console.log(res)				/*接收后端返回数据*/
        this.setData({
          myRate: res.result.data.evaluation_aver,
          nickName: res.result.data.userInfo.nickName,
          avatarUrl: res.result.data.userInfo.avatarUrl
        })
      },
      fail: err => {
        console.error('云函数[add_user-info]调用失败', err)	/*失败处理*/
      },
      complete: () => {
    
      }
    })
    
    wx.cloud.callFunction({
      name: 'get_all_evaluation_form',
      /*云函数名字，不能重复*/
      data: {
        /*输入数据，使用JSON格式*/
        "openid": that.data.your_openid
      },
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
          })
        } else {
          this.setData({
            evaluation_array: res.result.data
          })
        }
      },
      fail: err => {
        console.error('云函数[get_all_evaluation_form]调用失败', err) /*失败处理*/
      },
      complete: () => {
        setTimeout(function () {
          wx.hideLoading()
        }, 100)
      }
    })
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