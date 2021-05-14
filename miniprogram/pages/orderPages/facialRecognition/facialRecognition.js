// pages/orderPages/facialRecognition/facialRecognition.js
Page({
  /**
   * 页面的初始数据
   */
  data : {
    order_data_json: "",
    time: 10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
    this.setData({
      order_data_json: options.data
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
      var that = this
      var time = that.data.time
      var interval = setInterval(function () {
         time--
         that.setData({
            time: time
         })
        if (time==0){
          clearInterval(interval)
          that.recognize()
        }
      },1000)
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
    wx.showLoading({
      title: '识别中',
    })
    this.ctx.takePhoto({
      quality: 'high',
      success: (res_photo) => {
        //console.log('临时url:', res_photo.tempImagePath, typeof(res_photo.tempImagePath))
        //console.log('改后url:', wx.getFileSystemManager().readFileSync(res_photo.tempImagePath, 'base64'), typeof(wx.getFileSystemManager().readFileSync(res_photo.tempImagePath, 'base64')))
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
          setTimeout(function () {
            wx.hideLoading()
          }, 10)
          if(res_recog.data.FaceInfos == null) {
            var that = this
            wx.showModal({
              title: '提示',
              content: '人脸识别失败，请重试。',
              showCancel: false,
              success (res) {
                /*while (!res.confirm) {
                  ;
                }*/
                that.setData({
                  time: 10
                })
                that.onShow()
              }
            })
          }
          else {
            if (res_recog.data.FaceInfos[0].FaceAttributesInfo.Gender < 40) {
            wx.showToast({
              title: '验证通过',
              mask: true,
              duration: 500
            })

            //提交订单
            wx.showLoading()
            var order_data = JSON.parse(this.data.order_data_json)
            wx.cloud.callFunction({
              name: 'add_order_form_single',
              /*云函数名字，不能重复*/
              data: {
                /*输入数据，使用JSON格式*/
                order_data
              },
              success: res => {
                console.log(res) /*接收后端返回数据*/
                if (res.result.errCode != 0) {
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 10)
                  wx.showModal({
                    title: '提示',
                    content: res.result.errMsg,
                  })
                  wx.navigateBack({
                    delta: 1,
                  })
                } else {
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 10)
                  wx.showToast({
                    title: '订单提交成功',
                    duration: 3000
                  })
                  wx.switchTab({
                    url: '../customerOrder/customerOrder',
                  })
                }
              },
              fail: err => {
                console.error('云函数[add_user-info]调用失败', err) /*失败处理*/
                setTimeout(function () {
                  wx.hideLoading()
                }, 10)
                wx.showModal({
                  title: '提示',
                  content: '订单提交失败，请刷新重试',
                })
              },
            })
          }
            else{
              setTimeout(function () {
                wx.hideLoading()
              }, 10)
              wx.showModal({
                content: '验证失败',
                showCancel: false
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

  skip: function() {
    clearInterval(interval)
    //提交订单
    wx.showLoading()
    var order_data = JSON.parse(this.data.order_data_json)
    wx.cloud.callFunction({
      name: 'add_order_form_single',
      /*云函数名字，不能重复*/
      data: {
        /*输入数据，使用JSON格式*/
        order_data
      },
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          setTimeout(function () {
            wx.hideLoading()
          }, 10)
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
          })
          wx.navigateBack({
            delta: 1,
          })
        } else {
          setTimeout(function () {
            wx.hideLoading()
          }, 10)
          wx.showToast({
            title: '订单提交成功',
            duration: 3000
          })
          wx.switchTab({
            url: '../customerOrder/customerOrder',
          })
        }
      },
      fail: err => {
        console.error('云函数[add_user-info]调用失败', err) /*失败处理*/
        setTimeout(function () {
          wx.hideLoading()
        }, 10)
        wx.showModal({
          title: '提示',
          content: '订单提交失败，请刷新重试',
        })
      }
    })
  }
})