// pages/verified/verified.js
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
      title: '实名认证', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    name: '',
    idCard: '',
    tel: '',
    nameShow: '',
    telShow: '',
    idCardShow: '',
    can: false,
    openid: '',
    signboard: '',
    hotelId: '',
    hasBeenCompleted: false
  },

  /**
   * 获取名字
   */
  getName: function (e) {
    var name = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },

  /**
   *获取身份证 
   */
  getId: function (e) {
    var idCard = e.detail.value
    this.setData({
      idCard: e.detail.value
    })
  },

  /**
   * 获取手机号
   */
  getTel: function (e) {
    var tel = e.detail.value
    this.setData({
      tel: e.detail.value
    })
  },

  /**
   * 提交按钮
   */
  confirm: util.throttle(function () {
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
                      that.verifiedRequest()
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
      that.verifiedRequest()
    }
  }, 3000),
  //实名接口
  verifiedRequest: function () {
    let that = this
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
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
    } else if (that.data.idCard.length == 0) {
      wx.showToast({
        title: '身份证号码不能为空',
        duration: 2000,
        icon: 'none'
      });
    } else if (that.data.idCard.length != 6) {
      wx.showToast({
        title: '请输入身份证号后6位',
        duration: 2000,
        icon: 'none'
      });
    }
    //  else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard))) {
    //   wx.showToast({
    //     title: '身份证号码有误',
    //     duration: 2000,
    //     icon: 'none'
    //   });
    // } 
    else {
      console.log('开始提交')
      //实名认证接口
      wx.request({
        url: app.globalData.rootApi + '/zxkj/member/wxMemberRealNameAuthentication',
        data: {
          openid: wx.getStorageSync('openid'),
          name: that.data.name,
          tel: that.data.tel,
          num: that.data.idCard,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        Type: 'json',
        success: function (res) {
          console.log('实名认证返回值---', res.data)
          if (res.data.code == -3) {
            wx.showToast({
              title: '信息填写不完全',
              duration: 2000,
              icon: "none"
            })
          } else if (res.data.code == -2) {
            wx.setStorageSync('openid', '')
            wx.showToast({
              title: '请再点击一次',
              duration: 2000,
              icon: "none"
            })
          } else if (res.data.code == -1) {
            wx.showToast({
              title: '服务器错误',
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '实名认证成功',
              duration: 1000,
              icon: "success"
            })
            // wx.switchTab({
            //   url: '/pages/mine/mine',
            // })
            wx.navigateBack({
              delta: 1
            })
          }

        },
        fail: function (res) {
          console.log('实名认证失败')
          wx.showToast({
            title: '实名认证失败',
            duration: 1000,
            icon: "none"
          })
          // wx.showModal({
          //   title: '提示',
          //   content: '实名认证失败,请重新认证',
          //   sunccess: function(res) {
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
    let that = this;
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    }
  },

  //请求页面初始化数据
  getInit: function () {
    console.log('------获取实名信息start')
    let that = this
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
          let nameShow = that.formatName(res.data.name)
          let telShow = that.plusXing(res.data.tel,3,4)
          let idCardShow = that.plusXing(res.data.num,3,2)
          that.setData({
            hasBeenCompleted: true,
            nameShow: nameShow,
            telShow: telShow,
            idCardShow: idCardShow,
            name: res.data.name,
            tel: res.data.tel,
            idCard: res.data.num
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //显示输入框
  toInput: function(){
    let that = this
    that.setData({
      hasBeenCompleted: false
    })
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

  //隐藏
  plusXing: function (str, frontLen, endLen) {
    console.log(str)
    console.log(frontLen)
    console.log(endLen)
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
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