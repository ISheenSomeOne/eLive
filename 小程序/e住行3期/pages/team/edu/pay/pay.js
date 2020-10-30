// pages/team/edu/pay/pay.js
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
    examPayInfo: '',//支付信息
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      examId: options.examId,
      examOrderId: options.examOrderId
    })
    this.init()
  },

  //初始化支付界面
  init:function(){
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/exam/howMuchDoesThisOrderCost',
      data: {
        examId: that.data.examId,
        examOrderId: that.data.examOrderId
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
          that.setData({
            examPayInfo: res.data.data
          })
        } else if (res.data.code == 202){
          wx.showToast({
            title: '订单已支付',
            duration: 2000,
            icon: "none"
          })
          setTimeout(() => {
            wx.navigateTo({
              url: '/pages/team/edu/orderInfo/orderInfo?examId=' + that.data.examId
            })
          }, 1500);
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

  //点击支付
  pay: util.throttle(function(){
    let that = this
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