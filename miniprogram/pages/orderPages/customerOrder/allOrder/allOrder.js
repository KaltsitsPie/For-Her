// pages/orderPages/customerOrder/allOrder/allOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    allOrderColor: "#FEC30D",
    allOrderWei: "bold",
    allOrderBorder: "solid #FEC30D",
    is_hidden_all_button: Boolean,
    is_hidden_onr_button: Boolean,
    //is_loading: Boolean,
    //is_loading:true,
    allOrderList: []
  },

  noReplyOrderSelect: function () {
    wx.redirectTo({
      url: '../noReplyOrder/noReplyOrder'
    })
  },

  onGoingOrderSelect: function () {
    wx.redirectTo({
      url: '../onGoingOrder/onGoingOrder'
    })
  },

  finishedOrderSelect: function () {
    wx.redirectTo({
      url: '../finishedOrder/finishedOrder'
    })
  },

  selectOrder: function () {
    wx.redirectTo({
      url: '../orderDetail/orderDetail'
    })
  },

  goto_appealDetails: function (event) {
    console.log(event.currentTarget.dataset.order_complaint_item)
    var order_complaint_item_str = JSON.stringify(event.currentTarget.dataset.order_complaint_item)
    console.log(order_complaint_item_str)
    wx.navigateTo({
      url: '../../appealDetails/appealDetails?order_complaint_item_str=' + order_complaint_item_str,
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '订单加载中',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.cloud.callFunction({
      name: 'c_get_all_order_form',
      /*云函数名字，不能重复*/
      success: customerOrderList => {
        console.log(customerOrderList) /*接收后端返回数据*/
        if (customerOrderList.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: customerOrderList.result.errMsg,
          })
        } else {
          this.setData({
            allOrderList: customerOrderList.result.data.all_orders_array
          })
        }
      },
      fail: err => {
        console.error('订单列表获取失败，请刷新重试', err) /*失败处理*/
      },
      complete: () => {
        setTimeout(function () {
          wx.hideLoading()
        }, 100)
      }
    })
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