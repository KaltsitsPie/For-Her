// pages/myPage/complaint_user/complaint_user.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array: ['对方非女性', '其他'],
    order_id: '',
    complaint_type: 0,
    phone: '',
    text: '内容',
    complaint_array_item_str: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var complaint_array_item_str = JSON.parse(options.complaint_array_item_str)
    console.log(complaint_array_item_str)
    this.setData({
      order_id: complaint_array_item_str.order_id,
      complaint_type: complaint_array_item_str.complaint_type,
      phone: complaint_array_item_str.phone,
      text: complaint_array_item_str.complaint_content,
    })
    console.log(this.data.array[this.data.complaint_type])
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