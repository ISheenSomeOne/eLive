const app = getApp();
var util = require('../../utils/util.js')
Page({
  data: {
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    // canIUse: wx.canIUse('but ton.open-type.getUserInfo'),

    AuthorizedLogin: '授权登录',
    // UserPhone: '手机号授权',
    isHide: true,
    code: '',
    signboard: '',
    encryptedData: '',
    iv: '',
    opneid: '',
    config: {
      tipsshow1: true,
      tipsshow2: false
    },
    navigateBack: false
  },

  /**
   * 生命周期函数
   */
  onLoad: function (options) {
    let that = this;
    if(options.navigateBack){
      that.setData({
        navigateBack: options.navigateBack
      })
    }
    that.setData({
      signboard: options.signboard,
    })
  },

  /**
   * 授权获取用户信息
   */
  bindGetUserInfo: util.throttle(function (e) {
    let that = this;
    wx.login({
      success: function (loginRes) {
        if (loginRes) {
          //获取用户信息
          wx.getUserInfo({
            withCredentials: true, //非必填  默认为true
            success: function (infoRes) {
              console.log(infoRes, '>>>');
              that.setData({
                encryptedData: infoRes.encryptedData,
                iv: infoRes.iv,
              })
              app.globalData.userInfo = infoRes.rawData;
              console.log('userInfo', infoRes.userInfo)
              wx.setStorageSync('userInfo', infoRes.userInfo)
              //请求服务端的登录接口
              wx.request({
                url: app.globalData.rootApi + '/zxkj/order/wxDecodeUserInfo',
                data: {
                  hotelId: app.globalData1.hotelId,
                  code: loginRes.code, //临时登录凭证
                  // encryptedData: infoRes.encryptedData, //用户敏感信息
                  // iv: infoRes.iv, //解密算法的向量
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
                    // app.globalData.openid = res.data.openid;
                    wx.setStorageSync('openid', res.data.openid)
                    // app.globalData1.memberId = res.data.memberid;
                    app.globalData.session_key = res.data.session_key;
                    app.globalData1.newPeople = res.data.newPeople;
                    wx.setStorageSync('memberid', res.data.memberid);
                    wx.setStorageSync('session_key', res.data.session_key);

                    console.log('授权值', res.data)
                    that.setData({
                      openid: res.data.openid,
                      config: {
                        tipsshow1: false,
                        tipsshow2: true
                      }
                    })
                    wx.navigateBack({
                      delta: 1
                    })

                    //实名认证接口
                    // wx.request({
                    //   url: app.globalData.rootApi + '/zxkj/member/wxWhetherTheRealName',
                    //   data: {
                    //     openid: that.data.openid
                    //   },
                    //   method: 'POST',
                    //   header: { 'content-type': 'application/x-www-form-urlencoded' },
                    //   success: function (res) {
                    //     console.log('实名认证', res.data)
                    //     if (res.data == false) {
                    //       wx.navigateTo({
                    //         url: '/pages/verified/verified?signboard=' + that.data.signboard + '&hotelId=' + app.globalData1.hotelId,
                    //       })
                    //     } else {
                    //       wx.navigateBack({
                    //         delta: 1
                    //       })
                    //       // if (that.data.signboard == 1) {
                    //       //   console.log('1')
                    //       //   wx.showToast({
                    //       //     title: '登录中...',
                    //       //     icon: 'loading',
                    //       //     duration: 2000
                    //       //   })
                    //       //   wx.switchTab({
                    //       //     url: '/pages/checkIn/checkIn',
                    //       //   })
                    //       // } else if (that.data.signboard == 2) {
                    //       //   console.log('2')
                    //       //   wx.showToast({
                    //       //     title: '登录中...',
                    //       //     icon: 'loading',
                    //       //     duration: 2000
                    //       //   })
                    //       //   wx.switchTab({
                    //       //     url: '/pages/mine/mine',
                    //       //   })
                    //       // } else {
                    //       //   console.log('0')
                    //       //   wx.showToast({
                    //       //     title: '登录中...',
                    //       //     icon: 'loading',
                    //       //     duration: 2000
                    //       //   })
                    //       //   wx.redirectTo({
                    //       //     url: '/pages/hotelDetail/hotelDetail?hotelId=' + app.globalData1.hotelId,
                    //       //   })
                    //       // }
                    //     }
                    //   },
                    //   fail: function (res) {
                    //   }
                    // })
                  } else {
                    wx.showModal({
                      title: '提示',
                      content: '获取信息失败,请重新登录!',
                    })
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
                that.setData({
                  config: {
                    tipsshow1: true,
                    tipsshow2: false
                  }
                })
              }
            }
          })
        }
      }
    })
  }, 2000),

  back: function () {
    if(this.data.navigateBack){
      wx.navigateBack({
        delta:1
      })
    } else {
      wx.switchTab({
        url: '/pages/start/start',
      })
    }
    
  }

  /**
   * 授权获取用户手机号码
   */
  // getPhoneNumber: util.throttle(function(e){
  //  let that = this ;

  //   var openid = wx.getStorageSync('openid')
  //   var session_key = wx.getStorageSync('session_key')

  //   console.log('sdasffas',e.detail.encryptedData)
  //   console.log('daqweeq', e.detail.iv)
  //   console.log('获取电话号码!')
  //   console.log(wx.getStorageSync('session_key'))
  //   console.log(wx.getStorageSync('openid'))
  //   wx.request({
  //     url: app.globalData.rootApi + '/zxkj/order/wxGetPhoneNumber',
  //     data: {
  //       encryptedData: e.detail.encryptedData,
  //       iv: e.detail.iv,
  //       session_key: session_key,
  //       openid: openid
  //     },
  //     method: 'POST',
  //     header: { 'content-type': 'application/x-www-form-urlencoded'},
  //     success: function(res){
  //       console.log('phone',res.data)
  //       wx.setStorageSync('phone', res.data)
  //       that.setData({
  //         config: {
  //           tipsshow1: false,
  //           tipsshow2: false
  //         }
  //       });

  //       if (res.data == null || res.data == '' ){
  //         wx.showModal({
  //           title: '提示',
  //           content: '授权失败,请重试',
  //         })

  //       }else{

  //         //实名认证接口
  //        wx.request({
  //          url: app.globalData.rootApi + '/zxkj/member/wxWhetherTheRealName',
  //          data:{
  //            openid: openid
  //          },
  //          method:'POST',
  //          header: { 'content-type': 'application/x-www-form-urlencoded'},
  //          success :function(res) {
  //            console.log('实名认证',res.data)
  //            if (res.data == false) {
  //             wx.redirectTo({
  //               url: '/pages/verified/verified?signboard=' + that.data.signboard + '&hotelId=' + app.globalData1.hotelId ,
  //             })
  //            }else{

  //              if (that.data.signboard == 1) {
  //                console.log('1')
  //                wx.showToast({
  //                  title: '登录中...',
  //                  icon: 'loading',
  //                  duration: 2000
  //                })
  //                wx.switchTab({
  //                  url: '/pages/checkIn/checkIn',
  //                })
  //              } else if (that.data.signboard == 2) {
  //                console.log('2')
  //                wx.showToast({
  //                  title: '登录中...',
  //                  icon: 'loading',
  //                  duration: 2000
  //                })
  //                wx.switchTab({
  //                  url: '/pages/mine/mine',
  //                })
  //              } else {
  //                console.log('0')
  //                wx.showToast({
  //                  title: '登录中...',
  //                  icon: 'loading',
  //                  duration: 2000
  //                })
  //                wx.redirectTo({
  //                  url: '/pages/hotelDetail/hotelDetail?hotelId=' + app.globalData1.hotelId,
  //                })
  //              }
  //            }


  //          },
  //          fail: function(res){

  //          }
  //        })

  //       }
  //     },
  //     fail:function(res){

  //     }
  //   })
  // },2000)

})