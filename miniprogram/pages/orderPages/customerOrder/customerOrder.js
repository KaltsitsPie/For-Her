// pages/orderPages/customerOrder/customerOrder.js
var app = getApp()
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
    user_type: Number,
    showModal: false,
    textV:"",
    order_id: ""
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

  selectOrder: function (event) {
    var order = JSON.stringify(event.currentTarget.dataset.order)
    //console.log(order)
    wx.navigateTo({
      url: '../orderDetail/orderDetail?order=' + order,
    })
  },

  confirmAndPay: function(event) {
    var order_id = event.currentTarget.dataset.order.order_id
    wx.showModal({
      title: '是否确认付款？',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '请稍候',
          }),
      
          wx.cloud.callFunction({
            name: 'c_confirm_and_pay',
            /*云函数名字，不能重复*/
            data: {order_id},
            success: customerOrder => {
              console.log(customerOrder) /*接收后端返回数据*/
              if (customerOrder.result.errCode != 0) {
                wx.showModal({
                  title: '提示',
                  content: customerOrder.result.errMsg,
                })
              } else {
                wx.showToast({
                  title: '成功',
                })
                this.onShow()
              }
            },
            fail: err => {
              setTimeout(function () {
                wx.hideLoading()
              }, 100)
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
        }
      }
    })
  },

  inputPrice: function(event) {
    this.setData({
      showModal:true,
      order_id: event.currentTarget.dataset.order.order_id
    })
  },

  /**
   * 点击返回按钮隐藏
   */
  back:function(){
    this.setData({
      showModal:false
    })
  },

  /**
   * 获取input输入值
   */
  wish_put:function(e){
    this.setData({
      textV: e.detail.value
    })
  },

  /**
   * 点击确定按钮获取input值并且关闭弹窗
   */
  ok:function(){
    console.log(this.data.textV, typeof(this.data.textV))
    console.log(this.data.order_id)
    var order_id = this.data.order_id
    var price = parseInt(this.data.textV, 10)
    wx.showModal({
      title: '是否确认提交价格？',
      success: res=>{
        if(res.confirm){
          wx.showLoading({
            title: '请稍候',
          }),
          console.log("order id:", order_id)
          console.log("price:", price)
          wx.cloud.callFunction({
            name: 'update_order_form',
            /*云函数名字，不能重复*/
            data: {
              "order_id": order_id,
              "to_update_data": {
                "order_stat": 3,
                "price": price
	            }
            },
            success: customerOrder => {
              if (customerOrder.result.errCode != 0) {
                wx.showModal({
                  title: '提示',
                  content: customerOrder.result.errMsg,
                })
              } else {
                wx.showToast({
                  title: '提交成功',
                  duration: 5000
                })
                this.onShow()
              }
            },
            fail: err => {
              setTimeout(function () {
                wx.hideLoading()
              }, 100)
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
        }
      }
    })
    this.setData({
      showModal:false,
      textV: "",
      order_id: ""
    })
  },

  goto_yourComments: function (event) {
    console.log(event.currentTarget.dataset.order_your_item)
    var openid = event.currentTarget.dataset.order_your_item.maintain_openid
    // var order_your_item_str = JSON.stringify(event.currentTarget.dataset.order_your_item)
    // console.log(order_your_item_str)
    wx.navigateTo({
      url: '../../myPage/yourComments/yourComments?openid=' + openid,
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
    this.setData({
      user_type: app.globalData.type
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(app.globalData.is_logged == false) {
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 5000
      })
      wx.switchTab({
        url: '../../myPage/myPage/myPage',
      })
    }
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.showLoading({
      title: '订单加载中',
    })
    console.log("user type:", app.globalData.type)
    console.log("user type:", this.data.user_type)
    if(app.globalData.type == 1){
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
    } else {
      wx.cloud.callFunction({
        name: 'm_get_all_order_form',
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
              noReplyOrderList: customerOrderList.result.data.notstart_orders_array,
              onGoingOrderList: customerOrderList.result.data.ongoing_orders_array,
              finishedOrderList: customerOrderList.result.data.finished_orders_array,
              orderList: customerOrderList.result.data.all_orders_array
            })
          }
        },
        fail: err => {
          console.error('订单列表获取失败，请刷新重试', err) /*失败处理*/
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
    }
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