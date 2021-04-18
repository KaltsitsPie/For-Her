// miniprogram/pages/appealDetails/appealDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderNumber: "订单编号",
    array: ['对方非女性','其他'],
    index: 0
  },

  /**
   * 选择申诉类型
   */
  pickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  /**
   * 提交申诉弹窗
   */
  submitPop: function () {
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '您确认提交该申诉吗？',
      success(res) {
        if (res.confirm) {
          console.log("用户点击确定"),
          wx.showToast({
            title: '成功',
          })
        }
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