// pages/myPage/complaint_admin/complaint_manage.js
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
    to_openid: '',
    i_type: 0,
    complaint_array_item_str: ''
  },

  clickagree: function (params) {
    console.log("点击同意")
    wx.cloud.callFunction({
      name: 'agree_complaint',
      data: {
        "is_black": true,
        "order_id": this.data.order_id,
        "to_openid": this.data.to_openid
      },
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
          })
        } else {
          wx.showToast({
            title: '同意申诉成功',
            icon: 'success',
            duration: 2500
          })
          wx.redirectTo({
            url: '../complaints_all/complaints_all',
          })
        }
      },
      fail: err => {
        console.error('云函数[agree_complaint]调用失败', err) /*失败处理*/
      },
      complete: () => {

      }
    })
  },

  clickdisagree: function (params) {
    console.log("点击驳回")
    wx.cloud.callFunction({
      name: "reject_complaint",
      data: {
        "order_id": this.data.order_id
      },
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
          })
        } else {
          wx.showToast({
            title: '驳回申诉成功',
            icon: 'success',
            duration: 2500
          })
          wx.redirectTo({
            url: '../complaints_all/complaints_all',
          })
        }
      },
      fail: err => {
        console.error('云函数[reject_complaint]调用失败', err) /*失败处理*/
      },
      complete: () => {

      }
    })
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
      to_openid: complaint_array_item_str.to_openid
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