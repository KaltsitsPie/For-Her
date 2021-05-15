// pages/indexAll/indexAll.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pipeDredge: "0",
    applianceRepair: "1",
    waterRepair: "2",
    applianceClean: "3",
    doorRepair: "4",
    else: "5"
  },

  goto_placeOrder: function(event) {
    var that = this
    console.log(event.currentTarget.dataset.service_type_num, typeof(event.currentTarget.dataset.service_type_num))
    var service_type_num = JSON.stringify(event.currentTarget.dataset.service_type_num)
    if(app.globalData.type == 1){
      wx.navigateTo({
        url: '../../orderPages/placeOrderCustomer/placeOrderCustomer?service_type_num=' + service_type_num,
      })
    } else{
      if(app.globalData.type == 2){
        wx.navigateTo({
          url: '../../orderPages/takeOrderRepairman/takeOrderRepairman?service_type_num=' + service_type_num,
        })
      }
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      console.log("canIUseGetUserProfile改变为true")
    }
    // wx.cloud.callFunction({
    //   name: 'login'
    // })
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