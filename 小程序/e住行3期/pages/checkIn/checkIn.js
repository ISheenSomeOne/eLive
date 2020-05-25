// pages/checkIn/checkin.js
let app = getApp()
var util = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    test: 2,
    signboard: 1,

    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,

    chooseRoom: false,
    checkOut: false,
    hotelName: '',
    startTime: '',
    endTime: '',
    dateCount: '',
    roomName: '',
    openid: '',

    checkOutLists: '',
    orderId: '',
    orderRoomId: '',
    roomDoor: '', //房间号
    orderLists: '', //订单集合
    checkOutLists: '', //退房集合

    inTime: '',
    outTime: '',
    checkOutLists: '',
    orderId: '',
    orderRoomId: '',
    roomList: '',
    roomTypeName: '',
    orderListContinue: '',
    orderContinues: false,

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },



  /**
   * 续房按钮
   */
  continues: util.throttle(function(e) {
    let that = this;
    wx.showLoading({
      title: '玩命加载中',
    })
    // wx.showModal({
    //   title: '功能还在开发中',
    //   content: '非常抱歉，请重新预订',
    // })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/room/wxHotelNameByOpenid',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        if (res.data.length == 0 || (res.data.indexOf('<html><body>') != -1)) {
          console.log('续房的查询结果', res.data)
          wx.showModal({
            title: '提示',
            content: '暂无可续订单',
          })
          wx.hideLoading()

        } else {
          console.log('续房的查询结果', res.data)
          let orderListContinue = res.data;
          orderListContinue.forEach((item) => {
            item.inTime = item.inTime.substring(0, 10); //要截取时间的字符串
            item.outTime = item.outTime.substring(0, 10)
          })
          that.setData({
            orderListContinue: res.data,
            orderContinues: true
          })
          wx.hideLoading()
        }

      },
      fail: function(res) {
        wx.hideLoading()
        wx.showModal({
          title: '提示',
          content: '服务器错误,请稍后重试',
        })
      }
    })
  }, 500),

  /**
   * 续房模态框
   */
  checkInContinue: util.throttle(function(e) {
    let that = this;
    var i = e.currentTarget.id;
    console.log('点击', e.currentTarget.id)
    var orderId = that.data.orderListContinue[i].id;
    app.globalDataDoorList.orderListContinue = that.data.orderListContinue
    app.globalDataDoorList.checkInDate = that.data.orderListContinue[i].outTime
    app.globalDataDoorList.orderId = that.data.orderListContinue[i].id
    var checkInDate = app.globalDataDoorList.checkInDate

    console.log('app.globalDataDoorList.orderListContinue', app.globalDataDoorList.orderListContinue)
    console.log('我的orderId', that.data.orderListContinue[i].id)
    console.log('ord', orderId)
    that.setData({
      orderContinues: false
    })
    wx.navigateTo({
      url: '/pages/continue/continue?checkInDate=' + checkInDate + '&orderId=' + orderId,
    })
  }, 500),

  openContinue: util.throttle(function(e) {
    let that = this;
    that.setData({
      orderContinues: false,
    })

  }, 500),

  /**
   * 点击换房按钮
   */
  exchange: util.throttle(function(e) {
    let that = this;
    wx.request({
      url: app.globalData.rootApi + '/zxkj/roomType/wxRoomTypeName',
      data: {
        openid: that.data.openid,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        console.log('换房结果' + res.data)
        if (res.data.length == 0 || (res.data.indexOf('<html><body>') != -1)) {
          wx.showModal({
            title: '提示',
            content: '暂无可换房间或换房权限不足',
          })
        } else {
          that.setData({
            roomTypeName: res.data
          })
          wx.navigateTo({
            url: '/pages/exchange/exchange?roomTypeName=' + that.data.roomTypeName,
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '服务器错误,请稍后重试',
        })
      }
    })


  }, 3000),


  /**
   * 点击开锁按钮
   */
  opens: util.throttle(function() {
    let that = this

    if (that.data.orderLists.length == 0) {
      wx.showToast({
        title: '暂无订单',
        icon: 'none',
        duration: 2000
      })
      that.setData({
        chooseRoom: false
      })
    } else {
      that.setData({
        chooseRoom: true
      })
    }

  }, 3000),

  //开锁接口
  openRoom: util.throttle(function(e) {
    let that = this
    var i = e.currentTarget.id;
    var roomId = that.data.orderLists[i].roomId;
    wx.showModal({
      title: '提示',
      content: '确定开启门锁吗？',
      success(res) {
        if (res.confirm) {
          wx.request({
            url: app.globalData.rootApi + '/zxkj/lock/unLock',
            data: {
              //房间ID
              roomId: roomId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',
            dataType: 'json',
            Type: 'json',
            success: function(res) {
              if (res.data == false) {
                wx.showModal({
                  title: '开锁结果',
                  content: '开锁失败',
                })
              } else {
                wx.showToast({
                  title: '开锁成功',
                  icon: 'success',
                  duration: 2000
                })
              }
            },
            fail: function(res) {
              wx.showModal({
                title: '服务器异常',
                content: '开锁失败',
              })
            }

          })
          //关闭上一级模态框
          that.setData({
            chooseRoom: false
          })
        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  }, 3000),

  /**
   *  退房按钮
   */
  checkOutBtn: util.throttle(function() {
    let that = this;
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetRoomDoorByOpenId',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      success: function(res) {
        console.log('退房的全部房间号', res.data)

        if (res.data.length == 0 || (res.data.indexOf('<html><body>') != -1)) {
          wx.showModal({
            title: '提示',
            content: '暂无可退房间',
          })
          that.setData({
            checkOut: false
          })
        } else {
          that.setData({
            checkOutLists: res.data,
            checkOut: true
          })
        }
      },
      fail: function(res) {

      }
    })


  }, 3000),

  /**
   * 点击退房模态框按钮
   */
  checkOuts: util.throttle(function(e) {
    let that = this;
    var i = e.currentTarget.id;
    var orderId = that.data.checkOutLists[i].orderId;
    var orderRoomId = that.data.checkOutLists[i].orderRoomId;

    wx.navigateTo({
      url: '/pages/checkOut/checkOut?orderRoomId=' + orderRoomId + '&orderId=' + orderId
    })

  }, 3000),

  /**
   * 全部退房
   */
  checkOutAll: function() {
    wx.showModal({
      title: '提示',
      content: '是否确定全部退房',
      confirmColor: '#f06c00',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },
  lookOrder: util.throttle(function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    let orderRoomId = that.data.orderLists[index].id
    wx.navigateTo({
      url: '/pages/livingRoom/livingRoom?orderRoomId=' + orderRoomId,
    })
  }, 2000),

  //点击完成,关闭模态框
  openDone: function() {
    this.setData({
      chooseRoom: false
    })
  },
  //点击完成,关闭模态框
  checkOutDone: function() {
    this.setData({
      checkOut: false
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
    let that = this;
    that.setData({
      checkOut: false
    })
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage?signboard=' + that.data.signboard, //授权页面
      })
    } else {
      if (that.haveUnionId()) {
        wx.navigateTo({ //跳转到授权页面
          url: '/pages/authorizationPage/authorizationPage', //授权页面
        })
      } else {
        wx.getSetting({
          success: function(res) {
            if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
              wx.request({
                url: app.globalData.rootApi + '/zxkj/order/wxGetCurrUseingOrderByOpenId',
                data: {
                  openId: that.data.openid
                },
                header: {
                  'content-type': 'application/x-www-form-urlencoded'
                },
                method: 'POST',
                dataType: 'json',
                Type: 'json',
                success: function(res) {
                  var data = res.data;
                  if (data.code == 200) {
                    // console.log('sadas', data.data)
                    // console.log('dasfasfass', data)
                    let orderLists = data.data; //获取到数据
                    orderLists.forEach((item) => {
                      item.inTime = item.inTime.substring(5, 10); //要截取时间的字符串
                      item.outTime = item.outTime.substring(5, 10);
                      item.logo = app.globalData.imgApi + item.logo;
                    })
                    that.setData({
                      orderLists: orderLists,
                    })
                  } else if (data.code == 0) {
                    that.setData({
                      orderLists: [],
                    })

                    wx.showToast({
                      title: '没有订单',
                      duration: 1500,
                      icon: "none"
                    })
                  } else {
                    that.setData({
                      orderLists: [],
                    })
                    wx.showModal({
                      title: '提示',
                      content: '服务器错误',
                    })
                  }


                },
                fail: function(res) {

                }
              })

            } else {
              wx.navigateTo({ //跳转到授权页面
                url: '/pages/authorizationPage/authorizationPage?signboard=' + that.data.signboard, //授权页面
              })
            }
          }
        })
      }

      wx.getStorage({
        key: 'openid',
        success: function(res) {
          that.setData({
            openid: res.data
          })
          console.log('缓存的openid', res.data)
        }
      });
    }


  },

  //针对已注册会员，判断是否保存了UnionID
  haveUnionId: function() {
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
      success: function(res) {
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
      fail: function(res) {
        wx.hideLoading()
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

  },
  look: util.throttle(function() {
    wx.showModal({
      title: '提示',
      content: '此功能暂未开放',
    })
  }, 3000)
})