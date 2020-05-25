// pages/myInfo/myInfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '我的信息', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,

    userInfo: {
      avatarUrl: '', //头像
      nickName: '', //昵称
    },
    phone: ''
  },

  /**
   * 实名认证按钮
   */
  verified: function(e) {
    wx.navigateTo({
      url: '/pages/verified/verified',
    })
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({//跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage',//授权页面
      })
    } else {
      that.getInit()
    }
    wx.getStorage({
      key: 'userInfo',
      success: function(res) {
        that.setData({
          userInfo: {
            avatarUrl: res.data.avatarUrl,
            nickName: res.data.nickName,
          }
        })
      },
    })
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
          that.setData({
            phone: that.plusXing(res.data.tel,3,4)
          })
        }
      },
      fail: function (res) {
        console.log(res)
      }
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