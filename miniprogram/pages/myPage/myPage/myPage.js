// pages/myPage/myPage/myPage.js
var app = getApp()
const content = ""
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "点击登录",
    avatarUrl: "../../../images/LOGO.png",
    type: "",
    is_logged: "",
    is_manager: ""
  },

  getUserProfile: function () {
    const app = getApp()
    const that = this
    wx.getUserProfile({
      desc: '用于完善用户信息',
      success: (res) => {
        wx.showLoading({
          title: '正在登录',
        })
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl,
          is_manager: res.is_manager
        })
        console.log(that.data)
        wx.cloud.callFunction({
          name: 'login',
          data: {
            "nickName": that.data.nickName,
            "avatarUrl": that.data.avatarUrl
          },
          success: res => {
            console.log(res.result) /*接收后端返回数据*/
            app.globalData.userInfo = res.result.data.user_detail.userInfo
            app.globalData.type = res.result.data.user_detail.type
            app.globalData.is_logged = true
            app.globalData.openid = res.result.data.user_detail.openid
            app.globalData.is_manager = res.result.data.user_detail.is_manager
            console.log(app.globalData)
            this.setData({
              type: app.globalData.type,
              is_logged: app.globalData.is_logged,
              is_manager: app.globalData.is_manager
            })
            console.log(this.data)
            if (res.result.data.is_new) {
              wx.showModal({
                title: '欢迎',
                content: '欢迎进入ForHer维修服务！我们承诺未经授权不会获取您的任何个人信息，且仅在为提供服务所必需的时间内保留您的个人信息，服务完成后将对您的个人信息进行删除处理。为保障您的相关权利，请稍后前往‘我的’-‘联系我们’中阅读《隐私保护指引》。该指引将向您说明FOR HER维修服务开发团队会如何收集、使用和存储您的个人信息及您享有何种权利，请您在使用FOR HER维修之前，阅读、了解并同意本隐私指引。继续使用ForHer维修将视为您已阅读并同意《隐私保护指引》。',
                showCancel: false,
                success (res) {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  } else if (res.cancel) {
                    console.log('用户点击取消')
                  }
                }
              })
              
              wx.redirectTo({
                url: '../../indexPages/askIdentity/askIdentity',
              })
            }
            wx.hideLoading()
          },
          fail: err => {
            console.error('云函数[login]调用失败', err) /*失败处理*/
            wx.hideLoading()
            wx.showModal({
              title: '提示',
              content: res.result.errMsg,
            })
          },
          complete: () => {

          }
        })
      }
    })
  },

  depositPop: function (params) {
    wx.showToast({
      title: '更多功能，敬请期待',
      icon: 'none'
    })
  },

  pleaseLogin: function (params) {
    wx.showToast({
      title: '请先登录',
      icon: 'error'
    })
  },

  goto_myComments: function (params) {
    wx.navigateTo({
      url: '../myComments/myComments',
    })
  },

  goto_contactUs: function (params) {
    wx.navigateTo({
      url: '../contactUs/contactUs',
    })
  },

  goto_complaints: function (params) {
    wx.navigateTo({
      url: '../complaints/complaints',
    })
  },

  goto_complaints_all: function (params) {
    wx.navigateTo({
      url: '../complaints_all/complaints_all',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (wx.getUserProfile) {
      this.setData({
        canIUseGetUserProfile: true
      })
      console.log("canIUseGetUserProfile改变为true")
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