 // pages/myEvaluation/myEvaluation.js
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
      title: '我的评价', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    openid: '',
    has: true,
    evalInfo: '',
    noEvalInfo: '',
    evalInfo: [{
       hotelName: '',
       createTime: '',
       comment: '',
       seeAll: false
     }],
    // noEvalInfo: [{
    //   orderId: '',
    //   hotelName: '',
    //   roomTypeName: '',
    //   roomDay: '',
    //   roomNum: '',
    //   price: '',
    //   inTime: '',
    //   endTime: '',
    // }, ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
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
   * 已评价请求
   */
  toSee: util.throttle(function() {
    this.eval()
    
  },1000),

/**
 * 已评价的请求封装
 */
  eval: function(e) {
    let that = this;
   
    console.log('已请求开始')
    wx.request({
      url: app.globalData.rootApi + '/zxkj/comment/wxLookMemberComment',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
       console.log('已评价', res.data)
      
        let data = res.data
        for (let i = 0; i < data.length; i++) {
          data[i].createTime = data[i].createTime.substring(0, 10)
          //收到4个评分，算出平均分并赋值给roomScore
          data[i].serviceRate = (data[i].roomScore + data[i].serviceScore + data[i].facilitiesScore + data[i].environmentScore) / 4
          console.log('平均分', (data[i].roomScore + data[i].serviceScore + data[i].facilitiesScore + data[i].environmentScore) / 4)
       
        }
        that.setData({
          evalInfo: data,
          has: true
        })
      },
      fail: function(res) {

      }
    })
  },

/**
 * 未评价请求
 */
  toEvals: util.throttle(function() {
    let that = this;
    console.log('未请求开始')
    wx.request({
      url: app.globalData.rootApi + '/zxkj/comment/wxLookMemberOrder',
      data: {
        openid: that.data.openid
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function (res) {
        console.log('未评价',res.data)
        if (res.data.length == 0) {
          that.setData({
            has: false,
          })
          wx.showToast({
            title: '暂无未评价订单',
            icon: 'none',
            duration: 1000
          })
        }else{
          let noEvalInfo = res.data;
          noEvalInfo.forEach((item) => {
            item.inTime = item.inTime.substring(0, 10); //要截取时间的字符串
            item.endTime = item.endTime.substring(0, 10); //要截取时间的字符串
          })
          that.setData({
            has: false,
            noEvalInfo: noEvalInfo
          })
        }
       
      },
      fail: function (res) {

      }
    })

   
  },1000),
  seeAll: function(e) {
    let index = e.currentTarget.dataset.index
    let now = this.data.evalInfo[index].seeAll
    let seeAll = 'evalInfo[' + index + '].seeAll'
    this.setData({
      [seeAll]: true
    })
  },
  close: function(e) {
    let index = e.currentTarget.dataset.index
    let now = this.data.evalInfo[index].seeAll
    let seeAll = 'evalInfo[' + index + '].seeAll'
    this.setData({
      [seeAll]: false
    })
  },

 /**
  * 点击评论跳转至评论页面
  */
  evaluation: util.throttle(function(e){
    let that = this
    let index = e.currentTarget.dataset.index
    console.log(index)
    console.log(that.data.noEvalInfo[index].orderId)
   wx.redirectTo({
     url: '/pages/evaluate/evaluate?orderId='+ that.data.noEvalInfo[index].orderId,
   })
  },1000),

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {
    this.eval()
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

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