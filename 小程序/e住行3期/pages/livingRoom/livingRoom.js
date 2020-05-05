// pages/livingRoom/livingRoom.js
let app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '入住中', //导航栏 中间的标题
      goHome: 1
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    date: '',
    orderList: '',
    hotelName: '',
    roomName: '',
    totalPrice: '', //总价
    showValue: '', //房间数量
    startTime: '',
    endTime: '',
    dateCount: '', //共几晚
    creatTime: '', //下单时间
    outTradeNo: '', //订单号
    contacts: '', //下单人姓名
    tel: '', //下单人联系方式
    info: '', //备注
    address: app.globalData1.address, //酒店地址

    orderRoomId: '', //订单ID
    maxRuZhuRenCount: '', //房间的最大容量
    numPeople: '', //该房间当前入住的人数
  },

  openDetail: function() {
    this.setData({
      showDetail: true
    })
  },
  closeDetail: function() {
    this.setData({
      showDetail: false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let orderRoomId = options.orderRoomId
    if (orderRoomId != '' && orderRoomId != null && typeof(orderRoomId) != 'undefind') {
      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetOrderRoomInfoByOrderRoomId',
        data: {
          orderRoomId: orderRoomId,
          openid: wx.getStorageSync('openid')
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          console.log('livingRoomInfo----', res.data)
          if(res.data.code == 200){
            let roomInfo = res.data.data
            let title = 'nvabarData.title'
            let checkin = new Date(roomInfo.checkinDate)
            let checkinDate = (checkin.getMonth() + 1) + '月' + checkin.getDate() + '日 ' + roomInfo.checkinDate.substring(11, 16)
            let checkout = new Date(roomInfo.checkoutDate)
            let checkoutDate = (checkout.getMonth() + 1) + '月' + checkout.getDate() + '日 ' + roomInfo.checkoutDate.substring(11, 16)

            that.setData({
              orderRoomId: orderRoomId,
              [title]: roomInfo.hotelName,
              roomInfo: roomInfo,
              checkinDate: checkinDate,
              checkoutDate: checkoutDate,
              ruZhuRen: roomInfo.ruZhuRen
            })
          } else {
            wx.showToast({
              title: '请重试',
              duration: 2000,
              icon: "none"
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }

          

        },
        fail: function (res) {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
        }
      })
    }
  },

  //拨打电话
  toContact: util.throttle(function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.roomInfo.tel
    })
  }, 1000),

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