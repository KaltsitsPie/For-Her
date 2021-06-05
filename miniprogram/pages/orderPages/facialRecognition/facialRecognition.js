// pages/orderPages/facialRecognition/facialRecognition.js
var app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data : {
    order_data: "",
    time: 10,
    interval: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.ctx = wx.createCameraContext()
    this.setData({
      order_data: JSON.parse(options.data)
    })
    wx.showModal({
      title: '提示',
      showCancel: true,
      cancelText: '取消',
      cancelColor: "#000000",
      content: '为了保证双方安全，下面将对您的性别进行验证。ForHer维修承诺您的信息仅用于验证，不会被收集及保存。',
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
      that.data.interval = setInterval(function () {
         time--
         that.setData({
            time: time
         })
        if (time==0){
          clearInterval(that.data.interval)
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
      quality: 'normal',
      success: (res_photo) => {
        wx.serviceMarket.invokeService({
          service: 'wx2d1fd8562c42cebb',
          api: 'detectFace',
          data: {
            "Action": "DetectFace",
            //以下调用摄像头拍摄一张照片转换为base64格式直接作为调用api的data，后台不会保存任何用户的人脸信息
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
              content: '未识别到人脸，请将面部置于方框中心。',
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
            //提交订单
            var that = this
            wx.showLoading({
              title: "验证成功，提交中"
            })
            var order_data = that.data.order_data
            //console.log("user type:", app.globalData.type)
            if(app.globalData.type == 1){
              wx.cloud.callFunction({
                name: 'add_order_form_single',
                /*云函数名字，不能重复*/
                data:order_data,
                success: res => {
                  console.log(res) /*接收后端返回数据*/
                  if (res.result.errCode != 0) {
                    setTimeout(function () {
                      wx.hideLoading()
                    }, 10)
                    wx.showModal({
                      title: '提示',
                      content: res.result.errMsg,
                      success(res){
                        setTimeout(
                          () => {
                            wx.navigateBack({
                              delta: 1,
                            })
                          },
                          1000
                        )
                        
                      }
                    })
                    
                  } else {
                    wx.showToast({
                      title: '订单提交成功',
                      duration: 3000,
                      success(res){
                        setTimeout(function () {
                          wx.hideLoading()
                        }, 1)
                        setTimeout(
                          () => {
                            wx.switchTab({
                              url: '../customerOrder/customerOrder',
                            })
                          },
                          3000
                        )
                      }
                    })
                  }
                },
                fail: err => {
                  console.error('云函数[add_user-info]调用失败', err) /*失败处理*/
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 10)
                  wx.showToast({
                    title: "网络环境不佳",
                    icon: "error",
                    duration: 5000,
                    success(res){
                      setTimeout(
                        () => {
                          wx.navigateBack({
                            delta: 1,
                          })
                        },
                        3000
                      )
                    }
                  })
                }
              })
          } else {
            wx.cloud.callFunction({
              name: 'm_take_order',
              /*云函数名字，不能重复*/
              data: order_data,
              success: res => {
                console.log(res) /*接收后端返回数据*/
                if (res.result.errCode != 0) {
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 1)
                  wx.showModal({
                    title: '提示',
                    content: res.result.errMsg,
                    success(res){
                      wx.navigateBack({
                        delta: 1,
                      })
                    }
                  })
                } else {
                  //var order_id = order_data.order_id
                  var order = res.result.data
                  wx.showToast({
                    title: '接单成功',
                    duration: 3000,
                    success: () => {
                      setTimeout(function () {
                        wx.hideLoading()
                      }, 1)
                      setTimeout(
                        () => {
                          wx.redirectTo({
                            url: '../orderDetail/orderDetail?order=' + JSON.stringify(order),
                          })
                        },
                        3000
                      )
                    }
                  })
                }
              },
            })
          }
          } else{
              wx.showToast({
                title: '验证失败',
                icon: 'error',
                duration: 3000,
                success(res){
                  setTimeout(function () {
                    wx.hideLoading()
                  }, 1)
                  setTimeout(
                    () => {
                      wx.navigateBack({
                        delta: 1,
                      })
                    },
                    3000
                  )
                }
              })
            }
          }
        }).catch(err => {
          console.error('invokeService fail', err)
          setTimeout(function () {
            wx.hideLoading()
          }, 1)
          wx.showModal({
            title: '提示',
            content: '识别失败，请重试。',
            showCancel: false,
            success (res) {
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        })
      },
      fail: function(res_photo) {},
      complete: function(res_photo) {},
    })
  },

  skip: function() {
    clearInterval(this.data.interval)
    //提交订单
    wx.showLoading({
      title: "提交中"
    })
    var order_data = this.data.order_data
    console.log("order_data:", this.data.order_data)
    if(app.globalData.type == 1) {
    wx.cloud.callFunction({
      name: 'add_order_form_single',
      /*云函数名字，不能重复*/
      data:order_data,
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          setTimeout(function () {
            wx.hideLoading()
          }, 1)
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
            success(res){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
          
        } else {
          wx.showToast({
            title: '订单提交成功',
            duration: 3000,
            success(res){
              setTimeout(function () {
                wx.hideLoading()
              }, 1)
              setTimeout(
                () => {
                  wx.switchTab({
                    url: '../customerOrder/customerOrder',
                  })
                },
                3000
              )
            }
          })
        }
      },
      fail: err => {
        setTimeout(function () {
          wx.hideLoading()
        }, 1)
        wx.showToast({
          title: "网络环境不佳",
          icon: "error",
          duration: 3000,
          success(res){
            setTimeout(
              () => {
                wx.navigateBack({
                  delta: 1,
                })
              },
              3000
            )
          }
        })
      }
    })
  } else {
    wx.cloud.callFunction({
      name: 'm_take_order',
      /*云函数名字，不能重复*/
      data: order_data,
      success: res => {
        console.log(res) /*接收后端返回数据*/
        if (res.result.errCode != 0) {
          setTimeout(function () {
            wx.hideLoading()
          }, 10)
          wx.showModal({
            title: '提示',
            content: res.result.errMsg,
            success(res){
              wx.navigateBack({
                delta: 1,
              })
            }
          })
        } else {
          //var order_id = order_data.order_id
          var order = res.result.data
          wx.showToast({
            title: '接单成功',
            duration: 3000,
            success: () => {
              setTimeout(function () {
                wx.hideLoading()
              }, 1)
              setTimeout(
                () => {
                  wx.redirectTo({
                    url: '../orderDetail/orderDetail?order=' + JSON.stringify(order),
                  })
                },
                3000
              )
            }
          })
        }
      },
    })
  }
  }
})