// pages/team/edu/signUpQR/signUpQR.js
var util = require('../../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '学生报名二维码', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    qr: '/pages/image/act4.jpg',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.examId){
      this.setData({
        examId: options.examId
      })
    }
    this.init()
  },

  onShow: function (e) {
  },

  // 页面初始化数据
  init: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/exam/getExamLinkGroup',
      data: {
        examId: that.data.examId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        if (res.data.code == 200) {
          let qr = 'https://zxkj.webinn.online/zxkj/' + res.data.data.qr
          that.setData({
            qr: qr
          })
        } else if(res.data.code == -1){
          wx.showToast({
            title: res.data.msg,
            icon: 'none',
            duration: 2000
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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