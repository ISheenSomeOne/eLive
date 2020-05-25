// pages/map/map.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    hotelName: '',
    address: '大家好大师傅喜欢的世界杯',
    androidBaiduUrl: '',
    //地图标点
    markers: [{
      iconPath: "../image/didian.svg",
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 30,
      height: 30,
      callout: {
        content: 'hotelName in here',
        borderRadius: 10
      },
    }],
    //路线
    polyline: [{
      points: [{
        longitude: 113.3245211,
        latitude: 23.10229
      }, {
        longitude: 113.324520,
        latitude: 23.21229
      }],
      color: "#FF0000DD",
      width: 2,
      dottedLine: true
    }],
    controls: [{
      id: 1,
      iconPath: '../image/xihuan1.png',
      position: {
        left: 0,
        top: 300,
        width: 50,
        height: 50
      },
      clickable: true
    }]
  },
  
  regionchange(e) {
    console.log(e.type)
  },
  markertap(e) {
    console.log(e.markerId)
  },
  controltap(e) {
    console.log(e.controlId)
  },

  /**
   * 打开百度地图app导航
   */ 
  goMap: function () {
    wx.openLocation({
      latitude: 23.099994,
      longitude: 113.324520,
      scale: 28,
      name: 'kjdshfdashg', //描述
      address: 'asdasdfadsf' //地址
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let latitude = `markers[0].latitude`;
    let longitude = `markers[0].longitude`;
    that.setData({
      // name: options.name,
      // address: options.address,
      // [latitude]: options.latitude,
      // [longitude]: options.longitude,
      // androidBaiduUrl: 'bdapp://map/navi?location=' + options.latitude + ',' + options.longitude + '&coord_type=wgs84' + '&src=andr.zhuxingkeji.ezhuxing'
      androidBaiduUrl: 'bdapp://map/navi?location=23.099994,113.324520&coord_type=wgs84&src=andr.zhuxingkeji.ezhuxing'
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用 wx.createMapContext 获取 map 上下文
    this.mapCtx = wx.createMapContext('map')

  },
  moveToLocation: function () {
    this.mapCtx.moveToLocation()
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    wx.createMapContext
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