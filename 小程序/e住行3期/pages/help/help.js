// pages/help/help.js
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
      title: '帮助', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离  
    height: app.globalData.height * 2 + 20,
    flag: true,
    questionList: '',
    questionName: '',
    answer: '',
    yong: false,
    wuyong: false,
    openid: '',
    questionId: '',
  },

  show: function () {
    this.setData({
      flag: false
    })
  },
  // 当遮罩层与conts区域出现时，执行hide,flag变为true，遮罩层与conts区域再次被隐藏
  hide: function () {
    this.setData({
      flag: true
    })
  },
  close: function () {
    this.setData({
      flag: true
    })
  },

  /**
   * 有用图标按钮
   */
  youyong: util.throttle(function (e) {
    console.log('1')
    this.setData({
      yong: true,
      wuyong: false
    })
  }, 500),

  /**
   * 无用图标按钮
   */
  wuyong: util.throttle(function (e) {
    console.log('2')
    this.setData({
      wuyong: true,
      yong: false
    })
  }, 500),


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.request({
      url: app.globalData.rootApi + '/zxkj/question/wxHelp',
      data: {},
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.length == 0) {
          wx.showToast({
            title: '暂无未评价订单',
            icon: 'none',
            duration: 1000
          })
        } else {
          that.setData({
            questionList: res.data,
            question: res.data.question,
            answer: res.data.answer,
            questionId: res.data.id
          })
        }
        console.log('bangzhu', res.data)
      },
      fail: function (res) {

      }
    })

  },

  /**
   * 问题点击
   */
  unmanned: function (e) {
    var that = this;
    var i = e.currentTarget.id;
    console.log('dssssssssssssss', e.currentTarget.id);
    console.log(that.data.questionList[i].question)
    that.setData({
      question: that.data.questionList[i].question,
      answer: that.data.questionList[i].answer
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
    let that = this;
    // wx:wx.request({
    //   url: app.globalData.rootApi + '',
    //   data: {
    //     openid : that.data.openid
    //   },
    //   header: { 'content-type': 'application/x-www-form-urlencoded'},
    //   method: 'POST',
    //   dataType: 'json',
    //   responseType: 'text',
    //   success: function(res) {
    //   that.setData({
    //      question:res.data
    //   })
    //   },
    //   fail: function(res) {

    //   }
    // })

  },

  /**
   * 联系客服
   */
  service: util.throttle(function (e) {
    wx.showModal({
      title: '提示',
      content: '功能暂未开放',
    })
  }, 3000),

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