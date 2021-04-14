// pages/indexPages/upCertification/upCertification.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgbox: [],   //存放用户选择图片的临时地址
    certification_array: [],  //存放返回的fileID列表，可用src属性获取image
  },

 /**
  * 选择图片，最多5张
  */
 choosePic: function() {
  const that = this

  wx.chooseImage({
    count: 5,
    sizeType: ['compressed'],
    sourceType: ['album'],
    success: function(res) {
      that.setData({
        imgbox: res.tempFilePaths
      })
    },
    fail: err => {

    }
  })
},

/**
 * 上传图片
 */
upLoadCertifiPic: function() {
  let that = this
  let app = getApp()
  if (!that.data.imgbox.length) {
    wx.showToast({
      icon: 'none',
      title: '图片类容为空'
    });
  } else {
      //上传图片到云存储
      wx.showLoading({
        title: '上传中',
      })
      let promiseArr = [];
      for (let i = 0; i < that.data.imgbox.length; i++) {
        promiseArr.push(new Promise((reslove, reject) => {
          let item = that.data.imgbox[i]; // 小程序临时文件路径
          //时间戳+文件后缀构成不容易重复的新文件名
          const cloudPath = "certification/" + 
                            app.globalData.openid + "/" +
                            new Date().getTime() +
                            item.match(/\.[^.]+?$/)
          wx.cloud.uploadFile({
            cloudPath: cloudPath, // 上传至云端的路径
            filePath: item, 
            success: res => {
              that.setData({
                certification_array: that.data.certification_array.concat(res.fileID)
              });
              console.log("图片上传后的fileID:")
              console.log(res.fileID)//输出上传后图片的返回地址
              reslove();
              wx.hideLoading();
              wx.showToast({
                title: "上传成功",
              })
            },
            fail: res=>{
              wx.hideLoading();
              wx.showToast({
                title: "上传失败",
              })
            }

          })
        }));
      }
      Promise.all(promiseArr).then(res => {   //图片上传完成后执行
        that.setData({
          imgbox:[]
        })
      })
    }
},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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