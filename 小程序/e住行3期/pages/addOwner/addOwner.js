// pages/addOwner/addOwner.js
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
      title: '新增常用入住人', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    name: '',
    phone: '',
    idCard: '',
    orderRoomId: '',//订单的ID
    maxRuZhuRenCount: '',//房间的最大容量
    orderId:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options)
    let orderRoomId = options.orderRoomId;
    this.setData({
      // name: options.userName,
      // phone: options.phone,
      // idCard: options.idCard,
      orderRoomId: orderRoomId,
      orderId: options.orderId
    })

  },

  /**
   * 获取用户姓名
   */
  name: function (e) {
    var name = e.detail.value
    this.setData({
      name: e.detail.value
    })
  },

  /**
   * 获取用户手机号
   */
  phone: function (e) {
    var phone = e.detail.value
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 获取用户身份证号码
   */
  idCard: function (e) {
    var idCard = e.detail.value
    this.setData({
      idCard: e.detail.value
    })
  },

/**
 * 提交用户信息按钮
 */
  confirm: util.throttle(function (e) {
    let that = this;
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    if (that.data.name.length == 0) {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.phone.length == 0) {
      wx.showToast({
        title: '手机号码不能为空',
        duration: 2000,
        icon: 'none'
      });
    }else if(!myreg.test(that.data.phone)){
      wx.showToast({
        title: '手机号码格式有误!',
        duration: 2000,
        icon: 'none'
      });
    }else if (that.data.idCard.length == 0) {
      wx.showToast({
        title: '身份证号码不能为空',
        duration: 2000,
        icon: 'none'
      });
    } else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idCard))) {
      wx.showToast({
        title: '身份证号码有误',
        duration: 2000,
        icon: 'none'
      });
    } else {
      // 添加入住人接口
      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxAddTenant',
        data: {
          orderRoomId: that.data.orderRoomId,
          name: that.data.name,
          phone: that.data.phone,
          idCardNum: that.data.idCard,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        method: 'POST',
        dataType: 'json',
        Type: 'json',
        success: function (res) {
          console.log('添加入住人成功返回值', res.data)
          if(res.data >= 0){
            wx.redirectTo({
              url: '/pages/staying/staying?idCard=' + that.data.idCard + '&name=' + that.data.name + '&phone=' + that.data.phone + '&orderId=' + that.data.orderId,
            })
          }else if(res.data == -2){

           wx.showToast({
             title: '本房间已添加过该入住人,不允许重复添加',
             icon: 'none',
             duration: 1500
           })
            setTimeout(function () {
              wx.redirectTo({
                url: '/pages/staying/staying?idCard=' + that.data.idCard + '&name=' + that.data.name + '&phone=' + that.data.phone + '&orderId=' + that.data.orderId,
              })
            }, 2000)
            
          }
          else{
            wx.showModal({
              title: '提示',
              content: '添加入住人失败',
              showCancel: true,
              cancelText: '取消',
              confirmText: '确定',
              success: function(res){
                if (res.confirm) {
                  console.log('用户点击确定')
                  wx.redirectTo({
                    url: '/pages/staying/staying?orderId=' + that.data.orderId ,
                  })
                } else if (res.cancel) {
                  console.log('用户点击取消')
                  wx.redirectTo({
                    url: '/pages/staying/staying?orderId=' + that.data.orderId,
                  })
                }
              }
            })
          }
         
        },
        fail: function (res) {
          console.log('添加入住人失败')
        }
      })

    }
  },3000),
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