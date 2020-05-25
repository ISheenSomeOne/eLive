// pages/myHotel/myHotel.js
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
      title: '我的酒店', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,

    switch: true,
    nowIndex: '',
    topNav: [{
      name: '曾住酒店',
      active: true
    }, {
      name: '我的收藏',
      active: false
    }, {
      name: '浏览历史',
      active: false
    }],


    userHotel: [{
      name: 'haha酒店',
      rate: '5',
      star: '3',
      hotelDistance: '650',
      hotelMinPrice: '198',
      pitch: true
    },
    {
      name: '中林酒店',
      rate: '5',
      star: '3',
      hotelDistance: '650',
      hotelMinPrice: '198',
      pitch: true
    }],
    lastTime: 0,
    compile: true,
    // pitch: true,//选中未选中的图标

    bottoms: false,//底部删除取消按钮的显示开关  
  },

  change: util.throttle(function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    that.setData({
      compile: true,
      bottoms: false,
    })
    that.setData({
      nowIndex: index
    })

    wx.request({
      url: app.globalData.rootApi + '',
      data: {
        openid: that.data.openid,
        index: index
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        let userHotel = res.data;
        if (userHotel == null || userHotel == '') {
          that.setData({
            userHotel: []
          })
          wx.showToast({
            title: '暂无订单',
            duration: 1500,
            icon: "none"
          })
        } else {
          that.setData({
            userHotel: res.data,
            pitch: true
          })
        }

      },
      fail: function (res) {

      }

    })


  }, 500),

  /**
   * 酒店列表点击事件
   */
  hotelDetail: function (e) {
    console.log('hotelDetail')
    let that = this;
    const index = e.currentTarget.dataset.index; // 获取data- 传进来的index
    console.log('dianji', e.currentTarget.dataset.index)
    // 获取这次点击时间
    var thisTime = e.timeStamp;
    // 获取上次点击时间 默认为0
    var lastTime = this.data.lastTime;
    // 打印这次点击时间
    console.log("这次时间：" + thisTime)
    if (lastTime != 0) {
      if (thisTime - this.data.lastTime < 500) {
        that.setData({
          compile: false,
          bottoms: true,
          pitch: true,
        })
        console.log("双击事件")

      }

    }
    console.log('sdasd', e.currentTarget.id)
    // 赋值
    that.setData({
      lastTime: thisTime
    })
  },

  /**
   * 编辑状态下的点击事件
   */
  hotelDetail_else: function (e) {
    let that = this;
    const index = e.currentTarget.id
  },

  /**
   * 选中图标点击事件
   */
  pitchs: function (e) {
    let that = this;
    let userHotel = that.data.userHotel
    const index = e.currentTarget.id; // 获取data- 传进来的index
    console.log('xsdaa', e.currentTarget.id)
    const pitch = userHotel[index].pitch //获取当前状态
    userHotel[index].pitch = !pitch//改变当前状态
    console.log("sdddddssssssssssss", userHotel[index].pitch)
    that.setData({
      userHotel: userHotel
    })
  },


  /**
   * 取消按钮
   */
  cancel: function (e) {
    let that = this;
    that.setData({
      compile: true,
      bottoms: false
    })
  },

  /**
   * 删除按钮
   */
  deletes: util.throttle(function (e) {

  }, 3000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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