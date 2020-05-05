// pages/proxyPay/proxyPay.js
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
      title: '', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    setInter: '',
    timeOut: '',
    orderId: '',
    date: '',
    createTime: '',
    orderInfo: '',
    remainingTimeMinu: '05',
    remainingTimeSec: '00',
    isTimeOut:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;

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
          console.log('waitingInfo----', orderInfo)
          var DATE = util.formatDate(new Date());
          let title = 'nvabarData.title'

          let createTime = new Date(orderInfo.orderCreateTime) //获取订单创建时间
          console.log('createTime---' + createTime)
          createTime.setMinutes(createTime.getMinutes() + 5) //时间加5分钟
          console.log('createTime---' + createTime)
          var year = createTime.getFullYear(); //得到年份
          var month = createTime.getMonth() + 1; //得到月份
          var date = createTime.getDate(); //得到日期
          var hour = createTime.getHours(); //得到小时
          var minu = createTime.getMinutes(); //得到分钟
          let timeOut = year + '年' + month + '月' + date + '日' + hour + ':' + minu

          let user = orderInfo.name;
          let phone = orderInfo.tel.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

          let formatName = function (name) {
            let newStr;
            if (name.length === 2) {
              newStr = name.substr(0, 1) + '*';
            } else if (name.length > 2) {
              var char = '';
              for (let i = 0, len = name.length - 2; i < len; i++) {
                char += '*';
              }
              newStr = name.substr(0, 1) + char + name.substr(-1, 1);
            } else {
              newStr = name;
            }
            return newStr;
          };

          let newUser = formatName(user.trim())

          that.setData({
            user: newUser,
            phone: phone,
            timeOut: timeOut,
            orderId: options.orderId,
            date: DATE,
            createTime: createTime,
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
    let that = this
    wx.getSetting({
      success: function (res) {
        if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
          //获取用户信息
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              var avatarUrl = 'userInfo.avatarUrl';
              var nickName = 'userInfo.nickName';
              that.setData({
                [avatarUrl]: res.userInfo.avatarUrl,
                [nickName]: res.userInfo.nickName,
              })
            }
          })
        } else {
          wx.navigateTo({ //跳转到授权页面
            url: '/pages/authorizationPage/authorizationPage', //授权页面
          })
        }
      }
    })

    //将计时器赋值给setInter
    that.data.setInter = setInterval(function () {
      let now = new Date()
      let remainingTime = that.data.createTime - now
      let remainingTimeMinu = parseInt(remainingTime / 60000)
      let remainingTimeSec = parseInt((remainingTime / 1000) % 60)
      if (remainingTimeSec < 0) {
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
        that.setData({
          isTimeOut: true
        })
      }
      if (remainingTimeMinu < 10) {
        remainingTimeMinu = "0" + remainingTimeMinu
      }
      if (remainingTimeSec < 10) {
        remainingTimeSec = "0" + remainingTimeSec
      }
      that.setData({
        remainingTimeMinu: remainingTimeMinu,
        remainingTimeSec: remainingTimeSec
      })
      //时间到
      if ((that.data.remainingTimeMinu == '00') && (that.data.remainingTimeSec == '00')) {
        //清除计时器  即清除setInter
        clearInterval(that.data.setInter)
        that.setData({
          isTimeOut: true
        })
      }

    }, 1000);
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
    let that = this
    return {
      title: '代付邀请',
      path: '/pages/proxyPayTwo/proxyPayTwo?orderId=' + that.data.orderId + '&avatarUrl=' + that.data.userInfo.avatarUrl + '&nickName=' + that.data.userInfo.nickName
    }
  }
})