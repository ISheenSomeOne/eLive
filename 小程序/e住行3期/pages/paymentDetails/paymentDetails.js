// pages/paymentDetails/paymentDetails.js
let app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: '支付房费', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    orderId: '',
    paying: false,
    payWay: false,
    paymentMethod: 1, //付款方式  1.余额  2.微信
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(1111111111111111111111)
    // console.log(options)
    let that = this;
    let orderId = decodeURIComponent(options.q).split('=')[1]
    that.setData({
      orderId: orderId
      // orderId: 2918
    })
  },

  //选择余额支付
  chooseYue: function () {
    this.setData({
      paymentMethod: 1,
      payWay: false,
      paying: true
    })
  },

  //选择微信支付
  chooseWx: function () {
    this.setData({
      paymentMethod: 2,
      payWay: false,
      paying: true
    })
  },

  //充值
  recharge: function () {
    wx.navigateTo({
      url: '/pages/recharge/recharge?want=toLast',
    })
  },

  //代付
  // toProxyPay: function() {
  //   let that = this
  //   wx.navigateTo({
  //     url: '/pages/proxyPay/proxyPay?orderId=' + that.data.orderId,
  //   })
  // },

  //取消支付
  closePay: function () {
    let that = this
    that.setData({
      payWay: false,
      paying: false
    })
  },

  //选择支付方式
  pays: function () {
    this.setData({
      payWay: true,
      paying: false
    })
  },

  //请求页面初始化数据
  getInit: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/order/realNameClient/checkTheAmountAndDetailsOfTheOrder',
      data: {
        openid: wx.getStorageSync('openid'),
        orderId: that.data.orderId
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
          let orderInfo = res.data.data
          console.log('orderInfo---', res)
          let checkinTime = new Date(orderInfo.checkInTime)
          let liveTime = []

          for (let i = 0; i < orderInfo.numberOfDaysOfHousing; i++) {
            let year = checkinTime.getFullYear()
            let month = checkinTime.getMonth() + 1
            let day = checkinTime.getDate() + i
            let sj = year + '-' + month + '-' + day
            liveTime.push(sj)
          }
          that.setData({
            liveTime: liveTime,
            orderInfo: orderInfo
          })
        } else if (res.data.code == -1) {
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/start/start',
                })
              }
            }
          })
        } else if (res.data.code == -2) {
          wx.showToast({
            title: '订单已支付',
            icon: 'success',
            duration: 2000
          })
          setTimeout(() => {
            wx.navigateTo({ //跳转到授权页面
              url: '/pages/bindOrder/bindOrder?orderId=' + that.data.orderId, //授权页面
            })
          }, 2000);
        } else {
          wx.showModal({
            title: '提示',
            content: '服务器错误',
            showCancel: false,
            success(res) {
              if (res.confirm) {
                wx.switchTab({
                  url: '/pages/start/start',
                })
              }
            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
      }
    })
  },

  //选择支付方式
  pay: function () {
    let that = this
    that.setData({
      payWay: true
    })
  },

  //余额支付
  yuePay: function () {
    let that = this
    wx.showModal({
      title: '提示',
      content: '确定使用余额支付吗',
      success(res) {
        if (res.confirm) {
          that.checkPay()
        }
      }
    })
  },

  //余额支付请求
  yuePayRequest: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxBalancePay',
      data: {
        openid: wx.getStorageSync('openid'),
        orderId: that.data.orderId,
        payAll: that.data.orderInfo.payAll
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        console.log('请求查看积分记录信息', res.data)
        if (res.data.code == 200) {
          that.wxPayOK()
        } else if (res.data.code == 0 || res.data.code == 1 || res.data.code == -4) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showModal({
            title: '服务器错误',
            content: '请联系客服',
            showCancel: false,
            success(res) {
              if (res.confirm) {}
            }
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //支付成功后操作
  wxPayOK: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPayOk',
      data: {
        orderId: that.data.orderId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data == true) {
          //支付成功后将订单状态改为入住中
          that.submitOrderAndCheckin()
        } else if (res.data == false) {
          console.log('失败是不可能的')
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //余额支付前判断是否已付钱
  checkPay: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/order/realNameClient/checkTheAmountAndDetailsOfTheOrder',
      data: {
        orderId: that.data.orderId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          that.yuePayRequest()
        } else if (res.data.code == -1) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
        } else if (res.data.code == -2) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.redirectTo({
              url: '/pages/bindOrder/bindOrder?orderId=' + that.data.orderId,
            })
          }, 2000);
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //支付成功后将订单状态改为入住中
  submitOrderAndCheckin: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/order/realNameClient/submitOrderAndCheckin',
      data: {
        orderId: that.data.orderId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          wx.redirectTo({
            url: '/pages/bindOrder/bindOrder?orderId=' + that.data.orderId,
          })
        } else if (res.data.code == -1 || res.data.code == -2 || res.data.code == -3 || res.data.code == -4) {
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 3000
          })
          console.log('失败是不可能的')
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 3000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 微信支付
   */
  wxpays: util.throttle(function (e) {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      that.wxpay()
    }
  }, 2000),

  /**
   * 微信支付接口
   */
  wxpay: function () {
    let that = this;

    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPay',
      data: {
        openid: wx.getStorageSync('openid'),
        orderId: that.data.orderId,
        totalPrice: that.data.orderInfo.paramMoney
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        if (res.data.timeStamp) {
          console.log(res.data.nonceStr);
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success(res) {
              console.log("统一下单接口成功");

              wx.request({
                url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPayOk',
                data: {
                  orderId: that.data.orderId,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data == true) {
                    wx.showToast({
                      title: '支付成功',
                      icon: 'success',
                      duration: 1000
                    })
                    setTimeout(function () {
                      that.wxPayOK()
                    }, 1000)
                  } else if (res.data == false) {
                    console.log('失败是不可能的')
                  }
                },
                fail: function (res) {

                }
              })
            },
            fail(res) {
              console.log("统一下单接口失败");
            },
            complete(res) {
              console.log('支付接必回调函数---')
              console.log(res)
            }
          })
        } else {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
        }
      }
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
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    }
    that.getInit()
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