// pages/transferRightsGet/transferRightsGet.js
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
      title: '', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    hotel: '',
    userName: '',
    name: '',
    idCard: '',
    can: false, //可以点击按钮
    inviteOK: false, //填写完成
    invalid: false, //页面失效
    agree: false, //已同意授权
    inputOk: false, //已将实名信息填入
  },

  /* 姓名中间部分隐藏 */
  formatName: function(name) {
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

  /* 身份证部分隐藏 */
  plusXing: function(str) {
    var len = str.length - 5;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, 3) + xing + str.substring(str.length - 2);
  },

  getName: function(e) {
    let that = this
    let name = e.detail.value
    let idCard = that.data.idCard
    let newPhone = that.data.newPhone
    if ((newPhone != '') && (name != '') && (idCard != '')) {
      that.setData({
        name: e.detail.value,
        can: true
      })
    } else {
      that.setData({
        name: e.detail.value,
        can: false
      })
    }
  },
  getPhone: function(e) {
    let that = this
    let newPhone = e.detail.value
    let idCard = that.data.idCard
    let name = that.data.name
    if ((newPhone != '') && (name != '') && (idCard != '')) {
      that.setData({
        newPhone: e.detail.value,
        can: true
      })
    } else {
      that.setData({
        newPhone: e.detail.value,
        can: false
      })
    }
  },
  getId: function(e) {
    let that = this
    let name = that.data.name
    let newPhone = that.data.newPhone
    let idCard = e.detail.value
    if ((newPhone != '') && (name != '') && (idCard != '')) {
      that.setData({
        idCard: e.detail.value,
        can: true
      })
    } else {
      that.setData({
        idCard: e.detail.value,
        can: false
      })
    }
  },
  confirm: util.throttle(function() {
    let that = this
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
                      that.confirmRequst()
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
      that.confirmRequst()
    }

  }, 2000),

  confirmRequst: function() {
    let that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.newPhone.length == 0) {
      wx.showToast({
        title: '手机号码不能为空',
        duration: 2000,
        icon: 'none'
      });
    } else if (!myreg.test(that.data.newPhone)) {
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
    } else {
      // 受邀人填写完成权限转移信息,提交接口
      wx.request({
        url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxGetPermission',
        data: {
          openid: wx.getStorageSync('openid'),
          temporaryOrderRoomId: that.data.temporaryOrderRoomId,
          newOwnerName: that.data.name,
          newOwnerPhone: that.data.newPhone,
          newOwnerIdCard: that.data.idCard,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        Type: 'json',
        success: function(res) {
          if (res.data.code == 0) {
            let showName = that.formatName(that.data.name)
            let showIdCard = that.plusXing(that.data.idCard)
            that.setData({
              showName: showName,
              showNewPhone: that.data.newPhone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3"),
              showIdCard: showIdCard
            })
            wx.showModal({
              title: '提示',
              content: '信息填写完毕，去告知好友吧',
              confirmColor: '#f06c00',
              confirmText: '好的',
              cancelText: '稍后',
              success(res) {
                if (res.confirm) {
                  console.log('好的')
                } else if (res.cancel) {
                  console.log('稍后')
                }
                that.setData({
                  inviteOK: true
                })
              }
            })
            // wx.redirectTo({
            //   url: '/pages/staying/staying?idCard=' + that.data.idCard + '&name=' + that.data.name + '&phone=' + that.data.phone + '&orderId=' + that.data.orderId,
            // })
          } else if (res.data.code == -2) {
            wx.showToast({
              title: '房间权限已经是您的了',
              icon: 'none',
              duration: 2000
            })
          } else {
            wx.showToast({
              title: '房间权限转移失败',
              icon: 'none',
              duration: 2000
            })
          }
        },
        fail: function(res) {
          console.log('房间权限转移失败')
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var avatarUrl = 'userInfo.avatarUrl';
    var nickName = 'userInfo.nickName';
    that.setData({
      orderRoomId: options.orderRoomId,
      temporaryOrderRoomId: options.temporaryOrderRoomId,
      [avatarUrl]: options.avatarUrl,
      [nickName]: options.nickName
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
    let that = this

    if (that.data.orderRoomId == '' || that.data.orderRoomId == null || typeof(that.data.orderRoomId) == 'undefind') {
      wx.showToast({
        title: '基本不会有这种情况啊。。。',
        duration: 2000,
        icon: "none"
      })
    } else if (that.data.temporaryOrderRoomId == '' || that.data.temporaryOrderRoomId == null || typeof(that.data.temporaryOrderRoomId) == 'undefind') {
      wx.showToast({
        title: '基本不会有这种情况啊。。。',
        duration: 2000,
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxSelectShareGetPermission',
        data: {
          orderRoomId: that.data.orderRoomId,
          temporaryOrderRoomId: that.data.temporaryOrderRoomId,
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log('-------------', res.data)
          if (res.data.code == -1) {
            wx.hideLoading()
            wx.showToast({
              title: '服务器错误，建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          } else {
            console.log(res.data)
            let permissionInfo = res.data
            permissionInfo.checkinDate = permissionInfo.checkinDate.substr(5, 5)
            permissionInfo.checkoutDate = permissionInfo.checkoutDate.substr(5, 5)

            let user = that.formatName(permissionInfo.userName);
            let phone = permissionInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");
            // console.log(111111)
            // let formatName = function(name) {
            //   let newStr
            //   if (name.length == 2) {
            //     newStr = name.substr(0, 1) + '*';
            //   } else if (name.length > 2) {
            //     var char = '';
            //     for (let i = 0, len = name.length - 2; i < len; i++) {
            //       char += '*';
            //     }
            //     newStr = name.substr(0, 1) + char + name.substr(-1, 1);
            //   } else {
            //     newStr = name;
            //   }
            //   return newStr;
            // };
            // console.log(2222222)
            // console.log('user' + user)
            // let newUser = formatName(user.trim())

            
            
            that.setData({
              permissionInfo: permissionInfo,
              user: user,
              phone: phone,
              temporaryOrderRoomId: permissionInfo.temporaryOrderRoomId,
              name: permissionInfo.nameOfInvitee,
              newPhone: permissionInfo.mobilePhoneNumberOfTheInvitee,
              idCard: permissionInfo.inviteeIdCard,
            })
            if (permissionInfo.inviteeIdCard != null && typeof (permissionInfo.inviteeIdCard) != 'undefind' && permissionInfo.inviteeIdCard != '') {
              let showName = that.formatName(permissionInfo.nameOfInvitee)
              let showNewPhone = permissionInfo.mobilePhoneNumberOfTheInvitee.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
              let showIdCard = that.plusXing(permissionInfo.inviteeIdCard)
              that.setData({
                showName: showName,
                showNewPhone: showNewPhone,
                showIdCard: showIdCard,
              })
            }
            if (permissionInfo.roomPermissionStatus == '待填写') {
              that.getOpenid()
            }
            wx.hideLoading()
          }
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function(res) {
          wx.hideLoading()
        }
      })
    }
  },
  getOpenid: function () {
    let that = this
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      that.getInit()
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
        let showName = res.data.name
        let showNewPhone = res.data.tel
        let showIdCard = res.data.num
        if (res.data.code == 0) {
          that.setData({
            name: res.data.name,
            newPhone: res.data.tel,
            idCard: res.data.num,
            showName: showName,
            showNewPhone: showNewPhone,
            showIdCard: showIdCard,
            inputOk: true,
            can: true
          })
          console.log('获取实名信息---', that.data.name)
        }
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  //等待好友同意
  waitAgree: function() {
    wx.showModal({
      title: '提示',
      content: '信息填写完毕，去告知好友吧',
      confirmColor: '#f06c00',
      confirmText: '好的',
      cancelText: '稍后',
      success(res) {
        if (res.confirm) {
          console.log('好的')
        } else if (res.cancel) {
          console.log('稍后')
        }
      }
    })
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