// pages/recharge/recharge.js
var app = getApp()
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '充值中心', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    rechargeInfo: [],
    paying: false,
    consumptionId: '',
    price: '',
    rechargePresenterId: '',
    want: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.want) {
      that.setData({
        want: options.want
      })
    }
    that.requestRecharge()
  },

  //选择充值金额
  recharge: util.throttle(function (e) {
    var that = this;
    var index = e.currentTarget.dataset.index;
    //查看是否实名
    that.needVerified(index)
  }, 2000),

  //充值请求
  requestSubmitRecharge: function (index) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/consumption/wxTopUp',
      data: {
        openid: wx.getStorageSync('openid'),
        rechargeId: index
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        console.log('=====', res.data)
        if (res.data.code == 200) {
          that.setData({
            consumptionId: res.data.data.consumptionId,
            price: res.data.data.price,
            paying: true,
            rechargePresenterId: index
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '操作失败',
            icon: 'none'
          })
          wx.hideLoading()
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //请求查看充值信息
  requestRecharge: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/rechargePresenter/wxGetRechargeAmount',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        // console.log('请求查看会员中心信息', res.data)
        if (res.data.code == 200) {
          that.setData({
            rechargeInfo: res.data.data
          })
          wx.hideLoading()
        } else {
          wx.hideLoading()
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 支付接口
   */
  wxpay: function () {
    let that = this;
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/consumption/wxPay',
      data: {
        openid: wx.getStorageSync('openid'),
        consumptionId: that.data.consumptionId,
        price: that.data.price
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
                url: app.globalData.rootApi + '/zxkj/consumption/wxPayOk',
                data: {
                  consumptionId: that.data.consumptionId,
                  rechargePresenterId: that.data.rechargePresenterId,
                  openid: wx.getStorageSync('openid')
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function (res) {
                  if (res.data.code == 200) {
                    console.log(1111111111)
                    console.log(that.data.want)
                    if (that.data.want == "toMyOrder") {
                      //去我的订单
                      wx.redirectTo({
                        url: '/pages/myOrder/myOrder'
                      })
                    } else if (that.data.want == "toLast") {
                      //返回上一页
                      wx.navigateBack({
                        delta: 1
                      })
                    } else {
                      wx.redirectTo({
                        url: '/pages/vip/vip'
                      })
                    }
                    wx.hideLoading()
                  } else if (res.data == false) {
                    console.log('失败是不可能的')
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
  },

  //关闭支付
  closePay: function () {
    this.setData({
      paying: false,

    })
  },

  //查询实名接口
  needVerified: function (index) {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/member/wxWhetherTheRealName',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        console.log('获取实名信息---', res.data)
        if (res.data.code == 0) {
          wx.hideLoading()
          that.requestSubmitRecharge(index)
        } else {
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/verified/verified',
          })
        }
      },
      fail: function (res) {
        console.log(res)
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