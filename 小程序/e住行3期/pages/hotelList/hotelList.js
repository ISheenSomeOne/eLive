// pages/choosePerson/choosePerson.js
var app = getApp();
var util = require('../../utils/util.js')
// var startTime = app.globalData1.startTime;
// var endTime = app.globalData1.endTime;
var hotelId = app.globalData1.hotelId
var street = app.globalData1.street
var name = app.globalData1.name
var rate = app.globalData1.rate
var renovationTime = app.globalData1.renovationTime
var hotelDistance = app.globalData1.hotelDistance
var star = app.globalData1.star
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '酒店列表', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    hotelList: [],
    isHide: true,
    startTime: '',
    endTime: '',
    pageNumber: 1,
    haveMore: true,
    list: '',
    showDialog: false,
  },
  close: function () {
    this.setData({
      showDialog: false,
      showAndroidDialog: false
    });
  },
  openCouponList: function () {
    this.setData({
      showDialog: true
    });
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log('options', options);
    var list = JSON.parse(options.obj)
    var that = this;
    that.setData({
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      list: list
    })
    console.log('全局', app.globalData1.endTime)
    //请求酒店列表
    that.requestHotelList()
  },
  requestHotelList: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/hotel/wxHotelList',
      data: {
        openid: wx.getStorageSync('openid'),
        address: that.data.list[0] + ',' + that.data.list[1] + ',' + that.data.list[2],
        latitude: that.data.list[3],
        longitude: that.data.list[4],
        startTime: that.data.startTime,
        endTime: that.data.endTime,
        pageNumber: that.data.pageNumber
      },
      header: {
        'content-type': 'application/json'
      },
      method: 'GET',
      dataType: 'json',
      success: function (res) {
        if (res.data.code == 200) {
          console.log('返回结果:', res.data.data)
          let hotelList = res.data.data.hotelList
          let showHotelList = that.data.hotelList
          hotelList.forEach((item) => {
            item.logo = app.globalData.imgApi + item.logo;
            if ((item.hotelDistance != null) && item.hotelDistance < 1000) {
              item.hotelDistance = '距您直线' + item.hotelDistance + 'm'
            } else if ((item.hotelDistance != null) && item.hotelDistance >= 100000) {
              item.hotelDistance = '酒店位于云南省昆明市'
            } else if ((item.hotelDistance != null) && item.hotelDistance >= 1000) {
              item.hotelDistance = '距您直线' + (item.hotelDistance / 1000).toFixed(2) + 'km'
            } else {
              item.hotelDistance = ''
            }
            showHotelList.push(item)
          })
          console.log(showHotelList)
          if (hotelList.length < 20) {
            that.setData({
              hotelList: showHotelList,
              haveMore: false,
              pageNumber: res.data.data.pageNumber + 1,
            })
            wx.hideLoading()
          } else {
            that.setData({
              hotelList: hotelList,
              haveMore: true,
              pageNumber: res.data.data.pageNumber + 1,
            })
            wx.hideLoading()
          }
        } else if (res.data.code == 0) {
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            haveMore: false
          })
          wx.hideLoading()
        } else if (res.data.code == -1) {
          that.setData({
            haveMore: false
          })
          wx.hideLoading()
          wx.showModal({
            title: '提示',
            content: '目前仅云南省昆明市部分区域有酒店哦',
            showCancel: false,
            confirmText: '知道了',
            success(res) {
              if (res.confirm) {
                wx.navigateBack({
                  delta: 1
                })
              }
            }
          })
        } else {
          that.setData({
            haveMore: false
          })
          wx.hideLoading()
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
      },
      fail: function (res) {
        wx.hideLoading()
        wx.showToast({
          title: '服务器网络错误',
          icon: 'none',
          duration: 2000
        })
      },
      complete: function (res) {
        wx.hideLoading()
      },
    })
  },

  /**
   * 点击酒店,跳转至酒店房间页面
   */
  hotelDetail: util.throttle(function (e) {
    var that = this;
    var i = e.currentTarget.id;
    console.log('dssssssssssssss', e.currentTarget.id)
    var hotelId = that.data.hotelList[i].id;
    app.globalData1.hotelId = that.data.hotelList[i].id;
    //经纬度
    app.globalData1.latitude = that.data.hotelList[i].latitude;
    app.globalData1.longitude = that.data.hotelList[i].longitude;
    var name = that.data.hotelList[i].name;
    app.globalData1.hotelName = that.data.hotelList[i].name;
    app.globalData1.address = that.data.hotelList[i].address;
    var star = that.data.hotelList[i].star;
    app.globalData1.star = that.data.hotelList[i].star;
    var renovationTime = that.data.hotelList[i].renovationTime;
    app.globalData1.renovationTime = that.data.hotelList[i].renovationTime;
    var rate = that.data.hotelList[i].rate;
    app.globalData1.rate = that.data.hotelList[i].rate;
    var street = that.data.hotelList[i].street;
    app.globalData1.street = that.data.hotelList[i].street;
    var hotelDistance = that.data.hotelList[i].hotelDistance;
    app.globalData1.hotelDistance = that.data.hotelList[i].hotelDistance;
    app.globalData1.tels = that.data.hotelList[i].tels;
    console.log("i", e.currentTarget.id)
    //判断是否授权
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage', //授权页面
      })
    } else {
      if (that.haveUnionId()) {
        wx.navigateTo({ //跳转到授权页面
          url: '/pages/authorizationPage/authorizationPage', //授权页面
        })
      } else {
        wx.getSetting({
          success: function (res) {
            if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
              //获取用户信息
              wx.getUserInfo({
                success: (res) => {
                  console.log('res的结果', res)
                }
              });
              wx.navigateTo({
                url: '/pages/hotelDetail/hotelDetail?hotelId=' + hotelId + '&name=' + name + '&star=' + star + '&renovationTime=' + renovationTime + '&rate=' + rate + '&street=' + street + '&hotelDistance=' + hotelDistance,
              })
            } else {
              wx.navigateTo({ //跳转到授权页面
                url: '/pages/authorizationPage/authorizationPage', //授权页面
              })
            }
          }
        })
      }

    }
  }, 1000),

  //针对已注册会员，判断是否保存了UnionID
  haveUnionId: function () {
    let that = this
    let haveNot = true
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/oauth/wxGetUidByOpenid',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        // console.log('res-----')
        // console.log(res.data)
        if (res.data.code == 200) {
          haveNot = true
        } else {
          haveNot = false
        }
        wx.hideLoading()

        return haveNot //返回值
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
    let that = this
    if (that.data.haveMore == true) {
      that.requestHotelList()
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }


})