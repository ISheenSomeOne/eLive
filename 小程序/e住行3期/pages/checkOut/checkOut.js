// pages/checkOut/checkOut.js
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
      title: '退房', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
   
    orderId: '',
    orderRoomId:'',
    roomTypeName: '',
    inTime: '',
    outTime:''
  },

  /**
   * 点击退房
   */
  checkOut: util.throttle(function () {
    let that = this;
    wx.showModal({
      title: '提示',
      content: '是否确认退房',
      confirmColor: '#f06c00',
      success(res) {
        if (res.confirm) {
          console.log('用户点击确定')
          wx.request({
            url: app.globalData.rootApi + '/zxkj/order/wxCheckOut',
            data: {
             orderId: that.data.orderId,
             orderRoomId: that.data.orderRoomId
            },
            header: {
              'content-type': 'application/x-www-form-urlencoded'
            },
            method: 'POST',

            success: function (res) {
              console.log('确定退房的结果', res.data)
              if(res.data.code == 0){
               wx.showToast({
                 title: '退房成功',
                 icon:'none',
                 duration: 1500
               })
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/checkIn/checkIn',
                    success: function (e) {
                      var page = getCurrentPages().pop(); //当前页面
                      console.log('00000000000000')
                      console.log(page)
                      console.log('00000000000000')
                      // if (page == undefined || page == null) return;
                      page.onShow(); //或者其它操作
                      page.onLoad(); //或者其它操作
                    }
                  })
                },1500)
              } else if (res.data.code == -1){
                wx.showToast({
                  title: '退房失败,请于入住结束后再退房',
                  icon: 'none',
                  duration: 1500
                })
                setTimeout(function(){
                  wx.switchTab({
                    url: '/pages/checkIn/checkIn',
                    success: function (e) {
                      console.log('11111111111111111111111111111111111111111111111111111111111111111')
                      var page = getCurrentPages().pop(); //当前页面
                      if (page == undefined || page == null) return;
                      page.onLoad(); //或者其它操作
                    }
                  })
                },1500)
              }
              // wx.showModal({
              //   title: '提示',
              //   content: '退房成功!',
              //   showCancel: true,
              //   cancelText: '取消',
              //   confirmText: '确定',
              //   success: function(res){
              //     if(res.confirm){
              //       wx.redirectTo({
              //         url: '/pages/checkIn/checkIn',
              //       })
              //     }else if(res.cancel){
              //       wx.redirectTo({
              //         url: '/pages/checkIn/checkIn',
              //       })
              //     }
                 
              //   }

              // })
            },
            fail: function (res) {

            }
          })

        } else if (res.cancel) {
          console.log('用户点击取消')
        }
      }
    })
  },3000),

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   let that = this;
    that.setData({
      orderId: options.orderId,
      orderRoomId: options.orderRoomId
    })
    console.log('orderRoomId',options.orderRoomId)
    wx.request({
      url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetOrderRoomById',
      data: {
        orderRoomId: that.data.orderRoomId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',

      success: function (res) {
        console.log('确定退房的结果达到打发', res.data)
        var inTime = res.data.inTime.substring(0,10)
        console.log('sdafadsfag', res.data.inTime.substring(0, 10))
        var outTime = res.data.outTime.substring(0, 10)
        that.setData({
          roomTypeName: res.data.roomTypeName,
          inTime: inTime,
          outTime: outTime,
          autoOutTime: res.data.outTime,
          roomDay: res.data.roomDay 
        })
      },
      fail: function (res) {

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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})