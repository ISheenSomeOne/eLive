// pages/bindOrder/bindOrder.js
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
      title: '绑定订单', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    testImg: "../image/hotelImg/hotel1.jpg01.png"
  },



  /**
   * 获取名字
   */
  getName: function (e) {
    var name = e.detail.value
    this.setData({
      name: name
    })
  },

  /**
   * 获取手机号
   */
  getTel: function (e) {
    var tel = e.detail.value
    this.setData({
      tel: tel
    })
  },

  /**
   * 提交按钮
   */
  confirm: util.throttle(function () {
    let that = this;

    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      that.verifiedRequest()
    }
  }, 1000),
  //实名接口
  verifiedRequest: function () {
    let that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.tel.length == 0) {
      wx.showToast({
        title: '手机号码不能为空',
        duration: 2000,
        icon: 'none'
      });
    } else if (!myreg.test(that.data.tel)) {
      wx.showToast({
        title: '手机号码格式有误!',
        duration: 2000,
        icon: 'none'
      });
    } else {
      console.log('开始提交')
      //实名认证接口
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      wx.request({
        url: app.globalData.rootApi + '/zxkj/member/orderVestedMember',
        data: {
          openId: wx.getStorageSync('openid'),
          memberName: that.data.name,
          memberTel: that.data.tel,
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
          console.log('实名认证返回值---', res.data)
          if (res.data.code == 200) {
            wx.showToast({
              title: '成功绑定订单',
              duration: 2000,
              icon: "success"
            })
            setTimeout(() => {
              wx.switchTab({
                url: '/pages/checkIn/checkIn',
              })
            }, 2000);
          } else if (res.data.code == 201 || res.data.code == 202 || res.data.code == 203 || res.data.code == 204 || res.data.code == 205) {
            wx.showToast({
              title: res.data.msg,
              duration: 3000,
              icon: "none"
            })
          } else {
            wx.showModal({
              title: '提示',
              content: '服务器错误',
              showCancel: false,
              confirmText: '首页看看',
              success: function (res) {
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
          console.log('实名认证失败')
          wx.showToast({
            title: '订单绑定失败',
            duration: 1000,
            icon: "none"
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '实名认证失败,请重新认证',
          //   success: function(res) {
          //     wx.navigateTo({
          //       url: '/pages/verified/verified',
          //     })
          //   }
          // })
        }
      })

    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(1111111111111)
    // console.log(decodeURIComponent(options.q).split('=')[1])
    let that = this;
    let orderId = ''
    if (decodeURIComponent(options.q).split('=')[1]) {
      orderId = decodeURIComponent(options.q).split('=')[1]
    } else if (options.orderId) {
      orderId = options.orderId
    } else {
      wx.showToast({
        title: '数据获取异常，请联系客服',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      orderId: orderId,
      // orderId: 2912
    })
  },

  //请求页面初始化数据
  getInit: function () {
    console.log('------获取实名信息start')
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
        if (res.data.code == 0) { //已经实名过，跳转入住页面
          wx.hideLoading()
          wx.showToast({
            title: '您已实名，即将跳转',
            icon: 'none',
            duration: 2000
          })
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/checkIn/checkIn',
            })
          }, 2000);
        } else { //还未实名，请求初始化信息
          wx.request({
            url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetOrderRoomInfoByOrderId',
            data: {
              orderId: that.data.orderId,
              openid: wx.getStorageSync('openid')
            },
            method: 'POST',
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            success: function (res) {
              wx.hideLoading()
              let orderInfo = res.data
              console.log('orderInfo---', orderInfo)
              if (res.data.code == 200) {
                orderInfo.roomTypeImgs = app.globalData.imgApi + orderInfo.roomTypeImgs
                that.setData({
                  orderInfo: orderInfo,
                  orderRoomInTime: orderInfo.orderRoomInTime.substring(5, 10),
                  orderRoomOutTime: orderInfo.orderRoomOutTime.substring(5, 10),
                })
              } else if (res.data.code == -1) {
                wx.showModal({
                  title: '提示',
                  content: '未查询到订单',
                  showCancel: false,
                  confirmText: '首页看看',
                  success(res) {
                    if (res.confirm) {
                      wx.switchTab({
                        url: '/pages/start/start',
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              } else {
                wx.showModal({
                  title: '提示',
                  content: '服务器错误',
                  showCancel: false,
                  confirmText: '首页看看',
                  success: function (res) {
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

            }
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  errImg: function (e) {
    var _errImg = e.target.dataset.errImg;
    var _objImg = "'" + _errImg + "'";
    var _errObj = {};
    _errObj[_errImg] = "../image/hotelImg/hotel1.jpg01.png";
    console.log(e.detail.errMsg + "----" + _errObj[_errImg] + "----" + _objImg);
    this.setData(_errObj); //注意这里的赋值方式...
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
    } else {
      that.getInit()
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