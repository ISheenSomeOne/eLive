// pages/orders/orders.js
// import WxValidate from '../../utils/WxValidate.js'
var util = require('../../utils/util.js')
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '酒店名称', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    date: '', //当前日期
    chooseCoupon: false,
    seeStatus: false,
    couponList: '', //man jian name

    roomTypeId: '',
    roomMin: 1,
    hotelName: '',
    name: '',
    roomCount: '',
    bed: '',
    area: '',
    deposit: '',
    totalPrice: '',
    showValue: 1, //房间选择的数量
    contacts: '', //联系人
    tel: '', //手机号
    idcard: '', //身份证号
    receipt: '', //发票
    info: '', //备注
    hotelId: '',
    endTime: '',
    startTime: '',
    dateCount: '',
    manPrice: '', //判断优惠券可用的价格
    showRoomNumBox: false, //显示数量选择
    nameShow: '',
    telShow: '',
    idCardShow: '',
    hasBeenCompleted: false
  },
  done: function() {
    this.setData({
      chooseCoupon: false
    })
  },
  chooseCoupon: function() {
    this.setData({
      chooseCoupon: true
    })
  },
  seeStatus: function() {
    this.setData({
      seeStatus: !this.data.seeStatus
    })
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

    var that = this;
    var DATE = util.formatDate(new Date());
    let title = 'nvabarData.title'
    if(options.companyId != '' && options.companyId != null && options.companyId != 'undefined'){
      that.setData({
        companyId: options.companyId
      })
    } else {
      that.setData({
        companyId: ''
      })
    }

    //如果openid为空
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({
        url: '/pages/authorizationPage/authorizationPage',
      })
    } else {
      that.getInit()
    }
    that.setData({
      date: DATE,
      roomTypeId: app.globalData2.roomTypeId,
      hotelId: app.globalData1.hotelId,
      hotelName: app.globalData1.hotelName,
      name: app.globalData2.roomName,
      roomCount: app.globalData2.roomCount,
      // roomCount: 7,
      bed: app.globalData2.bed,
      area: app.globalData2.area,
      price: app.globalData2.price,
      deposit: app.globalData2.deposit,
      minNegotiatedPrice: app.globalData2.minNegotiatedPrice,
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      dateCount: app.globalData1.dateCount,
      [title]: app.globalData1.hotelName
    })
    that.getTotalPrice();
  },
  //请求页面初始化数据
  getInit: function() {
    console.log('------获取实名信息start')
    let that = this
    wx.request({
      url: app.globalData.rootApi + '/zxkj/member/wxWhetherTheRealName',
      data: {
        openid: wx.getStorageSync('openid')
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        console.log('获取实名信息---', res.data)
        if (res.data.code == 0) {
          let nameShow = that.formatName(res.data.name)
          let telShow = that.plusXing(res.data.tel,3,4)
          let idCardShow = that.plusXing(res.data.num,3,2)
          that.setData({
            hasBeenCompleted: true,
            nameShow: nameShow,
            telShow: telShow,
            idCardShow: idCardShow,
            contacts: res.data.name,
            tel: res.data.tel,
            idcard: res.data.num
          })
        }
      },
      fail: function(res) {
        console.log(res)
      }
    })
  },
  
  //显示输入框
  toInput: function(){
    let that = this
    that.setData({
      hasBeenCompleted: false
    })
  },

  //隐藏姓名
  formatName: function (name) {
    var newStr;
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
  },

  //隐藏
  plusXing: function (str, frontLen, endLen) {
    var len = str.length - frontLen - endLen;
    var xing = '';
    for (var i = 0; i < len; i++) {
      xing += '*';
    }
    return str.substring(0, frontLen) + xing + str.substring(str.length - endLen);
  },

  /**
   * 点击查看该会员的优惠券
   */
  conpons: util.throttle(function(e) {
    let that = this;
    wx.request({
      url: app.globalData.rootApi + '/zxkj/coupon/wxLookMemberUsableCoupon',
      data: {
        hotelId: app.globalData1.hotelId
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      success: function(res) {
        console.log("couponList的结果", res.data)
        if (res.data == null || res.data == '') {
          wx.showModal({
            title: '提示',
            content: '暂无优惠券',
          })
          that.setData({
            chooseCoupon: false
          })
        } else {
          that.setData({
            couponList: res.data,
            chooseCoupon: true
          })
        }
      },
      fail: function(res) {
        wx.showModal({
          title: '提示',
          content: '网络错误',

        })
      }
    })


  }, 3000),
  chooseNum: function(e) {
    let that = this
    let index = e.currentTarget.dataset.index
    // app.globalData2.deposit = that.data.deposit * (index + 1)
    console.log(index)
    that.setData({
      showValue: index + 1,
      deposit: app.globalData2.deposit * (index + 1),
      manPrice: app.globalData3.manPrice * (index + 1)
    })
  },
  openRoomNumBox: function() {
    this.setData({
      showRoomNumBox: true
    })
  },
  closeRoomNumBox: function() {
    this.setData({
      showRoomNumBox: false
    })
  },

  /**
   * 确定按钮,提交数据至orderTwo页面
   */
  submit: util.throttle(function(e) {
    var that = this
    var contacts = that.data.contacts;
    var tel = that.data.tel;
    var idcard = that.data.idcard;
    app.globalData3.tel = that.data.tel
    app.globalData3.contacts = that.data.contacts
    app.globalData3.idcard = that.data.idcard

    var showValue = that.data.showValue;
    app.globalData3.showValue = that.data.showValue;
    var info = that.data.info;
    app.globalData3.info = that.data.info;

    var myreg = /^(((13[0-9]{1})|(14[0-9]{1})|(15[0-9]{1})|(16[0-9]{1})|(18[0-9]{1})|(19[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (that.data.contacts == '') {
      wx.showToast({
        title: '姓名不能为空',
        icon: 'none',
        duration: 1500,
      })
    } else if (that.data.tel.length == 0) {
      wx.showToast({
        title: '手机号不能为空',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.tel.length < 11) {
      wx.showToast({
        title: '手机号长度有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (!myreg.test(that.data.tel)) {
      wx.showToast({
        title: '手机号有误！',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else if (that.data.idcard.length == 0) {
      wx.showToast({
        title: '身份证号码不能为空',
        duration: 1500,
        icon: 'none'
      });
    } else if (that.data.idcard.length < 6) {
      wx.showToast({
        title: '请输入身份证后6位',
        duration: 1500,
        icon: 'none'
      });
    }
    // else if (!(/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/.test(that.data.idcard))) {
    //   wx.showToast({
    //     title: '身份证号码有误',
    //     duration: 1500,
    //     icon: 'none'
    //   });
    // } 
    else if (this.data.showValue == 0) {
      wx.showToast({
        title: '房间数量不为空!',
        icon: 'none',
        duration: 1500
      })
      return false;
    } else {
      var showValue = that.data.showValue;
      var contacts = that.data.contacts;
      var tel = that.data.tel;
      var receipt = that.data.receipt;
      var info = that.data.info;
      var totalPrice = that.data.totalPrice;
      var hotelId = that.data.hotelId;
      var roomTypeId = that.data.roomTypeId;

      if (!wx.getStorageSync('openid')) {
        wx.login({
          success: function(loginRes) {
            if (loginRes) {
              //获取用户信息
              wx.getUserInfo({
                withCredentials: true, //非必填  默认为true
                success: function(infoRes) {
                  console.log(infoRes, '>>>');
                  //请求服务端的登录接口
                  wx.request({
                    url: app.globalData.rootApi + '/zxkj/order/wxDecodeUserInfo',
                    data: {
                      hotelId: app.globalData1.hotelId,
                      code: loginRes.code, //临时登录凭证
                      encrypteData: infoRes.encryptedData, //用户敏感信息
                      iv: infoRes.iv, //解密算法的向量
                      rawData: infoRes.rawData
                    },
                    method: 'post',
                    header: {
                      'content-type': 'application/x-www-form-urlencoded'
                    },
                    success: function(res) {
                      console.log(res);
                      if (res.statusCode == 200) {
                        console.log("第一次:", res.data);
                        wx.setStorageSync('openid', res.data.openid)
                        app.globalData.openid = res.data.openid;
                        app.globalData.session_key = res.data.session_key;
                        app.globalData1.newPeople = res.data.newPeople;
                        app.globalData.userInfo = res.userInfo;
                        wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
                        wx.setStorageSync('session_key', res.data[2]);
                        that.subRequest()
                      } else {
                        // that.showInfo('res.errmsg');
                      }
                    },
                    fail: function(error) {
                      //调用服务端登录接口失败
                      // that.showInfo('调用接口失败');
                      console.log(error);
                    }
                  });

                }
              });
            } else {
              //用户点击了拒绝按钮
              wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!!!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                  // 用户没有授权成功，不需要改变 isHide 的值
                  if (res.confirm) {
                    console.log('用户点击了“返回授权”');
                    wx.redirectTo({
                      url: '/pages/authorizationPage/authorizationPage',
                    })
                  }
                }
              })
            }
          }
        })

      } else {
        that.subRequest()
      }

    }

  }, 2000),
  //提交实名请求
  subRequest: function() {
    let that = this
    wx.request({
      url: app.globalData.rootApi + '/zxkj/member/wxMemberRealNameAuthentication',
      data: {
        openid: wx.getStorageSync('openid'),
        name: that.data.contacts,
        tel: that.data.tel,
        num: that.data.idcard,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function(res) {
        console.log('实名认证成功返回---')
        console.log(res.data)

        if (res.data.code == -3) {
          wx.showToast({
            title: '信息填写不完全',
            duration: 2000,
            icon: "none"
          })
        } else if (res.data.code == -2) {
          wx.setStorageSync('openid', '')
          wx.showToast({
            title: '请再点击一次',
            duration: 2000,
            icon: "none"
          })
        } else if (res.data.code == -1) {
          wx.showToast({
            title: '服务器错误',
            duration: 2000,
            icon: "none"
          })
        } else {
          wx.navigateTo({
            url: '/pages/orderTwo/orderTwo?showValue=' + that.data.showValue + '&contacts=' + that.data.contacts + '&tel=' + that.data.tel + '&info=' + that.data.info + '&companyId=' + that.data.companyId
          })
        }
      },
      fail: function(res) {
        console.log('失败---' + res)
      }
    })
  },

  /**
   * 点击优惠券,判断该优惠券是否符合使用条件
   */
  judge: util.throttle(function(e) {
    //获取优惠券ID
    var that = this;
    var i = e.currentTarget.id;
    var couponId = that.data.couponList[i].id;
    app.globalData3.couponId = that.data.couponList[i].id;
    app.globalData3.man = that.data.couponList[i].man;
    var jian = that.data.couponList[i].jian
    app.globalData3.jian = that.data.couponList[i].jian;
    console.log('优惠券ID', that.data.couponList[i].id)

    var deposit = parseInt(app.globalData2.deposit);
    //先获取到用户点击优惠券的ID,然后获取到满减的值
    var totalPrice = null;
    var manPrice = that.data.manPrice
    var jian = app.globalData3.jian
    var man = app.globalData3.man

    if (man <= manPrice) {
      //设置符合优惠条件的总价
      var manPrice = (manPrice - jian);
      that.setData({
        manPrice: manPrice,
        jian: jian
      })
      app.globalData3.jian = that.data.jian;
      app.globalData3.manPrice = that.data.manPrice;

    } else {
      this.getTotalPrice()
      wx.showModal({
        title: '警告',
        content: '未满足优惠券的使用条件',
      })
    }
  }, 3000),

  /**
   * 获取滑块的值
   */
  sliderchange: function(e) {
    var showValue = e.detail.value;
    this.setData({
      showValue: e.detail.value
    })
    this.getTotalPrice()
  },

  /**
   * 计算总价的方法
   */
  getTotalPrice() {
    //房间数量 * 房间价格 * 住的天数 -优惠券价格 + 押金 deposit
    var showValue = this.data.showValue;
    var price = parseFloat(this.data.price);
    var minNegotiatedPrice =  parseFloat(this.data.minNegotiatedPrice);
    var deposit = parseInt(this.data.deposit);
    var dateCount = parseInt(this.data.dateCount)

    if(this.data.companyId != ''){
      var manPrice = showValue * minNegotiatedPrice * dateCount;
    } else {
      var manPrice = showValue * price * dateCount;
    }
    // var totalPrice = showValue * price * dateCount + deposit;

    this.setData({
      manPrice: manPrice
    })
    app.globalData3.manPrice = this.data.manPrice;
  },

  /**
   * 获取联系人
   */
  contacts: function(e) {
    var contacts = e.detail.value
    this.setData({
      contacts: e.detail.value
    })
  },

  /**
   * 获取手机号码
   */
  tel: function(e) {
    var tel = e.detail.value
    this.setData({
      tel: e.detail.value
    })
    // console.log('手机号码', e.detail.value)
  },

  /**
   * 获取身份证号码
   */
  idcard: function(e) {
    var idcard = e.detail.value
    this.setData({
      idcard: e.detail.value
    })
    // console.log('身份证', e.detail.value)
  },

  /**
   * 获取发票
   */
  receipt: function(e) {
    var receipt = e.detail.value
    this.setData({
      receipt: e.detail.value
    })
  },

  /**
   * 获取备注信息
   */
  info: function(e) {
    var info = e.detail.value
    this.setData({
      info: e.detail.value
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
  onShow: function() {},

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
  //报错 
  showModal(error) {
    wx.showModal({
      content: error.msg,
      showCancel: false,
    })
  },
})