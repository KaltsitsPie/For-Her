// pages/orderPages/evaluationDetail/evaluationDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    avatarUrl: "../../../images/LOGO.png",
    nickName: "昵称",
    ratePic: [0, 0, 0, 0, 0]
  },

  tap_0: function (e) {
    var i = new Number(e.target.dataset.text)
    var tempindex = [0, 0, 0, 0, 0]
    for (var m = 0; m <= i; m++) {
      tempindex[m] = 1
    }
    this.setData({
      ratePic: tempindex
    })
    console.log(this.data.ratePic)
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