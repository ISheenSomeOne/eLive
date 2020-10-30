// pages/team/orderList/orderList.js
let app = getApp()
var util = require('../../../../utils/util.js')
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
    listInfo: '',//数据
  },
  
  //查看订单详情
  lookOrder:function(e){
    wx.navigateTo({
      url: '/pages/team/edu/orderInfo/orderInfo?examId=' + e.currentTarget.dataset.id
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.init()
  },

  //初始化教育列表界面
  init: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/examOrder/getExamOrderList',
      data: {
        openId: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        console.log('---', res.data)
        if (res.data.code == 200) {
          let listInfo = res.data.data

          listInfo.examStartDate = util.formatDate(new Date(listInfo.examStartDate))
          listInfo.examEndDate = util.formatDate(new Date(listInfo.examEndDate))

          that.setData({
            listInfo: listInfo
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            duration: 2000,
            icon: "none"
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

  }
})