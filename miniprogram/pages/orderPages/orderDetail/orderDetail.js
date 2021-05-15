// pages/orderPages/orderDetail/orderDetail.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: "",
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
    var order_id = JSON.parse(options.order_id)
    console.log(order_id)
    this.setData({
      order_id: order_id
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
    var order_id = this.data.order_id
    var that = this
    wx.cloud.callFunction({
      name: 'get_order_form_single',
      data: {order_id},
      /*云函数名字，不能重复*/
      success: customerOrderDetail => {
        console.log(customerOrderDetail) /*接收后端返回数据*/
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
        console.error('订单详情获取失败，请刷新重试', err) /*失败处理*/
        wx.showModal({
          title: '提示',
          content: '订单详情获取失败，请刷新重试',
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