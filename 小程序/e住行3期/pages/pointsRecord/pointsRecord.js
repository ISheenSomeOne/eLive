// pages/pointsRecord/pointsRecord.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '积分记录', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    pageNumber: 1,
    pointsRecord: {}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this

  },

  //请求查看积分记录信息
  requestPointsRecord: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/consumption/wxGetConsumptionInfo',
      data: {
        openid: wx.getStorageSync('openid'),
        pageNumber: that.data.pageNumber
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        console.log('请求查看积分记录信息', res.data)
        if (res.data.code == 200) {
          if (res.data.data.consumptionList.length > 0) {
            for (let i = 0; i < res.data.data.consumptionList.length; i++) {
              res.data.data.consumptionList[i].createTime = res.data.data.consumptionList[i].createTime.substring(0, 10)
            }
          }
          that.setData({
            pointsRecord: res.data.data
          })
          wx.hideLoading()
        } else if (res.data.code == -1) {
          that.setData({
            pointsRecord: {
              pageNumber: 1,
              consumptionList: [],
              jiFenNow: 0,
              jiFenUseAmount: 0,
              jiFenHistory: 0
            }
          })
          wx.hideLoading()
        } else {
          wx.showToast({
            title: '服务器异常',
            icon: 'none',
            duration: 2000
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 2000);
          wx.hideLoading()
        }
      },
      fail: function(res) {
        wx.hideLoading()
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
    let that = this
    that.requestPointsRecord()
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