// pages/invitee/invitee.js
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
    newPhone: '',
    idCard: '',
    can: false, //可以点击按钮
    inputOk: false, //已经实名认证过
    inviteOK: false, //填写完成
    invalid: false, //页面失效
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
      wx.request({
        url: app.globalData.rootApi + '/zxkj/member/wxMemberRealNameAuthentication',
        data: {
          openid: wx.getStorageSync('openid'),
          name: that.data.name,
          tel: that.data.newPhone,
          num: that.data.idCard,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        Type: 'json',
        success: function(res) {
          console.log('实名认证成功返回---')
          console.log(res.data)

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
            // 添加入住人接口
            wx.request({
              url: app.globalData.rootApi + '/zxkj/OrderRoom/wxAddTenant',
              data: {
                orderRoomId: that.data.orderRoomId,
                name: that.data.name,
                newPhone: that.data.newPhone,
                idCardNum: that.data.idCard,
              },
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              method: 'POST',
              dataType: 'json',
              Type: 'json',
              success: function(res) {
                console.log('添加入住人成功返回值', res.data)
                if (res.data >= 0) {
                  wx.showModal({
                    title: '提示',
                    content: '信息填写完毕，去告知好友吧',
                    confirmColor: '#f06c00',
                    confirmText: '告知好友',
                    cancelText: '稍后',
                    success(res) {
                      if (res.confirm) {
                        console.log('告知好友')
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
                } else if (res.data == -2) {
                  wx.showToast({
                    title: '本酒店已添加过该入住人,不允许重复添加',
                    icon: 'none',
                    duration: 2000
                  })
                } else {
                  wx.showToast({
                    title: '添加入住人失败',
                    icon: 'none',
                    duration: 2000
                  })
                }
              },
              fail: function(res) {
                console.log('添加入住人失败')
              }
            })
          }
        },
        fail: function(res) {
          console.log('失败---' + res)
        }
      })

    }
  }, 2000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    var avatarUrl = 'userInfo.avatarUrl';
    var nickName = 'userInfo.nickName';
    that.setData({
      orderRoomId: options.orderRoomId,
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
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetInviteInfo',
        data: {
          orderRoomId: that.data.orderRoomId
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
              title: '建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          } else {
            console.log(res.data)
            let inviteInfo = res.data
            inviteInfo.checkinDate = inviteInfo.checkinDate.substr(5, 5)
            inviteInfo.checkoutDate = inviteInfo.checkoutDate.substr(5, 5)

            let user = inviteInfo.userName;
            let phone = inviteInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

            let formatName = function(name) {
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
              inviteInfo: inviteInfo,
              user: newUser,
              phone: phone
            })
            wx.hideLoading()
            that.getOpenid()
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
  getOpenid: function() {
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
  getInit: function() {
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
      success: function(res) {
        console.log('获取实名信息---', res.data)
        if (res.data.code == 0) {
          that.setData({
            name: res.data.name,
            newPhone: res.data.tel,
            idCard: res.data.num,
            can: true,
            inputOk: true
          })
          console.log('获取实名信息---', that.data.name)
        } 
      },
      fail: function(res) {
        console.log(res)
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
    let that = this
    if (that.data.orderRoomId == '' || that.data.orderRoomId == null || typeof(that.data.orderRoomId) == 'undefind') {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    } else {
      return {
        title: '我已填写完毕',
        path: '/pages/successInvite/successInvite'
      }
    }
  }
})