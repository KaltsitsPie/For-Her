// pages/orderPages/evaluationDetail/evaluationDetail.js
var app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    customer_openid: '',
    maintain_openid: '',
    avatarUrl: "../../../images/LOGO.png",
    nickName: "昵称",
    ratePic: [0, 0, 0, 0, 0],
    inputArea: '',
    score: 0,
    order_id: ''
  },

  tap_0: function (e) {
    var i = new Number(e.target.dataset.text)
    var tempindex = [0, 0, 0, 0, 0]
    for (var m = 0; m <= i; m++) {
      tempindex[m] = 1
    }
    this.setData({
      ratePic: tempindex,
      score: i + 1
    })
    console.log(this.data.score)
  },

  inputArea: function (e) {
    this.setData({
      inputArea: e.detail.value
    })
    console.log(this.data.inputArea)
  },

  submitPop: function (params) {
    var that = this
    wx.showModal({
      cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '您确认提交该评价吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理',
          })
          wx.cloud.callFunction({
            name: 'add_evaluation_form_single',
            /*云函数名字，不能重复*/
            data: {
              /*输入数据，使用JSON格式*/
              "order_id": that.data.order_id,
              "evaluation": that.data.score,
              "content": that.data.inputArea
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
    var order_evaluate_item_str = JSON.parse(options.order_evaluate_item_str)
    console.log(order_evaluate_item_str)
    this.setData({
      order_id: order_evaluate_item_str.order_id,
      maintain_openid: order_evaluate_item_str.maintain_openid,
      customer_openid: order_evaluate_item_str.customer_openid
    })
    var that = this
    console.log(this.data.maintain_openid)
    if (app.globalData.type == 1) {
      wx.cloud.callFunction({
        name: 'get_user_detail_single',
        data: {
          "openid": that.data.maintain_openid
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            nickName: res.result.data.userInfo.nickName,
            avatarUrl: res.result.data.userInfo.avatarUrl
          })
        },
        fail: err => {
          console.error('云函数[get_user_detail_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    }
    else if (app.globalData.type == 1) {
      wx.cloud.callFunction({
        name: 'get_user_detail_single',
        data: {
          "openid": that.data.customer_openid
        },
        success: res => {
          console.log(res) /*接收后端返回数据*/
          this.setData({
            nickName: res.result.data.userInfo.nickName,
            avatarUrl: res.result.data.userInfo.avatarUrl
          })
        },
        fail: err => {
          console.error('云函数[get_user_detail_single]调用失败', err) /*失败处理*/
        },
        complete: () => {

        }
      })
    }
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