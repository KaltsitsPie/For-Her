// pages/orderPages/facialRecognition/facialRecognition.js
Page({
  /**
   * 页面的初始数据
   */

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
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

  },

  recognize: function() {
    this.ctx.takePhoto({
      quality: 'high',
      success: (res_photo) => {
        console.log('临时url:', res_photo.tempImagePath, typeof(res_photo.tempImagePath))
        console.log('改后url:', wx.getFileSystemManager().readFileSync(res_photo.tempImagePath, 'base64'), typeof(wx.getFileSystemManager().readFileSync(res_photo.tempImagePath, 'base64')))
        wx.serviceMarket.invokeService({
          service: 'wx2d1fd8562c42cebb',
          api: 'detectFace',
          data: {
            "Action": "DetectFace",
            "Image":wx.getFileSystemManager().readFileSync(res_photo.tempImagePath, 'base64'),
            "NeedFaceAttributes": 1,
          },
        }).then(res_recog => {
          console.log('invokeService success', res_recog)
          if(res_recog.data.FaceInfos == null) {
            wx.showToast({
              title: '出错啦！请重试。',
              mask: true,
            })
          }
          else {
            if (res_recog.data.FaceInfos[0].FaceAttributesInfo.Gender < 40) {
            wx.showToast({
              title: '验证通过',
              mask: true,
            })

            //提交订单

            wx.redirectTo({
              url: '../customerOrder/allOrder/allOrder',
            })
          }
            else{
              wx.showToast({
                title: '验证失败',
                mask: true,
              })
              wx.navigateBack({
                delta: 1,
              })
            }
          }
        }).catch(err => {
          console.error('invokeService fail', err)
          wx.showModal({
            title: 'fail',
            content: err,
          })
        })
      },
      fail: function(res_photo) {},
      complete: function(res_photo) {},
    })
  },
  
  error(e) {
    console.log(e.detail)
  }
})