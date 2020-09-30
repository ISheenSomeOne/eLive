// pages/orderTwo/orderTwo.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '酒店名称', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    date: '',
    openid: '',
    payWay: false,
    paying: false,
    hotelId: '',
    hotelName: '',
    roomName: '',
    name: '',
    address: '',
    street: '',
    price: '',
    bed: '',
    area: '',
    deposit: '',
    totalPrice: '',
    manPrice: '',
    showValue: '', //房间数量
    contacts: '', //联系人
    tel: '', //手机号
    showTel: '', //显示的手机号
    receipt: '', //发票
    info: '', //备注
    roomTypeId: '',
    startTime: '',
    endTime: '',
    couponId: '',
    memberId: '',
    orderList: '',
    roomId: '',
    door: '',
    building: '',
    floor: '',
    signboard: 4,
    orderId: '',
    see: false,
    paymentMethod: 1, //付款方式  1.余额  2.微信
    balances: '',
    minNegotiatedPrice: '',
    companyId: ''
  },



  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let vm = this;
    // let aa = 'timePrice[' + index + '].other[' + j + '].breakfast'

    // let timePrice = 'timePrice[' + index + '].other[' + j + '].breakfast'
    var DATE = util.formatDate(new Date());
    let title = 'nvabarData.title'
    console.log(options)
    if(options.companyId != '' && options.companyId != null && options.companyId != 'undefined'){
      vm.setData({
        companyId: options.companyId
      })
      console.log('-------'+vm.data.companyId)
    } else {
      vm.setData({
        companyId: ''
      })
    }
    vm.setData({
      date: DATE,
      hotelId: app.globalData1.hotelId,
      address: app.globalData1.address,
      street: app.globalData1.street,
      roomTypeId: app.globalData2.roomTypeId,
      hotelName: app.globalData1.hotelName,
      roomName: app.globalData2.roomName,
      name: app.globalData2.roomName,
      price: app.globalData2.price,
      minNegotiatedPrice: app.globalData2.minNegotiatedPrice,
      deposit: app.globalData2.deposit * app.globalData3.showValue,
      manPrice: app.globalData3.manPrice * app.globalData3.showValue,
      jian: app.globalData3.jian,
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      dateCount: app.globalData1.dateCount,
      couponId: app.globalData3.couponId,
      memberId: wx.getStorageSync('memberid'),
      openid: wx.getStorageSync('openid'),
      showValue: app.globalData3.showValue, //滑块的值
      contacts: app.globalData3.contacts, //联系人
      showContacts: vm.formatName(app.globalData3.contacts),
      tel: app.globalData3.tel, //联系人手机号
      showTel: app.globalData3.tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3"),
      receipt: app.globalData3.receipt, //发票
      info: app.globalData3.info, //备注
      [title]: app.globalData1.hotelName,
    })
    console.log('wode开始时间', app.globalData1.startTime)
    console.log('wode结束时间', app.globalData1.endTime)
    console.log('wode会员ID', wx.getStorageSync('memberid'))
    console.log('我的房间单价', app.globalData2.price)

    var totalPrice = parseFloat(vm.data.totalPrice);
    var manPrice = parseFloat(vm.data.manPrice);
    var deposit = parseInt(vm.data.deposit)
    totalPrice = manPrice + deposit;
    vm.setData({
      totalPrice: totalPrice
    })
    console.log("contacts", options.contacts)
    console.log('hotelId', app.globalData1.hotelId)

  },

  //隐藏姓名
  formatName: function (name) {
    var newStr;
    if (name.length === 2) {
      newStr = name.substr(0, 1) + '*';
    } else if (name.length > 2) {
      var char = '';
      for (let i = 0, len = name.length - 2; i < len; i++) {
        char += '*';
      }
      newStr = name.substr(0, 1) + char + name.substr(-1, 1);
    } else {
      newStr = name;
    }
    return newStr;
  },

  /**
   * 关闭可见
   */
  closeSee: function() {
    let that = this
    that.setData({
      see: false,
      showTel: that.data.tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3"),
      showContacts: that.formatName(that.data.contacts)
    })
  },

  /**
   * 打开可见
   */
  openSee: function() {
    let that = this
    that.setData({
      see: true,
      showTel: that.data.tel,
      showContacts: that.data.contacts
    })
  },

  //打开地图
  goMap: util.throttle(function() {
    let that = this;
    wx.openLocation({
      latitude: app.globalData1.latitude, //纬度
      longitude: app.globalData1.longitude, //经度
      scale: 28,
      name: app.globalData1.hotelName, //描述
      address: app.globalData1.address //地址
    })

  }, 3000),

  /**
   * 订单提交接口
   */
  submits: util.throttle(function() {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      console.log('---没有openid')
      wx.login({
        success: function(loginRes) {
          if (loginRes) {
            //获取用户信息
            wx.getUserInfo({
              withCredentials: true, //非必填  默认为true
              success: function(infoRes) {
                console.log(infoRes, '>>>');
                //请求服务端的登录接口
                wx.request({
                  url: app.globalData.rootApi + '/zxkj/order/wxDecodeUserInfo',
                  data: {
                    hotelId: app.globalData1.hotelId,
                    code: loginRes.code, //临时登录凭证
                    encrypteData: infoRes.encryptedData, //用户敏感信息
                    iv: infoRes.iv, //解密算法的向量
                    rawData: infoRes.rawData
                  },
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function(res) {
                    console.log(res);
                    console.log('login success');
                    if (res.statusCode == 200) {
                      console.log("第一次:", res.data);
                      wx.setStorageSync('openid', res.data.openid)
                      app.globalData.openid = res.data.openid;
                      app.globalData.session_key = res.data.session_key;
                      app.globalData1.newPeople = res.data.newPeople;
                      app.globalData.userInfo = res.userInfo;
                      wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                      wx.setStorageSync('session_key', res.data[2]);
                      that.submitsRequst()
                    } else {
                      // that.showInfo('res.errmsg');
                    }
                  },
                  fail: function(error) {
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
              success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                  console.log('用户点击了“返回授权”');
                  wx.navigateTo({
                    url: '/pages/authorizationPage/authorizationPage',
                  })
                }
              }
            })
          }
        }
      })

    } else {
      that.submitsRequst()
    }


  }, 3000),

  submitsRequst: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGenerateOrderRoom',
      data: {
        hotelId: that.data.hotelId,
        roomTypeId: that.data.roomTypeId,
        hotelName: that.data.hotelName,
        roomName: that.data.roomName,
        showValue: that.data.showValue,
        contacts: that.data.contacts,
        tel: that.data.tel,
        info: that.data.info,
        startTime: that.data.startTime,
        endTime: that.data.endTime,
        couponId: that.data.couponId,
        openid: wx.getStorageSync('openid'),
        companyId: that.data.companyId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        console.log('111111111', res)
        console.log('orderTwo成功的结果', res.data)

        if (res.data.code != 200) {
          console.log(res.data)
          wx.showToast({
            title: '房间状态异常，请尝试重新搜索房间',
            icon: 'none',
            duration: 4000
          })
          that.setData({
            paying: false
          })
        } else {
          // console.log(res.data)
          if (res.data.data.balances > res.data.data.totalPrice) {
            //余额大于需支付的金额
            that.setData({
              paying: true,
              orderId: res.data.data.orderId,
              totalPrice: res.data.data.totalPrice,
              balances: res.data.data.balances,
              paymentMethod: 1
            })
          } else {
            that.setData({
              paying: true,
              orderId: res.data.data.orderId,
              totalPrice: res.data.data.totalPrice,
              balances: res.data.data.balances,
              paymentMethod: 2
            })
          }
        }
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 点击支付
   */
  wxpays: util.throttle(function(e) {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      wx.login({
        success: function(loginRes) {
          if (loginRes) {
            //获取用户信息
            wx.getUserInfo({
              withCredentials: true, //非必填  默认为true
              success: function(infoRes) {
                console.log(infoRes, '>>>');
                //请求服务端的登录接口
                wx.request({
                  url: app.globalData.rootApi + '/zxkj/order/wxDecodeUserInfo',
                  data: {
                    hotelId: app.globalData1.hotelId,
                    code: loginRes.code, //临时登录凭证
                    encrypteData: infoRes.encryptedData, //用户敏感信息
                    iv: infoRes.iv, //解密算法的向量
                    rawData: infoRes.rawData
                  },
                  method: 'post',
                  header: {
                    'content-type': 'application/x-www-form-urlencoded'
                  },
                  success: function(res) {
                    console.log(res);
                    console.log('login success');
                    if (res.statusCode == 200) {
                      console.log("第一次:", res.data);
                      wx.setStorageSync('openid', res.data.openid)
                      app.globalData.openid = res.data.openid;
                      app.globalData.session_key = res.data.session_key;
                      app.globalData1.newPeople = res.data.newPeople;
                      app.globalData.userInfo = res.userInfo;
                      wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                      wx.setStorageSync('session_key', res.data[2]);
                      that.wxpay()
                    } else {
                      // that.showInfo('res.errmsg');
                    }
                  },
                  fail: function(error) {
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
              success: function(res) {
                // 用户没有授权成功，不需要改变 isHide 的值
                if (res.confirm) {
                  console.log('用户点击了“返回授权”');
                  wx.navigateTo({
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
  wxpay: function() {
    let that = this;
    // var outTradeNo = app.globalDataRoom.orderList[0].outTradeNo
    // var createTime = app.globalDataRoom.orderList[0].createTime
    var openid = wx.getStorageSync('openid')

    // var orderId = app.globalDataRoom.orderList[0].code
    // console.log('我的openid', app.globalData.openid)
    // console.log('totalPrice', that.data.totalPrice)
    // console.log('我的OrderId', app.globalDataRoom.orderList[0].code, )

    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPay',
      data: {
        openid: wx.getStorageSync('openid'),
        orderId: that.data.orderId,
        totalPrice: that.data.totalPrice
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        console.log('支付的res.data', res.data)
        console.log('支付的res.data.timeStamp', res.data.timeStamp);
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
              app.globalData3.totalPrice = that.data.totalPrice

              wx.request({
                url: app.globalData.rootApi + '/zxkj/OrderRoom/wxPayOk',
                data: {
                  orderId: that.data.orderId,
                },
                method: 'POST',
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                success: function(res) {
                  if (res.data == true) {
                    wx.redirectTo({
                      url: '/pages/successPay/successPay?orderId=' + that.data.orderId,
                    })
                  } else if (res.data == false) {
                    console.log('失败是不可能的')
                  }
                },
                fail: function(res) {

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
  //余额支付
  yuePay: function() {
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
  yuePayRequest: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxBalancePay',
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
      success: function(res) {
        console.log('请求查看积分记录信息', res.data)
        if (res.data.code == 200) {
          that.wxPayOK()
        } else if(res.data.code == 0 || res.data.code == 1 || res.data.code == -4){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },
  wxPayOK:function(){
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
        if (res.data == true) {
          wx.redirectTo({
            url: '/pages/successPay/successPay?orderId=' + that.data.orderId,
          })
        } else if (res.data == false) {
          console.log('失败是不可能的')
        }
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  closePay: function() {
    let that =this
    wx.showModal({
      title: '订单已创建',
      content: '您可以在‘我的-酒店订单’中查看',
      cancelText: '再想想',
      confirmText: '知道了',
      success(res) {
        if (res.confirm) {
          wx.navigateBack({
            delta: 2
          })
        } else{
          that.yuePay()
        }
      }
    })
  },

  pays: function() {
    this.setData({
      payWay: true,
      paying: false
    })
  },
  // wxpays: function(){

  //选择余额支付
  chooseYue: function() {
    this.setData({
      paymentMethod: 1,
      payWay: false,
      paying: true
    })
  },
  //选择微信支付
  chooseWx: function() {
    this.setData({
      paymentMethod: 2,
      payWay: false,
      paying: true
    })
  },
  toProxyPay: function() {
    let that = this
    wx.navigateTo({
      url: '/pages/proxyPay/proxyPay?orderId=' + that.data.orderId,
    })
  },

  //充值
  recharge: function() {
    wx.navigateTo({
      url: '/pages/recharge/recharge?want=toMyOrder',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})