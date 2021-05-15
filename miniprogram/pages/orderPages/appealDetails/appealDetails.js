// miniprogram/pages/appealDetails/appealDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    order_id: "订单编号",
    array: ['对方非女性', '其他'],
    index: 0,
    inputArea: '',
    phone: "",
    remain: 150
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

  inputArea: function (e) {
    this.setData({
      inputArea: e.detail.value,
      remain: 150 - e.detail.value.length
    })
    console.log(this.data.inputArea)
  },

  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 提交申诉弹窗
   */
  submitPop: function () {
    var that = this
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '您确认提交该申诉吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理',
          })
          wx.cloud.callFunction({
            name: 'add_complaint_form_single',
            /*云函数名字，不能重复*/
            data: {
              /*输入数据，使用JSON格式*/
              "order_id": that.data.order_id,
              "complaint_type": that.data.index,
              "complaint_content": that.data.inputArea,
              "photo_array": [],
              "phone": that.data.phone
            },
            success: res => {
              console.log(res) /*接收后端返回数据*/
              if (res.result.errCode != 0) {
                wx.hideLoading()
                wx.showModal({
                  title: '提示',
                  content: res.result.errMsg,
                })
              } else {
                wx.hideLoading()
                wx.showToast({
                  title: '成功',
                  duration: 2000,
                  complete: () => {
                    setTimeout(
                      () => {
                        wx.switchTab({
                          url: '../customerOrder/customerOrder',
                        })
                      },
                      2000
                    )
                  }
                })

              }
            },
            fail: err => {
              console.error('云函数[add_user-info]调用失败', err) /*失败处理*/
              wx.showToast({
                title: "网络环境不佳",
                icon: "error",
                duration: 5000
              })
            },
            complete: () => {

            }
          })

        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var order_complaint_item_str = JSON.parse(options.order_complaint_item_str)
    console.log(order_complaint_item_str)
    this.setData({
      order_id: order_complaint_item_str.order_id
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