// pages/proxyPayTwo/proxyPayTwo.js
let app = getApp()
var util = require('../../utils/util.js')
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
    remainingTimeMinu: '05',
    remainingTimeSec: '00',
    isTimeOut: false,
    setInter: '',
    timeOut: '',
    orderId: '',
    date: '',
    createTime: '',
    orderInfo: '',
    paying: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.orderId != '' && options.orderId != null && typeof (options.orderId) != 'undefind') {
      that.setData({
        orderId: options.orderId,
        avatarUrl: options.avatarUrl,
        nickName: options.nickName,
      })

    } else {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    }

  },
  //开始支付
  startPay: function () {
    this.setData({
      paying: true
    })
  },

  //关闭支付
  closePay: function () {
    this.setData({
      paying: false,

    })
  },

  //跳转首页
  toHome: function () {
    wx.switchTab({
      url: '/pages/start/start',
    })
  },
  //点击支付
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
                  success: function (res) {
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
        orderId: that.data.orderId,
        totalPrice: that.data.orderInfo.totalPrice
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('支付的res.data', res.data)
        console.log('支付的res.data.timeStamp', res.data.timeStamp);
        if (res.data) {
          console.log(res.data);
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
                    wx.redirectTo({
                      url: '/pages/successPay/successPay',
                    })
                  } else if (res.data == false) {
                    console.log('失败是不可能的')
                  }
                },
                fail: function (res) {
                  console.log('付款之后失败？？？？')
                }
              })
            },
            fail(res) {
              console.log("统一下单接口失败---" + res);
            }
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
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })
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
          let orderInfo = res.data
          var DATE = util.formatDate(new Date());
          let title = 'nvabarData.title'

          let createTime = new Date(orderInfo.orderCreateTime) //获取订单创建时间
          console.log('createTime---' + createTime)
          createTime.setMinutes(createTime.getMinutes() + 5) //时间加05分钟
          console.log('createTime---' + createTime)
          var year = createTime.getFullYear(); //得到年份
          var month = createTime.getMonth() + 1; //得到月份
          var date = createTime.getDate(); //得到日期
          var hour = createTime.getHours(); //得到小时
          var minu = createTime.getMinutes(); //得到分钟
          let timeOut = year + '年' + month + '月' + date + '日' + hour + ':' + minu

          let user = orderInfo.name;
          let phone = orderInfo.tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

          let formatName = function (name) {
            let newStr;
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
          };

          let newUser = formatName(user.trim())

          that.setData({
            user: newUser,
            phone: phone,
            timeOut: timeOut,
            date: DATE,
            createTime: createTime,
            orderInfo: orderInfo,
            orderRoomInTime: orderInfo.orderRoomInTime.substring(5, 10),
            orderRoomOutTime: orderInfo.orderRoomOutTime.substring(5, 10),
            roomList: orderInfo.roomList
          })
          wx.hideLoading()

        },
        fail: function (res) {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
          wx.hideLoading()
        }
      })
    }
    setTimeout(() => {
      //将计时器赋值给setInter
      that.data.setInter = setInterval(function () {
        let now = new Date()
        let remainingTime = that.data.createTime - now
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