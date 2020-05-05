// pages/living/living.js
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
    totalPrice: '',//总价
    showValue: '',//房间数量
    startTime: '',
    endTime: '',
    dateCount: '',//共几晚
    creatTime: '',//下单时间
    outTradeNo: '',//订单号
    contacts: '',//下单人姓名
    tel: '',//下单人联系方式
    info: '',//备注
    address: app.globalData1.address,//酒店地址

    orderRoomId: '',//订单ID
    maxRuZhuRenCount: '',//房间的最大容量
    numPeople: '',//该房间当前入住的人数
  },

  openDetail: function () {
    this.setData({
      showDetail: true
    })
  },
  closeDetail: function () {
    this.setData({
      showDetail: false
    })
  },

  /**
   * 添加入住人按钮,首先需要获取当前房间的入住人数量
   */
  addOwner: util.throttle(function (e) {
    let that = this;
    let index = e.currentTarget.dataset['index']
    console.log('------第' + index + 1 + '间房')
    let maxRuZhuRenCount = that.data.roomList[index].maxRuZhuRenCount
    let orderRoomId = that.data.roomList[index].orderRoomId

    wx.navigateTo({
      url: '/pages/lookPermission/lookPermission?orderRoomId=' + orderRoomId + '&maxRuZhuRenCount=' + maxRuZhuRenCount+'&readOnly=canWrite'
    })
  }, 1000),

  /**
   * 查看入住人按钮,首先需要获取当前房间的入住人数量
   */
  checkOwner: util.throttle(function (e) {
    let that = this;
    let index = e.currentTarget.dataset['index']
    console.log('------第' + index + 1 + '间房')
    let maxRuZhuRenCount = that.data.roomList[index].maxRuZhuRenCount
    let orderRoomId = that.data.roomList[index].orderRoomId

    wx.navigateTo({
      url: '/pages/lookPermission/lookPermission?orderRoomId=' + orderRoomId + '&maxRuZhuRenCount=' + maxRuZhuRenCount +'&readOnly=readOnly'
    })
  }, 1000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let oneself = true
    if (options.oneself == '' || options.oneself == null || typeof (options.oneself) == 'undefind') {
      oneself = true
    } else {
      oneself = options.oneself
    }
    if (options.orderId != '' && options.orderId != null && typeof (options.orderId) != 'undefind') {
      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetOrderRoomInfoByOrderId',
        data: {
          orderId: options.orderId,
          openid: wx.getStorageSync('openid')
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function (res) {
          let orderInfo = res.data
          console.log('livingInfo----', orderInfo)
          let title = 'nvabarData.title'

          let checkinTime = new Date(orderInfo.orderRoomInTime)
          let liveTime = []

          for (let i = 0; i < orderInfo.roomDay; i++) {
            console.log('checkinTime---' + checkinTime)
            let year = checkinTime.getFullYear()
            let month = checkinTime.getMonth() + 1
            let day = checkinTime.getDate() + i
            let sj = year + '-' + month + '-' + day
            liveTime.push(sj)
          }

          that.setData({
            oneself: oneself,
            liveTime: liveTime,
            orderId: options.orderId,
            [title]: orderInfo.hotelName,
            orderInfo: orderInfo,
            orderRoomInTime: orderInfo.orderRoomInTime.substring(5, 10),
            orderRoomOutTime: orderInfo.orderRoomOutTime.substring(5, 10),
            roomList: orderInfo.roomList
          })

        },
        fail: function (res) {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 2000,
            icon: "none"
          })
        }
      })
    } else {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    }
    var DATE = util.formatDate(new Date());
    let title = 'nvabarData.title'
    that.setData({
      oneself: oneself,
      date: DATE,
      createTime: options.createTime,// 下单时间
      outTradeNo: options.outTradeNo,//订单号
      maxRuZhuRenCount: app.globalDataRoom.maxRuZhuRenCount,
      orderRoomId: app.globalDataRoom.orderRoomId,
      hotelName: app.globalData1.hotelName,
      roomName: app.globalData2.roomName,
      totalPrice: app.globalData3.totalPrice,
      showValue: app.globalData3.showValue,
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      dateCount: app.globalData1.dateCount,
      contacts: app.globalData3.contacts,
      tel: app.globalData3.tel,
      info: app.globalData3.info,
      [title]: app.globalData1.hotelName,
      orderList: app.globalDataRoom.orderList
    })

    // let tel = that.data.tel
    // that.setData({
    //   tel: tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
    // })
  },

  //拨打电话
  toContact: util.throttle(function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.orderInfo.hotelTel
    })
  }, 1000),

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