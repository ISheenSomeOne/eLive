// pages/continue/continue.js
let app = getApp()
var util = require('../../utils/util.js')
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear()
var DATE_MONTH = new Date().getMonth() + 1
var DATE_DAY = new Date().getDate()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '续房', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    paying: false,
    payWay: false,
    checkInDate: '', //离店日期
    checkOutDate: '', //续房至
    dateCount: '1', //共几晚
    endYears: '',
    endMonths: '',
    endYears: '',
    roomList: '',
    orderId: '',
    newOrderId: '',
    price: '',
    numbelLength: '',
    totalPrice: '',
    deposit: '',

    hotelId: '',
    roomId: '',
    continues: 1,
    showDetail: false,
    paymentMethod: 1, //付款方式  1.余额  2.微信
    orderNum: '', //订单号（支付时使用）
    unitPrice: '', //房间单价
  },

  /**
   * 确认续房按钮
   */
  affirm: util.throttle(function (e) {
    let that = this;
    if (that.data.totalPrice == -1) {
      wx.showToast({
        title: '暂无空房',
        duration: 2000,
        icon: "none"
      })
    } else {
      that.setData({
        paying: true
      })
    }
  }, 500),

  //微信续房支付完成后调用该接口进行更新订单数据
  wxUpdateOrderRequest: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGenerateContinueOrderRoom',
      data: {
        orderId: app.globalDataDoorList.orderId,
        endTime: that.data.checkOutDate,
        openid: wx.getStorageSync('openid'),
        methodOfPayment: 1
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        var data = res.data;
        console.log('wxGenerateContinueOrderRoom', res.data)
        if (data.code == 200) {
          wx.hideLoading()
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 3000
          })
          setTimeout(() => {
            //跳转到入住页面
            wx.switchTab({
              url: '/pages/checkIn/checkIn',
            })
          }, 3000);
        } else if (data == -1) {
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '抱歉，该时间段的房间刚刚被订走了~',
          })
          that.setData({
            paying: false,
          })
        }

      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //余额续房支付完成后调用该接口进行更新订单数据
  yueUpdateOrderRequest: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGenerateContinueOrderRoom',
      data: {
        orderId: app.globalDataDoorList.orderId,
        endTime: that.data.checkOutDate,
        openid: wx.getStorageSync('openid'),
        methodOfPayment: 2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        var data = res.data;
        console.log('wxGenerateContinueOrderRoom', res.data)
        if (data.code == 200) {
          wx.showToast({
            title: '支付成功',
            icon: 'success',
            duration: 3000
          })
          setTimeout(() => {
            //跳转到入住页面
            wx.switchTab({
              url: '/pages/checkIn/checkIn',
            })
          }, 3000);
        } else if (data.code == 0) {
          wx.showModal({
            title: '提示',
            content: data.msg,
          })
          that.setData({
            paying: false,
          })
        } else if (data.code == -1) {
          wx.showModal({
            title: '提示',
            content: '抱歉，该时间段的房间刚刚被订走了~',
          })
          that.setData({
            paying: false,
          })
        }

      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //打开明细
  openDetail: function () {
    let that = this
    if (that.data.totalPrice == -1) {
      wx.showToast({
        title: '暂无空房',
        duration: 2000,
        icon: "none"
      })
    } else {
      that.setData({
        showDetail: true
      })
    }
  },
  // 关闭明细
  closeDetail: function () {
    this.setData({
      showDetail: false
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
      url: '/pages/recharge/recharge',
    })
  },

  /**
   * 关闭在线支付弹窗
   */
  closePay: util.throttle(function (e) {
    let that = this;
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    that.setData({
      paying: false
    })
    //删除续房订单
    // wx.request({
    //   url: app.globalData.rootApi + '/zxkj/OrderRoom/wxDeleteContinuousYDOrder',
    //   data: {
    //     orderId: that.data.orderId,
    //   },
    //   method: 'post',
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   success: function (res) {
    //     console.log(res);
    //     wx.hideLoading()
    //     that.setData({
    //       paying: false
    //     })
    //   },
    //   fail: function (error) {
    //     console.log(error);
    //     wx.hideLoading()
    //   }
    // });
  }, 500),

  /**
   * 选择支付方式
   */
  pays: util.throttle(function (e) {
    let that = this;
    that.setData({
      payWay: true,
      paying: false,
    })
  }, 500),

  /**
   * 微信支付按钮
   */
  chooseOk: util.throttle(function (e) {
    let that = this;
    that.setData({
      payWay: false,
      paying: true,
    })
  }, 500),

  /**
   * 微信好友代付
   */
  wxFriend: util.throttle(function (e) {
    let that = this;
    that.setData({
      paying: false,
      payWay: false
    })
  }, 500),

  /**
   * 点击支付
   */
  wxpays: util.throttle(function (e) {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      wx.login({
        success: function (loginRes) {
          if (loginRes) {
            //获取用户信息
            wx.getUserInfo({
              withCredentials: true, //非必填  默认为true
              success: function (infoRes) {
                console.log(infoRes, '>>>');
                //请求服务端的登录接口
                wx.request({
                  url: app.globalData.rootApi + '/zxkj/order/wxDecodeUserInfo',
                  data: {
                    hotelId: app.globalDataDoorList.hotelId,
                    code: loginRes.code, //临时登录凭证
                    encrypteData: infoRes.encryptedData, //用户敏感信息
                    iv: infoRes.iv, //解密算法的向量
                    rawData: infoRes.rawData
                  },
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function (res) {
                    console.log(res);
                    console.log('login success');
                    that.wxpay();
                    // if (res.statusCode == 200) {
                    //   console.log("第一次:", res.data);
                    //   wx.setStorageSync('openid', res.data.openid)
                    //   app.globalData.openid = res.data.openid;
                    //   app.globalData.session_key = res.data.session_key;
                    //   app.globalData1.newPeople = res.data.newPeople;
                    //   app.globalData.userInfo = res.userInfo;
                    //   wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                    //   wx.setStorageSync('session_key', res.data[2]);
                    //   that.wxpay()
                    // } else {
                    //   // that.showInfo('res.errmsg');
                    // }
                  },
                  fail: function (error) {
                    //调用服务端登录接口失败
                    // that.showInfo('调用接口失败');
                    console.log(error);
                  }
                });

              }
            });
          } else {
            //用户点击了拒绝按钮
            wx.showModal({
              title: '警告',
              content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
              showCancel: false,
              confirmText: '返回授权',
              success: function (res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                  console.log('用户点击了“返回授权”');
                  wx.redirectTo({
                    url: '/pages/authorizationPage/authorizationPage',
                  })
                }
              }
            })
          }
        }
      })

    } else {
      that.wxpay()
    }
  }, 2000),

  /**
   * 支付接口
   */
  wxpay: function () {
    let that = this;
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPay',
      data: {
        openid: wx.getStorageSync('openid'),
        orderId: app.globalDataDoorList.orderId,
        totalPrice: that.data.totalPrice,
        whetherToContinueRoom: true
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('支付的res.data', res.data)
        console.log('支付的res.data.timeStamp', res.data.timeStamp);
        if (res.data) {
          console.log(res.data.nonceStr);
          wx.requestPayment({
            timeStamp: res.data.timeStamp,
            nonceStr: res.data.nonceStr,
            package: res.data.package,
            signType: 'MD5',
            paySign: res.data.paySign,
            success(res) {
              console.log("统一下单接口成功");
              app.globalDataDoorList.totalPrice = that.data.totalPrice

              that.wxUpdateOrderRequest()
            },
            fail(res) {
              console.log("统一下单接口失败");
              wx.showToast({
                title: '支付取消',
                icon: 'none',
                duration: 2000
              })
            }
          })
        }
      }
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
          that.yuePayRequest()
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
    that.yueUpdateOrderRequest()
    // wx.request({
    //   url: app.globalData.rootApi + '/zxkj/OrderRoom/wxBalancePay',
    //   data: {
    //     openid: wx.getStorageSync('openid'),
    //     orderId: that.data.orderId,
    //     whetherToContinueRoom: true
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   Type: 'json',
    //   success: function (res) {
    //     console.log('请求查看积分记录信息', res.data)
    //     if (res.data.code == 200) {
    //       that.yueUpdateOrderRequest()
    //     } else {
    //       console.log('支付失败')
    //     }
    //     wx.hideLoading()
    //   },
    //   fail: function (res) {
    //     wx.hideLoading()
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    that.setData({
      checkInDate: options.checkInDate
    })

    //设缓存缓存起来的日期
    wx.setStorage({
      key: 'ROOM_SOURCE_DATE',
      data: {
        checkInDate: Moment(that.data.checkInDate).format('YYYY-MM-DD'),
        checkOutDate: Moment(that.data.checkInDate).add(1, 'day').format('YYYY-MM-DD')
      }
    });

    wx.getStorage({
      key: 'ROOM_SOURCE_DATE',
      success: function (res) {
        that.setData({
          checkInDate: res.data.checkInDate,
          checkOutDate: res.data.checkOutDate,
          endYears: res.data.checkInDate.substr(0, 4),
          endMonths: res.data.checkInDate.substr(5, 2),
          endDays: res.data.checkInDate.substr(8, 11),
        })
      }
    });

    wx.request({
      url: app.globalData.rootApi + '/zxkj/room/wxHotelRuZhuRenByOrderId',
      data: {
        orderId: app.globalDataDoorList.orderId,
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        console.log('我的结果啊 啊', res.data)

        if (res.data.length == 0 || (res.data.indexOf('<html><body>') != -1)) {
          wx.showModal({
            title: '提示',
            content: '服务器错误',
          })
          that.setData({
            orderContinues: false,
          })
        } else {
          app.globalDataDoorList.hotelId = res.data[0].hotelId
          app.globalDataDoorList.roomId = res.data[0].roomId
          app.globalDataDoorList.price = res.data[0].price

          app.globalDataDoorList.numbelLength = res.data.length
          app.globalDataDoorList.deposit = res.data[0].deposit
          console.log('app.globalDataDoorList.numbelLength', app.globalDataDoorList.numbelLength)
          console.log(' app.globalDataDoorList.roomId', app.globalDataDoorList.roomId)

          that.setData({
            roomList: res.data,
          })
        }
      },
      fail: function (res) {

      }
    })
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let that = this

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var dateCount = ''
    var daysss = ''
    let getDate = wx.getStorageSync("ROOM_SOURCE_DATE");
    this.setData({
      checkInDate: getDate.checkInDate,
      checkOutDate: getDate.checkOutDate,
      // dateCount:getDate.dateCount
    })
    var end_date = new Date(this.data.checkOutDate.replace(/-/g, "/"))
    var start_date = new Date(this.data.checkInDate.replace(/-/g, "/"))
    daysss = end_date - start_date;
    dateCount = parseInt((daysss) / (1000 * 60 * 60 * 24));
    let that = this;
    that.setData({
      dateCount: dateCount,
    })

    that.getPriceRequest()
  },

  //判断该时间段能否续房，并返回价格
  getPriceRequest: function () {
    let that = this
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetTimeQuantumPrice',
      data: {
        orderId: app.globalDataDoorList.orderId,
        openid: wx.getStorageSync('openid'),
        endTime: that.data.checkOutDate

      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          let totalPrice = res.data.data.discountPrice
          let orderNum = res.data.data.orderNum
          let price = res.data.data.price
          let balances = res.data.data.balances
          if (balances >= totalPrice) {
            that.setData({
              totalPrice: totalPrice,
              unitPrice: price,
              orderNum: orderNum,
              paymentMethod: 1,
              balances: balances
            })
          } else {
            that.setData({
              totalPrice: totalPrice,
              unitPrice: price,
              orderNum: orderNum,
              paymentMethod: 2,
              balances: balances
            })
          }
          wx.hideLoading()
        } else if (res.data.code == -1) {
          that.setData({
            totalPrice: '-1'
          })
          wx.hideLoading()
          wx.showToast({
            title: '抱歉，该时间段房间被预定',
            icon: 'none',
            duration: 3000
          })
        } else {
          wx.hideLoading()
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {

      }
    })
  },


  /**
   * 点击续房至按钮
   */
  riliTwo: util.throttle(function (e) {
    let that = this;
    wx.navigateTo({
      url: '/pages/riliTwo/riliTwo?checkInDate=' + that.data.checkInDate + '&checkOutDate=' + that.data.checkOutDate + '&endYears=' + that.data.endYears + '&endMonths=' + that.data.endMonths + '&endDays=' + that.data.endDays,
    })
  }, 500),

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // let that = this
    // wx.showLoading({
    //   title: '加载中',
    //   mask: true
    // })
    // //删除续房订单
    // wx.request({
    //   url: app.globalData.rootApi + '/zxkj/OrderRoom/wxDeleteContinuousYDOrder',
    //   data: {
    //     orderId: that.data.orderId,
    //   },
    //   header: {
    //     'content-type': 'application/x-www-form-urlencoded'
    //   },
    //   method: 'POST',
    //   dataType: 'json',
    //   Type: 'json',
    //   success: function (res) {
    //     console.log(res)
    //     if (res.data.code == 200) {
    //       wx.hideLoading()
    //       let dateCount = that.data.dateCount
    //       let roomNum = that.data.roomList.length
    //       let deposit = that.data.roomList[0].deposit
    //       let discountPrice = res.data.data.discountPrice
    //       let totalPrice = dateCount * roomNum * discountPrice + deposit * roomNum
    //       that.setData({
    //         dateCount: dateCount,
    //         roomNum: roomNum,
    //         deposit: deposit,
    //         discountPrice: discountPrice,
    //         totalPrice: totalPrice
    //       })
    //     } else {
    //       wx.showToast({
    //         title: '服务器错误',
    //         icon: 'none',
    //         duration: 2000
    //       })
    //     }
    //   },
    //   fail: function (res) {

    //   }
    // })
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