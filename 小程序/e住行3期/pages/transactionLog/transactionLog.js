// pages/transactionList/transactionLog.js
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
      title: '交易记录', //导航栏 中间的标题
    },

    openid: '',
    nowIndex: 0,
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    topNav: [{
      name: '全部',
      active: true
    }, {
      name: '待入住',
      active: false
    }, {
      name: '待支付',
      active: false
    }, {
      name: '已完成',
      active: false
    }, {
      name: '待退款',
      active: false

    }],
    userOrder: [],
    orderId: '',
    dateTime: '',
    identification: '',
    hotelName: '',
    orderPrice: '',
    hotelType: '',
    roomTypeName: '',
    days: '',
    roomCount: '',
    inTime: '',
    outTime: '',
    startTime: '',
    times: '',
    haveMore: true,
    pageNumber: 1,
    array: ['全部', '微信', '支付宝', '余额'],
    index:0, 
  },

  //选择器
  bindPickerChange: function(e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      index: e.detail.value
    })
  },

  requestOrder: function(index) {
    let that = this
    wx.showLoading({
      title: '玩命加载中',
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/order/wxGetOrderByOpenId',
      data: {
        openid: wx.getStorageSync('openid'),
        index: that.data.nowIndex,
        pageNumber: that.data.pageNumber
      },
      method: "POST",
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success(res) {
        console.log('orderData---', res.data)
        if (res.data.code == 200) {
          let userOrder = res.data.data.orderList; //获取到数据
          console.log(userOrder)
          let showUserOrder = that.data.userOrder
          userOrder.forEach((item) => {
            // item.days = calculateTimeDifference(item.inTime, item.outTime)
            item.inTime = item.inTime.substring(0, 10); //要截取时间的字符串
            item.outTime = item.outTime.substring(0, 10)
            showUserOrder.push(item)
          })
          if (userOrder.length < 20) {
            that.setData({
              userOrder: showUserOrder,
              haveMore: false,
              pageNumber: res.data.data.pageNumber + 1,
            })
            wx.hideLoading()
          } else {
            that.setData({
              userOrder: showUserOrder,
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
          wx.showToast({
            title: '没有更多了',
            icon: 'none',
            duration: 2000
          })
          that.setData({
            haveMore: false
          })
          wx.hideLoading()
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
      }

    })
  },

  change: util.throttle(function(e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    
    that.setData({
      nowIndex: index,
      userOrder: [],
      pageNumber:1
    })
    //请求订单
    that.requestOrder()
  }, 200),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.requestOrder()
  },

  /**
   * 取消预订按钮
   */
  cancel: util.throttle(function(e) {
    let that = this;
    var i = e.currentTarget.dataset.id;
    console.log('---------' + i)
    wx.showModal({
      title: '是否确定取消',
      content: '取消后不可撤回',
      success(res) {
        if (res.confirm) {
          var dateTime = new Date()
          var cancelTime = new Date(that.data.userOrder[i].hotelCancelTime)
          console.log('dateTime', dateTime.getTime())
          console.log('startTime', cancelTime.getTime())

          if (dateTime.getTime() >= cancelTime.getTime()) {
            wx.showModal({
              title: '提示',
              content: '已超过退订时间',
            })
          } else {
            var orderId = that.data.userOrder[i].orderId
            console.log(orderId)
            wx.request({
              url: app.globalData.rootApi + '/zxkj/order/wxOrderCancel',
              data: {
                orderId: orderId
              },
              method: 'GET',
              success: function(res) {
                console.log('res.data', res.data)
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
                    content: '服务器错误',
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

  }, 2000),

  /**
   * 点击跳转至待入住页面
   */
  goto: util.throttle(function(e) {
    let that = this
    let index = e.currentTarget.dataset.id
    var orderId = that.data.userOrder[index].orderId
    console.log('777777777777', that.data.userOrder[index].orderId)
    if (that.data.userOrder[index].identification == '待入住') {
      wx.navigateTo({
        url: '/pages/staying/staying?orderId=' + orderId + '&oneself=' + that.data.userOrder[index].oneself,
      })

    } else if (that.data.userOrder[index].identification == '已完成') {
      wx.navigateTo({
        url: '/pages/doneOrder/doneOrder?orderId=' + orderId,
      })

    } else if (that.data.userOrder[index].identification == '待支付') {
      wx.navigateTo({
        url: '/pages/waitingPay/waitingPay?orderId=' + orderId,
      })

    } else if (that.data.userOrder[index].identification == '预定取消') {
      wx.navigateTo({
        url: '/pages/cancelOrder/cancelOrder?orderId=' + orderId,
      })
    } else if (that.data.userOrder[index].identification == '入住中') {
      wx.navigateTo({
        url: '/pages/living/living?orderId=' + orderId + '&oneself=' + that.data.userOrder[index].oneself,
      })
    }


  }, 3000),
  toStart: function() {
    wx.switchTab({
      url: '/pages/start/start',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function(e) {},

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

    let that = this
    wx.getStorage({
      key: 'openid',
      success: function(res) {
        that.setData({
          openid: res.data
        })
        console.log('缓存的openid', res.data)
      }
    });
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
    let that = this
    that.requestOrder()
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})