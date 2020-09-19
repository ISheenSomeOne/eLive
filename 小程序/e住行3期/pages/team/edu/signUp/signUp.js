// pages/team/edu/signUp/signUp.js
let app = getApp()
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
    needCar: true, //是否需要车辆
    examSiteList: ['点击选择考点','考点1','考点2'], //选择考点的list
    examSiteIndex: 0, //选择的考点的下标
    startingList: ['点击选择出发点','出发点1','出发点2'], //出发点列表
    startingIndex: 0, //选择的出发点下标配
    liveWay: 0, //入住方式下标
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //需要接送
  needCarChange:function(){
    let that = this
    that.setData({
      needCar: !that.data.needCar
    })
  },
  //考点选择
  examSiteChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      examSiteIndex: e.detail.value
    })
  },
  //出发点选择
  startingChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startingIndex: e.detail.value
    })
  },
  //入住方式改变
  liveWayChange: function(e) {
    this.setData({
      liveWay: e.detail.value
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