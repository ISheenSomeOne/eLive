// pages/vip/vip.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '会员中心', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    vipInfo: [],
    nextLevel: 9999,
    allJiFen: 9999
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
  },

  //请求查看会员中心信息
  requestVipCenter: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/consumption/wxGetMembersHomeInfo',
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
        console.log('请求查看会员中心信息', res.data.data)

        if (res.data.code == 200) {
          if (!res.data.data.consumptionList.balance) {
            res.data.data.consumptionList.balance = 0
          }
          if (!res.data.data.consumptionList.jiFen) {
            res.data.data.consumptionList.jiFen = 0
          }
          res.data.data.consumptionList.icon = app.globalData.imgApi + res.data.data.consumptionList.icon
          that.setData({
            vipInfo: res.data.data.consumptionList,
            allJiFen: res.data.data.jiFenHistory,
            nextLevel: res.data.data.floorLevel
          })
          wx.hideLoading()
        } else {
          // that.setData({
          //   totalPrice: res.data.data.totalPrice
          // })
          wx.hideLoading()
        }
      },
      fail: function(res) {
        wx.hideLoading()
      }
    })
  },

  //打开会员特权页面
  vipPrivilege: function() {
    wx.navigateTo({
      url: '/pages/vipInfo/vipInfo',
    })
  },
  //打开积分记录页面
  pointsRecord: function() {
    wx.navigateTo({
      url: '/pages/pointsRecord/pointsRecord',
    })
  },
  //打开积分记录页面
  recharge: function() {
    wx.navigateTo({
      url: '/pages/recharge/recharge',
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
    //判断是否授权
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      wx.getSetting({
        success: function(res) {
          if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
            //获取用户信息
            wx.getUserInfo({
              success: function(res) {
                // console.log(res);
                var avatarUrl = 'userInfo.avatarUrl';
                var nickName = 'userInfo.nickName';
                that.isRealName()
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
      that.requestVipCenter()
    }
  },

  //检测是否实名
  isRealName: function() {
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
        if (res.data.code == 0) {
          //实名了
        } else if (res.data.code == -1) {
          //没有实名
          wx.showModal({
            title: '提示',
            content: '会员需先实名认证',
            confirmText: '好的',
            success(res) {
              if (res.confirm) {
                wx.navigateTo({
                  url: '/pages/verified/verified',
                })
              } else if (res.cancel) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          wx.showModal({
            title: '提示',
            content: '服务器错误',
            showCancel: false,
            confirmText: '知道了',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
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

  }
})