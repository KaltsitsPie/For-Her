// pages/orderPages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order: "",
    service_type_str: "",
    problem_text: "",
    photo_array: [],
    phone: "",
    addr: "",
    addr_detail: "",
    maintain_date: "",
    maintain_start_time: "",
    maintain_end_time: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order = JSON.parse(options.order)
    //console.log(order)
    this.setData({
      order: order
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
    const that = this
    switch(that.data.order.order_type){
      case 0: that.setData({service_type_str: "管道疏通"});break;
      case 1: that.setData({service_type_str: "家电维修"});break;
      case 2: that.setData({service_type_str: "水电维修"});break;
      case 3: that.setData({service_type_str: "家电清洗"});break;
      case 4: that.setData({service_type_str: "门窗维修"});break;
      case 5: that.setData({service_type_str: "其它"});break;
    }
    this.setData({
      problem_text: that.data.order.order_content,
      photo_array: that.data.order.photo_array,
      phone: that.data.order.phone,
      addr: that.data.order.address_simple,
      addr_detail: that.data.order.adress_compli,
      maintain_date: that.data.order.date,
      maintain_start_time: that.data.order.start_time,
      maintain_end_time: that.data.order.end_time
    })
    /*
    var order_id = this.data.order_id
    var that = this
    wx.cloud.callFunction({
      name: 'get_order_form_single',
      data: {order_id},
      success: customerOrderDetail => {
        console.log(customerOrderDetail) 
        if (customerOrderDetail.result.errCode != 0) {
          wx.showModal({
            title: '提示',
            content: customerOrderDetail.result.errMsg,
          })
        } else {
          switch(customerOrderDetail.result.data.order_type){
            case 0: that.setData({service_type_str: "管道疏通"});break;
            case 1: that.setData({service_type_str: "家电维修"});break;
            case 2: that.setData({service_type_str: "水电维修"});break;
            case 3: that.setData({service_type_str: "家电清洗"});break;
            case 4: that.setData({service_type_str: "门窗维修"});break;
            case 5: that.setData({service_type_str: "其它"});break;
          }
          this.setData({
            problem_text: customerOrderDetail.result.data.order_content,
            photo_array: customerOrderDetail.result.data.photo_array,
            phone: customerOrderDetail.result.data.phone,
            addr: customerOrderDetail.result.data.address_simple,
            addr_detail: customerOrderDetail.result.data.adress_compli,
            maintain_date: customerOrderDetail.result.data.date,
            maintain_start_time: customerOrderDetail.result.data.start_time,
            maintain_end_time: customerOrderDetail.result.data.end_time
          })
        }
      },
      fail: err => {
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
    */
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