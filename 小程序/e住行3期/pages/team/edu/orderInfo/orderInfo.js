// pages/team/edu/orderInfo/orderInfo.js
let app = getApp()
var util = require('../../../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    orderInfo: '', //订单信息
    timeOut: '', //超时时间
    isTimeOut: false,//是否超时
    setInter: '', //定时器
    remainingTimeMinu: '15', //时间-小时
    remainingTimeSec: '00', //时间-分钟
    examOrderId: '',//考试订单id
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    this.setData({
      examId: options.examId
    })
    this.init()
  },

  //初始化支付界面
  init: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/examOrder/getExamOrderInfo',
      data: {
        examId: that.data.examId,
        openId: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        console.log('---', res.data)
        if (res.data.code == 200) {
          let orderInfo = res.data.data

          let createTime = new Date(orderInfo.createTime) //获取订单创建时间
          createTime.setMinutes(createTime.getMinutes() + 15) //时间加15分钟
          
          var year = createTime.getFullYear(); //得到年份
          var month = createTime.getMonth() + 1; //得到月份
          var date = createTime.getDate(); //得到日期
          var hour = createTime.getHours(); //得到小时
          var minu = createTime.getMinutes(); //得到分钟
          let timeOut = year + '年' + month + '月' + date + '日' + hour + ':' + minu

          orderInfo.examStartDate = util.formatDate(new Date(orderInfo.examStartDate))
          orderInfo.examEndDate = util.formatDate(new Date(orderInfo.examEndDate))
          orderInfo.checkinDate = util.formatDate(new Date(orderInfo.checkinDate))
          orderInfo.checkoutDate = util.formatDate(new Date(orderInfo.checkoutDate))

          // let formatStartingDate = new Date(orderInfo.startingDate)
          // orderInfo.startingDate = util.formatDate(formatStartingDate)
          // orderInfo.startingTime = formatStartingDate.getHours() + ':' + formatStartingDate.getMinutes()

          that.setData({
            orderInfo: orderInfo,
            timeOut: timeOut,
            examOrderId: orderInfo.examOrderId
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            duration: 2000,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //付款
  pay: util.throttle(function(){
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/exam/examOrderPay',
      data: {
        openId: wx.getStorageSync('openid'),
        examId: that.data.examId,
        examOrderId: that.data.examOrderId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('支付的res.data', res.data)
        if (res.data.data.timeStamp) {
          wx.requestPayment({
            timeStamp: res.data.data.timeStamp,
            nonceStr: res.data.data.nonceStr,
            package: res.data.data.package,
            signType: 'MD5',
            paySign: res.data.data.paySign,
            success(res) {
              console.log("统一下单接口成功");
              wx.request({
                url: app.globalData.rootApi + '/zxkj/exam/paymentCompletesTheCallback',
                data: {
                  examOrderId: that.data.examOrderId,
                  examId: that.data.examId
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data.code == 200) {
                    wx.hideLoading()
                    wx.navigateTo({
                      url: '/pages/team/edu/orderInfo/orderInfo?examId=' + that.data.examId
                    })
                  } else {
                    wx.showToast({
                      title: '服务器错误',
                      duration: 2000,
                      icon: "none"
                    })
                    wx.hideLoading()
                  }
                },
                fail: function (res) {
                  wx.hideLoading()
                }
              })
            },
            fail(res) {
              console.log("统一下单接口失败");
              wx.hideLoading()
            },
            complete(res) {
              console.log('支付接必回调函数---')
            }
          })
        } else {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
          wx.hideLoading()
        }
      }
    })
  },1000),

  //完成关闭
  done:function(){
    wx.navigateTo({
      url: '/pages/team/edu/orderList/orderList', //订单列表
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
    let that = this
    //将计时器赋值给setInter
    that.data.setInter = setInterval(function () {
      let now = new Date()
      let remainingTime = that.data.orderInfo.createTime - now
      let remainingTimeMinu = parseInt(remainingTime / 60000)
      let remainingTimeSec = parseInt((remainingTime / 1000) % 60)
      if (remainingTimeSec < 0) {
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
        that.setData({
          isTimeOut: true
        })
      }
      if (remainingTimeMinu < 10) {
        remainingTimeMinu = "0" + remainingTimeMinu
      }
      if (remainingTimeSec < 10) {
        remainingTimeSec = "0" + remainingTimeSec
      }
      that.setData({
        remainingTimeMinu: remainingTimeMinu,
        remainingTimeSec: remainingTimeSec
      })
      //时间到
      if ((that.data.remainingTimeMinu == '00') && (that.data.remainingTimeSec == '00')) {
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
        that.setData({
          isTimeOut: true
        })
      }
    }, 1000);
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