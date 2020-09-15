// pages/mine/mine.js
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
      title: 'e住行', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    loginData: null,
    signboard: 2,
    userInfo: {
      avatarUrl: '', //头像
      nickName: '', //昵称
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      loginData: true
    })

  },

  /**
   * 我的评论
   */
  lookEvaluation: util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/myEvaluation/myEvaluation',
    })
  }, 3000),

  /**
   * 我的个人信息按钮,点击头像
   */

  myInfo: util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/myInfo/myInfo',
    })
  }, 3000),

  /**
   *查看我的酒店订单 
   */
  lookOrder: util.throttle(function(e) {

    wx.navigateTo({
      url: '/pages/myOrder/myOrder',
    })

  }, 3000),

  /**
   * 帮助页面
   */
  help: util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/help/help',
    })
  }, 3000),


  /**
   * 我的酒店
   */
  myHotel: util.throttle(function(e) {

    wx.navigateTo({
      url: '/pages/myHotel/myHotel',
    })
  }, 3000),

  /**
   * 我的设置
   */
  mySetting: util.throttle(function(e) {

    wx.navigateTo({
      url: '/pages/setting/setting',
    })
  }, 3000),

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
    //判断是否授权并获取头像和昵称
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      if (that.haveUnionId()) {
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
      }
    }
  },

  //针对已注册会员，判断是否保存了UnionID
  haveUnionId: function() {
    let that = this
    let haveNot = true
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/oauth/wxGetUidByOpenid',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        // console.log('res-----')
        // console.log(res.data)
        if(res.data.code == 200){
          haveNot = true
        } else {
          haveNot = false
        }
        wx.hideLoading()

        return haveNot //返回值
      },
      fail: function(res) {
        wx.hideLoading()
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

  },

  /**
   * 跳转至noContent页面
   */
  noContent: util.throttle(function(e) {
    wx.navigateTo({
      url: '/pages/noContent/noContent',
    })
  }, 1000),

  look: util.throttle(function() {

    wx.showModal({
      title: '提示',
      content: '功能暂未开放',
      showCancel: false,
      confirmText: '知道了'
    })
  }, 1000),

  vip: util.throttle(function() {
    wx.navigateTo({
      url: '/pages/vip/vip',
    })
  }, 1000)
})