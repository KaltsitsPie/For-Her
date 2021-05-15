// pages/orderPages/takeOrderRepairman/takeOrderRepairman.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [],
    order_type: "",
    order_type_num: Number,
    distance: 0.00,
    customer: "",
    lat:0,
    lng:0,
    flag:Boolean
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //var order_type_num = JSON.parse(options.service_type_num)
    //order_type_num = parseInt(order_type_num, 10)
    this.setData({
      order_type_num: parseInt(JSON.parse(options.service_type_num), 10)
    })
    
    switch(this.data.order_type_num){
      case 0: this.setData({order_type: "管道疏通"});break;
      case 1: this.setData({order_type: "家电维修"});break;
      case 2: this.setData({order_type: "水电维修"});break;
      case 3: this.setData({order_type: "家电清洗"});break;
      case 4: this.setData({order_type: "门窗维修"});break;
      case 5: this.setData({order_type: "其它"});break;
    }
  },

  goto_yourComments: function (event) {
    console.log(event.currentTarget.dataset.order_your_item)
    var order_your_item_str = JSON.stringify(event.currentTarget.dataset.order_your_item)
    console.log(order_your_item_str)
    wx.navigateTo({
      url: '../../myPage/yourComments/yourComments?order_your_item_str=' + order_your_item_str,
    })
  },

  takeOrder: function(event) {
    var order_id = event.currentTarget.dataset.order.order_id
    var that = this
    wx.showModal({
      //cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '您确认接下该订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理'
          })

          let data = {
            /*输入数据，使用JSON格式*/
            "order_id": order_id
          }
          data = JSON.stringify(data)
          wx.hideLoading()
          wx.navigateTo({
            url: `../facialRecognition/facialRecognition?data=${data}`,
          })
        }
      }
    })  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(app.globalData.is_logged == false) {
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 9000
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
    var that = this
    wx.showLoading({
      title: '订单加载中',
    }),
    wx.getLocation({
      success(res){
        that.setData({
          lat: res.latitude,
          lng: res.longitude,
          flag:true
        })
      },
      fail(error){
        that.setData({
          flag:false
        })
      }
    })
    wx.cloud.callFunction({
      name: 'm_get_order_form_by_type',
      data:{
        "order_type": that.data.order_type_num,
        "lat": that.data.lat,
        "lng": that.data.lng
      },
      success: orderList => {
        console.log(orderList) /*接收后端返回数据*/
        if (orderList.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: orderList.result.errMsg,
          })
        } else {
          that.setData({
            orderList: orderList.result.data.orders_array
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