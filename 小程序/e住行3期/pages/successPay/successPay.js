// pages/successPay/successPay.js
let app = getApp();
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
    orderList: '',
    outTradeNo: '',
    createTime: '',
    orderId: '',
    isSelf: false,
    continue :false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    if (options.orderId && options.continue) {
      that.setData({
        orderId: options.orderId,
        continue: options.continue,
        isSelf: true
      })
    } else if (options.orderId) {
      that.setData({
        orderId: options.orderId,
        isSelf: true
      })
    } else {
      that.setData({
        isSelf: false
      })
    }

  },
  //跳转查看待入住订单
  toMyOrder: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/staying/staying?orderId=' + that.data.orderId,
    })
  },
  //跳转首页
  toHome: function () {
    wx.switchTab({
      url: '/pages/start/start',
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

  },

})