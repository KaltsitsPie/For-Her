// pages/myPage/complaints/complaints.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    complaint_array: [],
    complaint_type_text: ['对方不是女性', '其他'],
    complaint_state_text: ['未审核', '失败', '通过']
  },

  goto_complaint_user: function (event) {
    console.log(event.currentTarget.dataset.complaint_array_item)
    var complaint_array_item_str = JSON.stringify(event.currentTarget.dataset.complaint_array_item)
    console.log(complaint_array_item_str)
    wx.navigateTo({
      url: '../complaint_user/complaint_user?complaint_array_item_str=' + complaint_array_item_str,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      console.log("canIUseGetUserProfile改变为true")
    }
    wx.cloud.callFunction({
      name: 'get_my_complaint_form',
      data: {},
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
          })
        } else {
          console.log(res.result.data)
          console.log(res.result.data.complaint_array)
          this.setData({
            complaint_array: res.result.data.complaint_array
          })
        }
      },
      fail: err => {
        console.error('云函数[get_my_complaint_form]调用失败', err) /*失败处理*/
        wx.showToast({
          title: "网络环境不佳",
          icon: "error",
          duration: 5000
        })
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