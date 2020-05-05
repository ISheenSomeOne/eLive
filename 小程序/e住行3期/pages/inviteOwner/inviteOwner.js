// pages/inviteOwner/inviteOwner.js
let app = getApp()
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
    hotel: '春田惠谷酒店',
    userName: '李散散',
    orderRoomId: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    that.setData({
      orderRoomId: options.orderRoomId
    })
    wx.hideShareMenu()
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
      success: function(res) {
        if (res.authSetting['scope.userInfo']) { //授权了，可以获取用户信息了
          //获取用户信息
          wx.getUserInfo({
            success: function(res) {
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
            url: '/pages/authorizationPage/authorizationPage?', //授权页面
          })
        }
      }
    })

    if (that.data.orderRoomId == '' || that.data.orderRoomId == null || typeof(that.data.orderRoomId) == 'undefind') {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxGetInviteInfo',
        data: {
          orderRoomId: that.data.orderRoomId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log('-------------', res.data)
          if (res.data.code == 0) {
            console.log(res.data)
            let inviteInfo = res.data
            inviteInfo.checkinDate = inviteInfo.checkinDate.substr(5, 5)
            inviteInfo.checkoutDate = inviteInfo.checkoutDate.substr(5, 5)

            let user = inviteInfo.userName;
            let phone = inviteInfo.phone.replace(/(\d{3})(\d{4})(\d{4})/, "$1****$3");

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
              inviteInfo: inviteInfo,
              user: newUser,
              phone: phone
            })
            wx.hideLoading()
          } else if (res.data.code == -1) {
            wx.hideLoading()
            wx.showToast({
              title: '建议重新进入或关闭小程序重启',
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.hideLoading()
            wx.showToast({
              title: '服务器异常',
              duration: 2000,
              icon: "none"
            })
            setTimeout(function(){
              wx.navigateBack({
                delta: 1
              })
            },2000)
          }
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function(res) {
          wx.hideLoading()
        }
      })
    }

    
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

    if (that.data.orderRoomId == '' || that.data.orderRoomId == null || typeof(that.data.orderRoomId) == 'undefind') {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 2000,
        icon: "none"
      })
    } else {
      return {
        title: '酒店入住邀请',
        path: '/pages/invitee/invitee?orderRoomId=' + that.data.orderRoomId + '&avatarUrl=' + that.data.userInfo.avatarUrl + '&nickName=' + that.data.userInfo.nickName
      }
    }
  }
})