// pages/staying/staying.js
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
      title: '酒店名称', //导航栏 中间的标题
      goHome: 1
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    dateTime: '',
    orderList: '',
    hotelName: '',
    roomName: '',
    totalPrice: '', //总价
    showValue: '', //房间数量
    cancelTime: '',
    endTime: '',
    dateCount: '', //共几晚
    creatTime: '', //下单时间
    outTradeNo: '', //订单号
    name: '', //下单人姓名
    tel: '', //下单人联系方式
    info: '', //备注
    address: app.globalData1.address, //酒店地址
    orderRoomId: '', //订单里的房间ID
    maxRuZhuRenCount: '', //房间的最大容量
    nowRuZhuRenCount: '', //该房间当前入住的人数
    orderId: '', //订单ID
    orderRoomOutTime: '',
    orderRoomInTime: '',
    roomList: '',
    showDetail: false,
    orderInfo: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let title = 'nvabarData.title'
    let oneself = true
    if (options.oneself == '' || options.oneself == null || typeof(options.oneself) == 'undefind') {
      oneself = true
    } else {
      oneself = options.oneself
    }
    that.setData({
      // createTime: app.globalDataRoom.orderList[0].createTime, // 下单时间
      // outTradeNo: app.globalDataRoom.orderList[0].outTradeNo, //订单号
      // maxRuZhuRenCount: app.globalDataRoom.maxRuZhuRenCount,
      // orderRoomId: app.globalDataRoom.orderRoomId,
      // hotelName: app.globalData1.hotelName,
      // roomName: app.globalData2.roomName,
      // totalPrice: app.globalData3.totalPrice,
      // showValue: app.globalData3.showValue,
      // cancelTime: app.globalData1.cancelTime,
      // endTime: app.globalData1.endTime,
      // dateCount: app.globalData1.dateCount,
      // contacts: app.globalData3.contacts,
      // tel: app.globalData3.tel,
      // info: app.globalData3.info,
      // orderList: app.globalDataRoom.orderList,
      // orderId: app.globalDataRoom.orderId,
      [title]: app.globalData1.hotelName,
      orderId: options.orderId,
      oneself: oneself
    })
    // console.log('orderid',app.globalDataRoom.orderId)
    // let tel = that.data.tel
    // that.setData({
    //   tel: tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3")
    // })
  },
  showDetail: function() {
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
   * 再次预订按钮,跳转至酒店列表页面
   */
  hotelDetails: util.throttle(function(e) {
    let that = this;
    wx.switchTab({
      url: '/pages/start/start',
    })
  }, 3000),

  

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

  //拨打电话
  toContact: util.throttle(function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.orderInfo.hotelTel
    })
  }, 1000),

  /**
   * 取消预订按钮,需要退款
   */
  cancels: util.throttle(function() {
    let that = this;
    wx.showModal({
      title: '是否确定取消',
      content: '取消后不可撤回',
      success(res) {
        if (res.confirm) {
          var dateTime = new Date();
          var cancelTime = new Date(that.data.orderInfo.hotelCancelTime);
          console.log('dateTime---', dateTime);
          console.log('cancelTime---', cancelTime)
          console.log('dateTime.getTime()---', dateTime.getTime())

          if (dateTime.getTime() > cancelTime.getTime()) {
            wx.showModal({
              title: '提示',
              content: '已超过退订时间',
            })
          } else {
            wx.request({
              url: app.globalData.rootApi + '/zxkj/order/wxOrderCancel',
              data: {
                orderId: that.data.orderId
              },
              method: 'GET',
              header: {
                'content-type': 'application/json'
              },
              success: function(res) {
                if (res.data == true) {
                  wx.showModal({
                    title: '提示',
                    content: '取消成功',
                    success: function(res) {
                      if (res.confirm) {
                        wx.switchTab({
                          url: '/pages/start/start',
                        })
                      } else if (res.cancel) {
                        wx.switchTab({
                          url: '/pages/start/start',
                        })
                      }
                    }
                  })

                } else {
                  wx.showModal({
                    title: '提示',
                    content: '退房失败,请联系客服',
                    success: function(res) {
                      if (res.confirm) {
                        // wx.switchTab({
                        //   url: '/pages/start/start',
                        // })
                      } else if (res.cancel) {
                        // wx.switchTab({
                        //   url: '/pages/start/start',
                        // })
                      }
                    }
                  })
                }

              },
              fail: function(res) {
                wx.showModal({
                  title: '提示',
                  content: '退房失败,请联系客服',
                  success: function(res) {
                    if (res.confirm) {
                      wx.redirectTo({
                        url: '/pages/start/start',
                      })
                    } else if (res.cancel) {
                      wx.redirectTo({
                        url: '/pages/start/start',
                      })
                    }
                  }
                })
              }
            })
          }
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })

  }, 3000),
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function(e) {
    let that = this;

    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetOrderRoomInfoByOrderId',
      data: {
        orderId: that.data.orderId,
        openid: wx.getStorageSync('openid')
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        let orderInfo = res.data
        console.log('orderInfo---', orderInfo)

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
          liveTime: liveTime,
          orderInfo: orderInfo,
          orderRoomInTime: orderInfo.orderRoomInTime.substring(5, 10),
          orderRoomOutTime: orderInfo.orderRoomOutTime.substring(5, 10),
          roomList: orderInfo.roomList
          // roomList: 4
        })

      },
      fail: function(res) {

      }
    })

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