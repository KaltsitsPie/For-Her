// pages/askIdentity/askIdentity.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  isCostomerPop: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '身份确认后不可更改，您确认选择 “客户” 身份吗？',
      success: function(res) {
        console.log("用户选择客户身份")
        wx.switchTab({
          url: '../indexAll/indexAll',
        })
      }
    })
  },

  isRepairerPop: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '身份确认后不可更改，您确认选择 “修理工” 身份吗？',
      success: function (res) {
        console.log("用户选择修理工身份")
        wx.switchTab({
          url: '../upCertification/upCertification',
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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