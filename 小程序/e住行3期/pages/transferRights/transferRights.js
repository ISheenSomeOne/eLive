// pages/transferRights/transferRights.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    hotel: '',
    userName: '',
    name: '',
    idCard: '',
    inviteOK: false, //授权人提交信息
    temporaryOrderRoomId: ''
  },
  //点击同意授权
  agree: function() {
    let that = this
    if (that.data.temporaryOrderRoomId != null && that.data.temporaryOrderRoomId != '' && typeof (that.data.temporaryOrderRoomId) != 'undefind') {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxOrderRoomPermissionsTransferred',
        data: {
          temporaryOrderRoomId: that.data.temporaryOrderRoomId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('-------------', res.data)
          if (res.data.code == 0) {
            wx.hideLoading()
            wx.showToast({
              title: '成功，即将跳转',
              duration: 2000,
              icon: "success"
            })
            setTimeout(function () {
              wx.navigateTo({ //跳转到我的订单
                url: '/pages/myOrder/myOrder', //我的订单
              })
            }, 4000)
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '权限转移失败，建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          }
        },
        fail: function (res) {
          wx.hideLoading()
        }
      })
    }else {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    }
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  upLoad: function() {
    this.onShow();
  },
  onLoad: function(options) {
    let that = this;
    wx.hideShareMenu()
    that.setData({
      orderRoomId: options.orderRoomId
    })

    // let user = '李三岁';
    // let phone = '15087011111'.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

    // let formatName = function (name) {
    //   let newStr;
    //   if (name.length === 2) {
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

    // let newUser = formatName(user.trim())

    // that.setData({
    //   user: newUser,
    //   phone: phone
    // })

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
    wx.getSetting({
      success: function(res) {
        if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
          //获取用户信息
          wx.getUserInfo({
            success: function(res) {
              console.log(res);
              var avatarUrl = 'userInfo.avatarUrl';
              var nickName = 'userInfo.nickName';
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl,
                [nickName]: res.userInfo.nickName,
              })
            }
          })
        } else {
          wx.navigateTo({ //跳转到授权页面
            url: '/pages/authorizationPage/authorizationPage', //授权页面
          })
        }
      }
    })

    if (that.data.orderRoomId == '' && that.data.orderRoomId == null && typeof(that.data.orderRoomId) == 'undefind') {
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
        url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxSelectGetPermission',
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
              title: '服务器错误，建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          } else {
            console.log(res.data)
            let permissionInfo = res.data
            permissionInfo.checkinDate = permissionInfo.checkinDate.substr(5, 5)
            permissionInfo.checkoutDate = permissionInfo.checkoutDate.substr(5, 5)

            let user = permissionInfo.userName;
            let phone = permissionInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

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
              permissionInfo: permissionInfo,
              user: newUser,
              phone: phone,
              temporaryOrderRoomId: permissionInfo.temporaryOrderRoomId
            })
            // 调用share方法判断是否有临时id，没有的话生成，有的话跳过

            console.log(that.data.temporaryOrderRoomId)
            console.log(typeof (that.data.temporaryOrderRoomId))
            if (that.data.temporaryOrderRoomId == '' || that.data.temporaryOrderRoomId == 'null' || typeof (that.data.temporaryOrderRoomId) == 'undefined') {
              that.share()
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
  //取消
  cancel: function() {
    let that = this
    wx.showModal({
      title: '警告',
      content: '您点击了取消授权，是否确认取消',
      success(res) {
        if (res.confirm) {
          if (that.data.temporaryOrderRoomId != null && that.data.temporaryOrderRoomId != '' && typeof (that.data.temporaryOrderRoomId) != 'undefind') {
            wx.request({
              url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxCancelTransferAuthority',
              data: {
                temporaryOrderRoomId: that.data.temporaryOrderRoomId
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function (res) {
                console.log('-------------', res.data)
                if (res.data.code == -1) {
                  wx.hideLoading()
                  wx.showToast({
                    title: '操作失败，建议重新进入或关闭小程序重启',
                    duration: 2000,
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '成功，即将返回',
                    duration: 2000,
                    icon: "success"
                  })
                  setTimeout(function () {
                    wx.navigateBack({
                      delta: 1
                    })
                  }, 4000)
                }
                // this.setData({
                //   newPeople: false
                // })
              },
              fail: function (res) {
                wx.hideLoading()
              }
            })
          } else {
            wx.showToast({
              title: '建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
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
    this.onShow()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },
  share:function(){
    let that = this
    wx.request({
      url: app.globalData.rootApi + '/zxkj/temporaryOrderRoom/wxGenerateNewOrderRoom',
      data: {
        orderRoomId: that.data.orderRoomId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function (res) {
        console.log('-------------', res.data)
        if (res.data.code == -1) {
          jewew12333333
          wx.hideLoading()
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
        } else {
          console.log('a new orderRoomId---' + res.data.temporaryOrderRoomId)
          that.setData({
            temporaryOrderRoomId: res.data.temporaryOrderRoomId
          })
        }
        // this.setData({
        //   newPeople: false
        // })
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {
    let that = this
    return {
      title: '房间权限转移',
      path: '/pages/transferRightsGet/transferRightsGet?temporaryOrderRoomId=' + that.data.temporaryOrderRoomId + '&avatarUrl=' + that.data.userInfo.avatarUrl + '&orderRoomId=' + that.data.orderRoomId + '&nickName=' + that.data.userInfo.nickName
    }

  }
})