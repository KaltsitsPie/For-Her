// pages/orderPages/customerOrder/customerOrder.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    allOrderList: [],
    noReplyOrderList: [],
    onGoingOrderList: [],
    finishedOrderList: [],
    allOrderColor: String,
    allOrderWei: String,
    allOrderBorder: String,
    noReplyOrderColor: String,
    noReplyOrderWei: String,
    noReplyOrderBorder: String,
    onGoingOrderColor: String,
    onGoingOrderWei: String,
    onGoingOrderBorder: String,
    finishedOrderColor: String,
    finishedOrderWei: String,
    finishedOrderBorder: String,
    all_active: false,
    no_reply_active: false,
    on_going_active: false,
    finished_active: false,
  },

  allOrderSelect: function () {
    if (!this.all_active) {
      //this.orderList.clear()
      this.setData({
        /** 防止重复点击 */
        all_active: true,
        no_reply_active: false,
        on_going_active: false,
        finished_active: false,

        /** 设置toprow样式*/
        allOrderColor: "#FEC30D",
        allOrderWei: "bold",
        allOrderBorder: "solid #FEC30D",
        noReplyOrderColor: "",
        noReplyOrderWei: "",
        noReplyOrderBorder: "",
        onGoingOrderColor: "",
        onGoingOrderWei: "",
        onGoingOrderBorder: "",
        finishedOrderColor: "",
        finishedOrderWei: "",
        finishedOrderBorder: "",

        orderList: this.data.allOrderList
      })
    }
  },

  noReplyOrderSelect: function () {
    if (!this.no_reply_active) {
      this.setData({
        /** 防止重复点击 */
        all_active: false,
        no_reply_active: true,
        on_going_active: false,
        finished_active: false,

        /** 设置toprow样式*/
        noReplyOrderColor: "#FEC30D",
        noReplyOrderWei: "bold",
        noReplyOrderBorder: "solid #FEC30D",
        allOrderColor: "",
        allOrderWei: "",
        allOrderBorder: "",
        onGoingOrderColor: "",
        onGoingOrderWei: "",
        onGoingOrderBorder: "",
        finishedOrderColor: "",
        finishedOrderWei: "",
        finishedOrderBorder: "",

        orderList: this.data.noReplyOrderList
      })
    }
  },

  onGoingOrderSelect: function () {
    if (!this.on_going_active) {
      this.setData({
        /** 防止重复点击 */
        all_active: false,
        no_reply_active: false,
        on_going_active: true,
        finished_active: false,

        /** 设置toprow样式*/
        onGoingOrderColor: "#FEC30D",
        onGoingOrderWei: "bold",
        onGoingOrderBorder: "solid #FEC30D",
        noReplyOrderColor: "",
        noReplyOrderWei: "",
        noReplyOrderBorder: "",
        allOrderColor: "",
        allOrderWei: "",
        allOrderBorder: "",
        finishedOrderColor: "",
        finishedOrderWei: "",
        finishedOrderBorder: "",

        orderList: this.data.onGoingOrderList
      })
    }
  },

  finishedOrderSelect: function () {
    if (!this.finished_active) {
      this.setData({
        /** 防止重复点击 */
        all_active: false,
        no_reply_active: false,
        on_going_active: false,
        finished_active: true,

        /** 设置toprow样式*/
        finishedOrderColor: "#FEC30D",
        finishedOrderWei: "bold",
        finishedOrderBorder: "solid #FEC30D",
        noReplyOrderColor: "",
        noReplyOrderWei: "",
        noReplyOrderBorder: "",
        onGoingOrderColor: "",
        onGoingOrderWei: "",
        onGoingOrderBorder: "",
        allOrderColor: "",
        allOrderWei: "",
        allOrderBorder: "",

        orderList: this.data.finishedOrderList
      })
    }
  },

  selectOrder: function () {
    wx.redirectTo({
      url: './orderDetail/orderDetail'
    })
  },

  goto_evaluationDetail: function (event) {
    console.log(event.currentTarget.dataset.order_evaluate_item)
    var order_evaluate_item_str = JSON.stringify(event.currentTarget.dataset.order_evaluate_item)
    console.log(order_evaluate_item_str)
    wx.navigateTo({
      url: '../evaluationDetail/evaluationDetail?order_evaluate_item_str=' + order_evaluate_item_str,
    })
  },

  goto_myEvaluationDetail: function (event) {
    console.log(event.currentTarget.dataset.order_myevaluate_item)
    var order_myEvaluate_item_str = JSON.stringify(event.currentTarget.dataset.order_myevaluate_item)
    console.log(order_myEvaluate_item_str)
    wx.navigateTo({
      url: '../myEvaluationDetail/myEvaluationDetail?order_myEvaluate_item_str=' + order_myEvaluate_item_str,
    })
  },

  goto_appealDetails: function (event) {
    console.log(event.currentTarget.dataset.order_complaint_item)
    var order_complaint_item_str = JSON.stringify(event.currentTarget.dataset.order_complaint_item)
    console.log(order_complaint_item_str)
    wx.navigateTo({
      url: '../appealDetails/appealDetails?order_complaint_item_str=' + order_complaint_item_str,
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
    wx.showLoading({
      title: '订单加载中',
    }),

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
            allOrderColor: "#FEC30D",
            allOrderWei: "bold",
            allOrderBorder: "solid #FEC30D",
            noReplyOrderColor: String,
            noReplyOrderWei: String,
            noReplyOrderBorder: String,
            onGoingOrderColor: String,
            onGoingOrderWei: String,
            onGoingOrderBorder: String,
            finishedOrderColor: String,
            finishedOrderWei: String,
            finishedOrderBorder: String,

            allOrderList: customerOrderList.result.data.all_orders_array,
            noReplyOrderList: customerOrderList.result.data.open_orders_array,
            onGoingOrderList: customerOrderList.result.data.ongoing_orders_array,
            finishedOrderList: customerOrderList.result.data.finished_orders_array,
            orderList: customerOrderList.result.data.all_orders_array
          })
        }
      },
      fail: err => {
        console.error('订单列表获取失败，请刷新重试', err) /*失败处理*/
        wx.showModal({
          title: '提示',
          content: '订单列表获取失败，请刷新重试',
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