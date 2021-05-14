// pages/orderPages/placeOrderCustomer/placeOrderCustomer.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    service_type_str:"",
    service_type_num:Number,
    start_date:"",
    order_content: "",
    photo_temp_array: [],
    photo_array: [],
    phone: "",
    addr: "",
    addr_detail: "",
    maintain_date: "",
    maintain_start_time: "9:00",
    maintain_end_time: "18:00"
  },

  inputArea: function (e) {
    this.setData({
      order_content: e.detail.value
    })
    console.log("problem_text:", this.data.order_content)
  },

  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    })
    console.log("phone:", this.data.phone)
  },

  /**
   * 选择图片，最多3张
   */
  choosePic: function () {
    const that = this

    wx.chooseImage({
      count: 3 - that.data.photo_temp_array.length,
      sizeType: ['compressed'],
      success: function (res) {
        that.setData({
          photo_temp_array: that.data.photo_temp_array.concat(res.tempFilePaths)
        })
        that.onShow()
      },
      //fail: err => {
      //  console.error('图片上传失败，请刷新重试', err) /*失败处理*/
      //}
    })
  },

  inputAddr: function (e) {
    this.setData({
      addr: e.detail.value
    })
    console.log("addr_rough:", this.data.addr)
  },

  inputAddrDetail: function (e) {
    this.setData({
      addr_detail: e.detail.value
    })
    console.log("addr detail:", this.data.addr_detail)
  },

  pickerChangeDate: function (e) {
    this.setData({
      maintain_date: e.detail.value
    })
    console.log("maintain date:", this.data.maintain_date)
  },

  pickerChangeStartTime: function (e) {
    this.setData({
      maintain_start_time: e.detail.value
    })
    console.log("maintain start time:", this.data.maintain_start_time)
  },

  pickerChangeEndTime: function (e) {
    this.setData({
      maintain_end_time: e.detail.value
    })
    console.log("maintain end time:", this.data.maintain_end_time)
  },

  /**
   * 提交订单弹窗
   */
  submitPop: function () {
    var that = this
    wx.showModal({
      //cancelColor: 'cancelColor',
      title: '温馨提示',
      content: '您确认提交该订单吗？',
      success(res) {
        if (res.confirm) {
          wx.showLoading({
            title: '正在处理'
          })
          //上传图片到云存储
          let promiseArr = [];
          for (let i = 0; i < that.data.photo_temp_array.length; i++) {
            promiseArr.push(new Promise((reslove, reject) => {
              let item = that.data.photo_temp_array[i]; // 小程序临时文件路径
              //时间戳+文件后缀构成不容易重复的新文件名
              const cloudPath = "order/" +
                app.globalData.openid + "/" +
                new Date().getTime() +
                item.match(/\.[^.]+?$/)
              wx.cloud.uploadFile({
                cloudPath: cloudPath, // 上传至云端的路径
                filePath: item,
                success: res => {
                  that.setData({
                    photo_array: that.data.photo_array.concat(res.fileID)
                  });
                  console.log("图片上传后的fileID:")
                  console.log(res.fileID) //输出上传后图片的返回地址
                  console.log("photo array:", that.data.photo_array)
                  reslove();
                },
                fail: res => {
                  wx.hideLoading();
                  wx.showToast({
                    title: "图片上传失败，请刷新重试。",
                  })
                }
              })
            }));
          }

          let data = {
            /*输入数据，使用JSON格式*/
            "order_type": that.data.service_type_num,
            "order_content": that.data.order_content,
            "photo_array": that.data.photo_array,
            "phone": that.data.phone,
            "adress_simple": that.data.addr,
            "adress_compli": that.data.addr_detail,
            "date": that.data.maintain_date,
            "start_time": that.data.maintain_start_time,
            "end_time": that.data.maintain_end_time
          }
          data = JSON.stringify(data)
          wx.hideLoading()
          wx.navigateTo({
            url: `../facialRecognition/facialRecognition?data=${data}`,
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var service_type_num = JSON.parse(options.service_type_num)
    //var that = this
    this.setData({
      service_type_num: parseInt(service_type_num, 10)
    })
    console.log("service_type_num:", this.data.service_type_num)
    if(service_type_num == 0) {
      this.setData({service_type_str: "管道疏通"});
    } else {
      if(service_type_num == 1){
        this.setData({service_type_str: "家电维修"});
      } else {
        if(service_type_num == 2) {
          this.setData({service_type_str: "水电维修"});
        } else {
          if(service_type_num == 3){
            this.setData({service_type_str: "家电清洗"});
          } else {
            if(service_type_num == 4){
              this.setData({service_type_str: "门窗维修"});
            } else {
              if(service_type_num == 5){
                this.setData({service_type_str: "其它"});
              }
            }
          }
        }
      }
    }
    
    /*
    switch (service_type_num) {
      case 0:that.setData({service_type_str: "管道疏通"});break;
      case 1:that.setData({service_type_str: "家电维修"});break;
      case 2:that.setData({service_type_str: "水电维修"});break;
      case 3:that.setData({service_type_str: "家电清洗"});break;
      case 4:that.setData({service_type_str: "门窗维修"});break;
      case 5:that.setData({service_type_str: "其它"});break;
      default:break;
    }
    */
    
    console.log("service_type_str:", this.data.service_type_str)

    var nowDate = new Date();
    var year = nowDate.getFullYear(), month = nowDate.getMonth() + 1, day = nowDate.getDate(), hour = nowDate.getHours(), minute =(Array(2).join(0) + nowDate.getMinutes()).slice(-2);
    this.setData({
        maintain_date: `${year}-${month}-${day}`,
    })
    /*
    if(hour >= 9 && hour < 18){
      this.setData({
        start_time: `${hour}:${minute}`,            
        maintain_start_time: this.data.start_time,
        maintain_end_time: this.data.start_time
      })
    }
    else{
      this.setData({
        start_time: "9:00",            
        maintain_start_time: this.data.start_time,
        maintain_end_time: this.data.start_time
      })
    }
    */
    console.log("start_date:", this.data.start_date);
    console.log("start_time:", this.data.start_time)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    if(app.globalData.is_logged == false) {
      wx.showToast({
        title: '请先登录！',
        icon: 'error',
        duration: 9000
      })
      wx.switchTab({
        url: '../../myPage/myPage/myPage',
      })
    }
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