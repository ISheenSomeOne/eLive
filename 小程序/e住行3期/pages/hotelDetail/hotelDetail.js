// pages/hotelDetail/hotelDetail.js
var app = getApp();
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '酒店详情', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    man: '',
    jian: '',
    couponName: '',
    newPeople: '', //是否显示弹窗
    seeStatus: false,
    hotelImgList: [
      '../image/hotelImg/hotel1.jpg',
      '../image/hotelImg/hotel2.jpg',
      '../image/hotelImg/hotel3.jpg',
      '../image/hotelImg/hotel4.jpg',
      '../image/hotelImg/hotel5.jpg'
    ],
    hotelMessage: [],
    roomList: [],
    name: '',
    star: '',
    renovationTime: '',
    rate: '',
    street: '',
    hotelDistance: '',
    hotelId: '',
    startTime: '',
    endTime: '',
    dateCount: '',
    latitude: '',
    longitude: '',
    address: '',
    pageNumber: 1, //页数
    haveMore: true, //可以加载更多
    loadLunbo: true, //是否加载轮播
    totalCommentCount: '',//评论的总数量
    commentCount: '', //酒店的消费人数
    wxHotelDetails:'',
    divide:'',//好评率
    tel: '',
    companyId: '',
  },
  //房型列表请求
  requestRoomList: function() {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxLookReserve',
      data: {
        openid: wx.getStorageSync('openid'),
        hotelId: app.globalData1.hotelId,
        startTime: app.globalData1.startTime,
        endTime: app.globalData1.endTime,
        pageNumber: that.data.pageNumber
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',

      success: function(res) {
        console.log("roomList的结果---", res.data)

        if (res.data.code == 200) { //返回正常
          let roomList = res.data.data.roomList
          let showRoomList = that.data.roomList
          roomList.forEach((item) => {
            if (item.imgs){
              item.imgs = app.globalData.imgApi + item.imgs;
            }
            showRoomList.push(item)
          })
          //加载轮播
          console.log(that.data.roomList[0].imgs)
          if (that.data.loadLunbo && that.data.roomList[0].imgs != null) {
            let hotelImgList= []
            for (let i = 0; i < 5; i++) {
              if (that.data.roomList[i]) {
                if (that.data.roomList[i].imgs){
                  hotelImgList.push(that.data.roomList[i].imgs)
                }
              }
            }
            that.setData({
              hotelImgList: hotelImgList,
              loadLunbo:false
            })
          }
          if (roomList.length < 20) {
            console.log('小于20')
            that.setData({
              roomList: showRoomList,
              pageNumber: res.data.data.pageNumber + 1,
              haveMore: false
            })
            console.log(roomList)
            wx.hideLoading()
          } else {
            that.setData({
              roomList: showRoomList,
              pageNumber: res.data.data.pageNumber + 1,
              haveMore: true
            })
            wx.hideLoading()
          }
        } else if (res.data.code == 0) { //没有更多酒店了
          that.setData({
            haveMore: false
          })
          wx.showModal({
            title: '提示',
            content: '没有房间了哦~',
            showCancel: false,
            confirmText: '返回上页',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else if (res.data.code == -1) { //没有房间
          that.setData({
            haveMore: false
          })
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '酒店当前日期没有房型',
            showCancel: false,
            confirmText: '知道了',
            success(res) {
              if (res.confirm) {
                console.log('酒店当前日期没有房型')
              }
            }
          })
        } else {
          that.setData({
            haveMore: false
          })
          wx.showModal({
            title: '提示',
            content: '服务器异常',
            showCancel: false,
            confirmText: '返回上页',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        }
        wx.hideLoading()
      },
      fail: function(res) {
        wx.hideLoading()
      },
      complete: function(res) {
        wx.hideLoading()
      },
    })
  },
  //领取优惠券查看详情
  seeStatus: function() {
    this.setData({
      seeStatus: !this.data.seeStatus
    })
  },

  //点击领取
  getCoupon: util.throttle(function() {
    wx.request({
      url: app.globalData.rootApi + '/zxkj/coupon/wxCheckOutAvailableCoupons',
      data: {
        hotelId: app.globalData1.hotelId
      },
      method: 'GET',
      header: {
        'content-type': 'application/json'
      },
      success: function(res) {
        console.log('领取优惠券的方法的返回结果', res.data)
        this.setData({
          newPeople: false
        })
      },
      fail: function(res) {

      }
    })


  }, 3000),

  //点击下次领取,关闭弹窗
  next: function() {
    this.setData({
      newPeople: false
    })
  },

  /**
   * 获取时间选择组件传来的值,
   * 发送时间改变后的请求
   */
  getComponentDate: util.throttle(function(e) {
    let that = this;
    console.log(2222222222222)
    //将组件传来的值赋给当前页面
    that.setData({
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      dateCount: app.globalData1.dateCount,
      pageNumber: 1,
      roomList: []
    })
    console.log('startTime', app.globalData1.startTime)
    //请求房型列表
    that.requestRoomList()
  }, 3000),

  //跳转至地图
  goMap: util.throttle(function() {
    let that = this;
    wx.openLocation({
      latitude: app.globalData1.latitude, //纬度
      longitude: app.globalData1.longitude, //经度
      scale: 28,
      name: that.data.hotelName, //描述
      address: that.data.address //地址
    })

  }, 3000),

  //拨打电话
  toContact: util.throttle(function() {
    let that = this;
    wx.makePhoneCall({
      phoneNumber: that.data.tel
    })
  }, 3000),

  /**
   * 点击点评按钮
   */
  toEval: util.throttle(function() {
    wx.navigateTo({
      url: '/pages/evaluation/evaluation?hotelId=' + app.globalData1.hotelId,
    })
  }, 3000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    let title = 'nvabarData.title'
    if(options.companyId != '' && options.companyId != null && options.companyId != 'undefined'){
      that.setData({
        companyId: options.companyId
      })
    } else {
      that.setData({
        companyId: ''
      })
    }
    that.setData({
      newPeople: false,
      hotelId: app.globalData1.hotelId,
      hotelName: app.globalData1.hotelName,
      // star: app.globalData1.star,
      // renovationTime: (app.globalData1.renovationTime).substr(0, 4),
      // rate: app.globalData1.rate,
      // street: app.globalData1.street,
      // hotelDistance: app.globalData1.hotelDistance,
      // address: app.globalData1.address,
      [title]: app.globalData1.hotelName
    });
  },

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
      url: app.globalData.rootApi +'/zxkj/hotel/wxHotelDetailInfo',
      data: {
        hotelId: app.globalData1.hotelId,
        // hotelId: 100036,
      },
      header: { 'content-type': 'application/x-www-form-urlencoded'},
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        let wxHotelDetails = res.data.data.wxHotelDetails;
        wxHotelDetails.forEach((item) => {
          item.renovationTime = item.renovationTime.substring(0, 4); //要截取时间的字符串
        })
        that.setData({
          tel: app.globalData1.tels,
          wxHotelDetails: wxHotelDetails,
          totalCommentCount: res.data.data.totalCommentCount,
          commentCount: res.data.data.commentCount,
          divide: res.data.data.divide
        })

      },
      fail: function(res) {},
      complete: function(res) {},
    })

  },

  /**
   * 立即预定按钮
   */
  orders: util.throttle(function(e) {
    var that = this;
    console.log('app.globalData1.endTime---' + app.globalData1.endTime)
    if (app.globalData1.endTime == '请选择') {
      wx.showToast({
        title: '请选择离店日期',
        icon: 'none',
        duration: 2000
      })
    } else {
      var hotelName = that.data.name;

      var i = e.currentTarget.id;
      var roomTypeId = that.data.roomList[i].roomTypeId;
      app.globalData2.roomTypeId = that.data.roomList[i].roomTypeId

      var name = that.data.roomList[i].name;
      app.globalData2.roomName = that.data.roomList[i].name

      var roomCount = that.data.roomList[i].roomCount;
      app.globalData2.roomCount = that.data.roomList[i].roomCount

      var bed = that.data.roomList[i].bed;
      app.globalData2.bed = that.data.roomList[i].bed

      var area = that.data.roomList[i].area;
      app.globalData2.area = that.data.roomList[i].area

      var price = that.data.roomList[i].discountPrice;
      app.globalData2.price = that.data.roomList[i].discountPrice

      var deposit = that.data.roomList[i].deposit;
      app.globalData2.deposit = that.data.roomList[i].deposit

      var minNegotiatedPrice = that.data.roomList[i].minNegotiatedPrice;
      app.globalData2.minNegotiatedPrice =  that.data.roomList[i].minNegotiatedPrice;

      wx.navigateTo({
        url: '/pages/orders/orders?companyId=' + that.data.companyId,
      })
    }

  }, 3000),

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
    console.log(111)
    let that = this
    if (that.data.haveMore == true) {
      that.requestRoomList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})