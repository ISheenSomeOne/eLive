// pages/team/edu/unifiedPayment/unifiedPayment.js
var util = require('../../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    needCar: true, //是否需要车辆
    needHotel: true, //是否需要酒店住宿
    examSiteList: ['点击选择考点'], //选择考点的list
    examSiteIndex: 0, //选择的考点的下标
    startingList: ['点击选择出发点'], //出发点列表
    startingIndex: 0, //选择的出发点下标配
    liveWay: 1, //入住方式下标
    examId: '', //考试id
    nameShow: '',
    telShow: '',
    idCardShow: '',
    contacts: '',
    tel: '',
    idcard: '',
    hasBeenCompleted: false,
    examInfo: '',
    invitationCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let examId = ''
    if (decodeURIComponent(options.q).split('=')[1]) {
      examId = decodeURIComponent(options.q).split('=')[1]
    } else if (options.examId) {
      examId = options.examId
    } else {
      wx.showToast({
        title: '数据获取异常，请联系客服',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      examId: examId,
      // examId: 51
    })
    // this.checkUserInfo()
  },

  onShow: function (e) {
    this.checkUserInfo()
  },

  checkUserInfo: function () {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage?navigateBack=true', //授权页面
      })
    } else {
      this.getInit()
    }
  },

  // 页面初始化数据
  getInit: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/exam/getUnifiedPaymentInfo',
      data: {
        examId: that.data.examId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'GET',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          let data = res.data.data
          
          data.examStartDate = util.formatDate(new Date(data.examStartDate))
          data.examEndDate = util.formatDate(new Date(data.examEndDate))
          data.checkinDate = util.formatDate(new Date(data.checkinDate))
          data.checkoutDate = util.formatDate(new Date(data.checkoutDate))
          that.setData({
            examInfo: data
          })
        } else if(res.data.code == -1){
          wx.navigateTo({
            url: '/pages/errorPage/errorPage?errorCont=' + res.data.msg,
          })
        } else if (res.data.code == 202) {
          //已支付，跳转到订单
          wx.navigateTo({
            url: '/pages/team/edu/signUpQR/signUpQR?examId=' + that.data.examId
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //支付
  pay:function(){
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
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
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
                        url: '/pages/team/edu/signUpQR/signUpQR?examId=' + that.data.examId
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
        } else if(res.data.code == -1){
          wx.navigateTo({
            url: '/pages/errorPage/errorPage?errorCont=' + res.data.msg,
          })
        } else if (res.data.code == 202) {
          //已支付，跳转到订单
          wx.navigateTo({
            url: '/pages/team/edu/signUpQR/signUpQR?examId=' + that.data.examId
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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