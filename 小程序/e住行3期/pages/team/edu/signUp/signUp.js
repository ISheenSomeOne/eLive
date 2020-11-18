// pages/team/edu/signUp/signUp.js
var util = require('../../../../utils/util.js')
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    needCar: true, //是否需要车辆
    needHotel: true, //是否需要酒店住宿
    examSiteList: ['点击选择考点'], //选择考点的list
    examSiteIndex: 0, //选择的考点的下标
    startingList: ['点击选择出发点'], //出发点列表
    startingIndex: 0, //选择的出发点下标配
    liveWay: 1, //入住方式下标
    examId: '', //考试id
    nameShow: '',
    telShow: '',
    idCardShow: '',
    contacts: '',
    tel: '',
    idcard: '',
    hasBeenCompleted: false,
    examInfo: '',
    invitationCode: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let examId = ''
    if (decodeURIComponent(options.q).split('=')[1]) {
      examId = decodeURIComponent(options.q).split('=')[1]
    } else if (options.examId) {
      examId = options.examId
    } else {
      wx.showToast({
        title: '数据获取异常，请联系客服',
        icon: 'none',
        duration: 2000
      })
    }
    that.setData({
      examId: examId,
      // examId: 40
    })
    // this.checkUserInfo()
  },

  onShow: function (e) {
    this.checkUserInfo()
  },

  checkUserInfo: function () {
    if (!wx.getStorageSync('openid')) {
      wx.navigateTo({ //跳转到授权页面
        url: '/pages/authorizationPage/authorizationPage?navigateBack=true', //授权页面
      })
    } else {
      this.getInit()
    }
  },

  // 页面初始化数据
  getInit: function () {
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/exam/signUpPage',
      data: {
        openId: wx.getStorageSync('openid'),
        examId: that.data.examId,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 200) {
          let data = res.data.data
          let examSiteList = ['点击选择考点']
          let startingList = ['点击选择出发点']
          
          data.examSiteList = JSON.parse(data.examSiteList)
          data.startingList = JSON.parse(data.startingList)
          data.examStartDate = util.formatDate(new Date(data.examStartDate))
          data.examEndDate = util.formatDate(new Date(data.examEndDate))
          data.deadline = util.formatDate(new Date(data.deadline))

          //统一支付的仅酒店服务——什么也不做
          if(data.payWay != 2 && data.serviceType == 2){
          } else {
            data.examSiteList.forEach((item) => {
              examSiteList.push(item.name)
            })
            data.startingList.forEach((item) => {
              startingList.push(item.name)
            })
          }

          that.setData({
            examInfo: data,
            examSiteList: examSiteList,
            startingList: startingList
          })
          that.getUserInfo()
        } else if(res.data.code == -1){
            wx.navigateTo({
              url: '/pages/errorPage/errorPage?errorCont='+ res.data.msg,
            })
        } else if (res.data.code == 202) {
          //已支付，跳转到订单
          wx.navigateTo({
            url: '/pages/team/edu/orderInfo/orderInfo?examId=' + that.data.examId
          })
        } else {
          wx.showToast({
            title: '服务器错误',
            icon: 'none',
            duration: 2000
          })
        }
        wx.hideLoading()
      },
      fail: function (res) {
        wx.hideLoading()
      }
    })
  },

  //请求用户数据
  getUserInfo: function () {
    console.log('------获取实名信息start')
    let that = this
    wx.showLoading({
      title: '加载中',
      mask: true
    })
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
      success: function (res) {
        console.log('获取实名信息---', res.data)
        if (res.data.code == 0) {
          let nameShow = that.formatName(res.data.name)
          let telShow = that.plusXing(res.data.tel, 3, 4)
          let idCardShow = that.plusXing(res.data.num, 3, 2)
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
        wx.hideLoading()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },

  //提交信息
  confirm: function () {
    let that = this
    if (that.verification()){
      wx.showLoading({
        title: '加载中',
        mask: true
      })
      //提交实名信息
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
          if (res.data.code == -3) {
            wx.hideLoading()
            wx.showToast({
              title: '信息填写不完全',
              duration: 2000,
              icon: "none"
            })
          } else if (res.data.code == -2) {
            wx.hideLoading()
            wx.setStorageSync('openid', '')
            wx.showToast({
              title: '请再点击一次',
              duration: 2000,
              icon: "none"
            })
          } else if (res.data.code == -1) {
            wx.hideLoading()
            wx.showToast({
              title: '服务器错误',
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.hideLoading()
            
            //提交报名信息
            that.subSignInfo()
          }
        },
        fail: function(res) {
          console.log('失败---' + res)
        }
      })
    }
  },

  //提交报名信息
  subSignInfo:function(){
    let that = this
    let examSiteIndex = that.data.examSiteIndex
    let startingIndex = that.data.startingIndex
    if(that.data.examSiteIndex == '' || that.data.startingIndex == ''){

    } else {
      examSiteIndex = examSiteIndex-1
      startingIndex = startingIndex-1
    }

    wx.showLoading({
      title: '正在提交',
      mask: true
    })
    wx.request({
      url: app.globalData.rootApi + '/zxkj/examOrder/subStudentInfo',
      data: {
        openId: wx.getStorageSync('openid'),
        examId: that.data.examId,
        examSite: examSiteIndex,
        departurePoint: startingIndex,
        needCar: that.data.needCar,
        liveMode: that.data.liveWay,
        invitationCode: that.data.invitationCode,
        needHotel: that.data.needHotel
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      method: 'POST',
      dataType: 'json',
      Type: 'json',
      success: function (res) {
        wx.hideLoading()
        console.log('---', res.data)
        if (res.data.code == 200) {
          that.setData({
            examOrderId: res.data.data
          })
          //判断考试订单付款方式
          if(that.data.examInfo.payWay == 2){
            //跳转到支付页
            wx.navigateTo({
              url: '/pages/team/edu/pay/pay?examOrderId=' + that.data.examOrderId + '&examId=' + that.data.examId
            })
          } else {
          //跳转到订单页
          wx.navigateTo({
            url: '/pages/team/edu/orderInfo/orderInfo?examId=' + that.data.examId
          })
          }
        } else {
          wx.showToast({
            title: '服务器错误',
            duration: 2000,
            icon: "none"
          })
        }
      },
      fail: function (res) {
        wx.hideLoading()
        console.log(res)
      }
    })
  },

  //提交验证
  verification: function () {
    let that = this
    var myreg = /^[1][3,4,5,6,7,8,9][0-9]{9}$/;
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    let now = new Date()
    let deadline = new Date(that.data.examInfo.deadline)
    console.log(123)
    //仅住宿
    if (that.data.examInfo.serviceType == 2) {
      that.setData({
        needCar: false,
        examSiteIndex: '',
        startingIndex: '',
      })
    }
    //仅用车
    if (that.data.examInfo.serviceType == 3) {
      that.setData({
        needHotel: false
      })
    }
    //需要车辆的情况，考点，出发点未选择
    if (deadline.getTime > now.getTime) {
      wx.showToast({
        title: '超过报名时间',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.needCar && that.data.examSiteIndex == 0) {
      wx.showToast({
        title: '请选择考点',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.needCar && that.data.startingIndex == 0) {
      wx.showToast({
        title: '请选择出发点',
        icon: 'none',
        duration: 2000
      })
    } else if (that.data.contacts == '') {
      //个人信息填写不完善
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
    } else if (reg.test(that.data.idcard) === false) {
      wx.showToast({
        title: '身份证格式有误',
        duration: 1500,
        icon: 'none'
      });
    } else if(that.data.liveWay == 3 && that.data.invitationCode.length != 6){
      wx.showToast({
        title: '邀请码格式有误',
        duration: 1500,
        icon: 'none'
      });
    } else {
      return true
    }
    return false
  },

  /**
   * 获取联系人
   */
  contacts: function (e) {
    this.setData({
      contacts: e.detail.value
    })
  },

    /**
   * 获取邀请码
   */
  invitationCode:function(e){
    this.setData({
      invitationCode: e.detail.value
    })
  },

  /**
   * 获取手机号码
   */
  tel: function (e) {
    this.setData({
      tel: e.detail.value
    })
    // console.log('手机号码', e.detail.value)
  },

  /**
   * 获取身份证号码
   */
  idcard: function (e) {
    this.setData({
      idcard: e.detail.value
    })
    // console.log('身份证', e.detail.value)
  },

  //显示输入框
  toInput: function () {
    let that = this
    that.setData({
      hasBeenCompleted: false
    })
  },

  //需要接送
  needCarChange: function () {
    let that = this
    that.setData({
      needCar: !that.data.needCar
    })
  },

  //需要接送
  needHotelChange: function () {
    let that = this
    that.setData({
      needHotel: !that.data.needHotel
    })
  },

  //考点选择
  examSiteChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      examSiteIndex: e.detail.value
    })
  },
  //出发点选择
  startingChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      startingIndex: e.detail.value
    })
  },
  //入住方式改变
  liveWayChange: function (e) {
    this.setData({
      liveWay: e.detail.value
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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