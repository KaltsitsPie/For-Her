// pages/myPage/myPage/myPage.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    nickName: "点击登录",
    avatarUrl: "../../../images/user-unlogin.png"
  },

  getUserProfile: function () {
    const app = getApp()
    const that = this
    wx.getUserProfile({
      desc: '用于完善用户信息', 
      success: (res) => {
        that.setData({
          nickName: res.userInfo.nickName,
          avatarUrl: res.userInfo.avatarUrl
        })
        console.log(that.data)
        wx.cloud.callFunction ({
          name: 'login',
          data: 
          {
            "nickName": that.data.nickName,
            "avatarUrl": that.data.avatarUrl
          },
          success: res => {
            console.log(res.result)				/*接收后端返回数据*/
            app.globalData.userInfo = res.result.data.userInfo
            app.globalData.type = res.result.data.type
            app.globalData.is_logged = true
            app.globalData.openid = res.result.data.openid
            console.log(app.globalData)
            if (res.result.data.is_new) {
              wx.redirectTo({
                url: '../../indexPages/askIdentity/askIdentity',
              })
            }
          },
          fail: err => {
            console.error('云函数[add_user-info]调用失败', err)	/*失败处理*/
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