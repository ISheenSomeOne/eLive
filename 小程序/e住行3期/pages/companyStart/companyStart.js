// pages/companyStart/companyStart.js
var QQMapWX = require('../../utils/qqmap-wx-jssdk.min.js');
var util = require('../../utils/util.js')
var qqmapsdk
var app = getApp();
var startTime = app.globalData.startTime;
var endTime = app.globalData.endTime;
var dateCount = app.globalData.dateCount;

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,  
    //判断小程序的API，回调，参数，组件等是否在当前版本可用。
    newPeople: true,
    seeStatus: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    province: '',
    city: '',
    district: '',
    region: ['云南省', '昆明市', '官渡区'], 
    latitude: '666',
    longitude: '666',

    startTime: '',//开始时间
    endTime: '',//结束时间
    dateCount: '', //共几天

    value: [0, 0, 0],
    values: [0, 0, 0],
    condition: false,
    companyId: '',//扫码得到的公司Id
    companyName: '',//协议公司名称
  },

  /**
   * 获取省市区选择器的值
   */
  bindRegionChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      region: e.detail.value,
      latitude: '666',
      longitude: '666'
    })
  },

  /**
   * 获取时间组件传来的值
   */
  getComponentDate: function (e) {
    app.globalData1.startTime = e.detail.startTime;
    app.globalData1.endTime =e.detail.endTime;
    app.globalData1.dateCount =e.detail.dateCount;
    console.log('开始时间', app.globalData1.startTime)
    console.log('结束时间', app.globalData1.endTime)
  },
  //优惠券
  seeStatus: function () {
    this.setData({
      seeStatus: !this.data.seeStatus
    })
  },
  getCoupon: function () {
    this.setData({
      newPeople: false
    })
  },
  next: function () {
    this.setData({
      newPeople: false
    })
  },

  onReady: function () {

  },

  /**
   * 生命周期事件
   */
  onLoad: function (options) {
    qqmapsdk = new QQMapWX({
      key: 'UNRBZ-3P43P-2TRDB-VEXS2-KCQQO-CWB6D' //自己的key秘钥 http://lbs.qq.com/console/mykey.html 在这个网址申请
    });
    let vm = this;
    let companyId = decodeURIComponent(options.q).split('=')[1]
    vm.setData({
      companyId: companyId
      // companyId: 2
    })
    if(vm.data.companyId){
      vm.getCompanyName()
    }
    vm.getUserLocation();

    //获取当天日期
    var timestamp = Date.parse(new Date());
    var date = new Date(timestamp);
    let tomorrow = new Date();
    tomorrow.setTime(date.getTime() + 24 * 60 * 60 * 1000)
    //今天
    //获取年份
    var Y = date.getFullYear();
    //获取月份  
    var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1);
    //获取当日日期 
    var D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();

    //明天
    //获取年份  
    var tY = tomorrow.getFullYear();
    //获取月份  
    var tM = (tomorrow.getMonth() + 1 < 10 ? '0' + (tomorrow.getMonth() + 1) : tomorrow.getMonth() + 1);
    //获取明日日期 
    var tD = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate();

    this.setData({
      startTime: Y + '-' + M + '-' + D,
      endTime: tY + '-' + tM + '-' + tD
    })

  
    console.log('初始化完成');

  },
  onShow: function () { 
    this.setData({
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime
    })
  },

  /**
   * 接口获取公司名称
   */
  getCompanyName: function(){
    let that = this
    wx.request({
      url: app.globalData.rootApi + '/zxkj/company/wxGetCompanyName',
      data: {
        companyId: this.data.companyId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      success: function(res) {
        if(res.data.code == 200){
          that.setData({
            companyName: res.data.data
          })
        } else if(res.data.code == -1){
          wx.showModal({
            title: '提示',
            content: res.data.msg,
            showCancel: false,
            success (res) {
              if (res.confirm) {
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
            showCancel: false,
            success (res) {
              if (res.confirm) {
                
              }
            }
          })
        }
      },
      fail: function(res) {

      }
    })
  },

  /**
   * 授权地理位置
   */
  getUserLocation: function () {
    console.log('start get')
    let vm = this;
    //判断是否授权地理位置
    wx.getSetting({
      success: (res) => {
        console.log('getsetting')
        console.log(JSON.stringify(res))
        // res.authSetting['scope.userLocation'] == undefined    表示 初始化进入该页面
        // res.authSetting['scope.userLocation'] == false    表示 非初始化进入该页面,且未授权
        // res.authSetting['scope.userLocation'] == true    表示 地理位置授权
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true) {
          console.log(1)
          wx.showModal({
            title: '请求授权当前位置',
            content: '需要获取您的地理位置，请确认授权',
            success: function (res) {
              if (res.cancel) {
                wx.showToast({
                  title: '拒绝授权',
                  icon: 'none',
                  duration: 1000
                })
              } else if (res.confirm) {
                wx.openSetting({
                  success: function (dataAu) {
                    if (dataAu.authSetting["scope.userLocation"] == true) {
                      wx.showToast({
                        title: '授权成功',
                        icon: 'success',
                        duration: 1000
                      })
                      //再次授权，调用wx.getLocation的API
                      vm.getLocation();
                    } else {
                      wx.showToast({
                        title: '授权失败',
                        icon: 'none',
                        duration: 1000
                      })
                    }
                  }
                })
              }
            }
          })
        } else if (res.authSetting['scope.userLocation'] == undefined) {
          //调用wx.getLocation的API
          vm.getLocation();
        } else {
          //调用wx.getLocation的API
          vm.getLocation();
        }
      }
    })
  },

  /**
   * 获取经纬度
   */
  getLocation: function () {
    let vm = this;
    wx.getLocation({
      type: 'wgs84',
      success: function (res) {
        // console.log('getlocation')
        console.log(JSON.stringify(res))
        var latitude = res.latitude
        var longitude = res.longitude
        var speed = res.speed
        var accuracy = res.accuracy;
        vm.getLocal(latitude, longitude)
      },
      fail: function (res) {
        console.log('fail' + JSON.stringify(res))
      }
    })
  },

  /**
   * 获取当前地理位置
   */
  getLocal: function (latitude, longitude) {
    // console.log('getlocal')
    let vm = this;
    qqmapsdk.reverseGeocoder({
      location: {
        latitude: latitude,
        longitude: longitude
      },
      success: function (res) {
        // console.log(JSON.stringify(res));
        let province = res.result.address_component.province
        let city = res.result.address_component.city
        let district = res.result.address_component.district
        let street = res.result.address_component.street
        vm.setData({
          region: [province, city, district],
          province: province,
          city: city,
          district: district,
          street: street,
          latitude: latitude,
          longitude: longitude
        })
        console.log('22546546', res.result);
      },
      fail: function (res) {
        console.log(res);
      },
      complete: function (res) {
        // console.log(res);
      }
    });
  },

  hotelList:util.throttle(function (e) {
    let that = this
    console.log('endTime---' + app.globalData1.endTime)
    //如果只选择了一个日期
    if (app.globalData1.endTime == '请选择') {
      wx.showToast({
        title: '请选择离店日期',
        icon: 'none',
        duration: 2000
      })
    } else { //选择了两个日期
      if(this.data.companyId != '' && this.data.companyId != undefined && this.data.companyId != null){
        var obj = JSON.stringify([this.data.region[0], this.data.region[1], this.data.region[2], this.data.latitude, this.data.longitude,this.data.companyId]);
        wx.navigateTo({
          url: '/pages/hotelList/hotelList?obj=' + obj,
        })
      } else {
        
      }
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