// pages/riliTwo/riliTwo.js
let app = getApp()
var util = require('../../utils/util.js')
var Moment = require("../../utils/moment.js");
var DATE_LIST = [];
var DATE_YEAR = new Date().getFullYear();
var DATE_MONTH = new Date().getMonth() + 1;
var DATE_DAY = new Date().getDate();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '日历', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    maxMonth: 3, //最多渲染月数  
    endYears: '',
    endMonths: '',
    endDays: '',
    dateCount: '',
    dateList: [],
    systemInfo: {},
    weekStr: ['日', '一', '二', '三', '四', '五', '六'],
    checkInDate: Moment(new Date()).format('YYYY-MM-DD'),//离店时间就是订单的endTime
    checkOutDate: Moment(new Date()).add(1, 'day').format('YYYY-MM-DD'),
    markcheckInDate: true, //标记开始时间是否已经选择
    markcheckOutDate: false,   //标记结束时间是否已经选择
    sFtv: [//节日
      {
        month: 1,
        day: 1,
        name: "元旦"
      },
      {
        month: 2,
        day: 14,
        name: "情人节"
      },
      {
        month: 3,
        day: 8,
        name: "妇女节"
      },
      {
        month: 3,
        day: 12,
        name: "植树节"
      },
      {
        month: 3,
        day: 15,
        name: "消费者权益日"
      },
      {
        month: 4,
        day: 1,
        name: "愚人节"
      },
      {
        month: 5,
        day: 1,
        name: "劳动节"
      },
      {
        month: 5,
        day: 4,
        name: "青年节"
      },
      {
        month: 5,
        day: 12,
        name: "护士节"
      },
      {
        month: 6,
        day: 1,
        name: "儿童节"
      },
      {
        month: 7,
        day: 1,
        name: "建党节"
      },
      {
        month: 8,
        day: 1,
        name: "建军节"
      },
      {
        month: 9,
        day: 10,
        name: "教师节"
      },
      {
        month: 9,
        day: 28,
        name: "孔子诞辰"
      },
      {
        month: 10,
        day: 1,
        name: "国庆节"
      },
      {
        month: 10,
        day: 6,
        name: "老人节"
      },

      {
        month: 12,
        day: 24,
        name: "平安夜"
      },
      {
        month: 12,
        day: 25,
        name: "圣诞节"
      }
    ]

  },
  onLoad: function (options) {
    var _this = this;
    // 页面初始化 options为页面跳转所带来的参数
    _this.setData({
      checkInDate: options.checkInDate,
      checkOutDate: options.checkOutDate,
      endYears: options.endYears,
      endMonths: options.endMonths,
      endDays: options.endDays
    })


    // 页面初始化 options为页面跳转所带来的参数

    var checkInDate = options.checkInDate ? options.checkInDate : Moment(_this.data.checkInDate).format('YYYY-MM-DD');
    var checkOutDate = options.checkOutDate ? options.checkOutDate : Moment(_this.data.checkOutDate).add(1, 'day').format('YYYY-MM-DD');
    wx.getSystemInfo({
      success: function (res) {
        _this.setData({
          systemInfo: res,
          checkInDate: checkInDate,
          checkOutDate: checkOutDate
        });
      }
    })
    _this.createDateListData();
  },
  onReady: function () {
    // 页面渲染完成
  },
  onShow: function () {
    this.selectDataMarkLine()
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  },

  //选择的入住与离店时间段
  selectDataMarkLine: function () {
    let dateList = this.data.dateList;

    let { checkInDate, checkOutDate } = wx.getStorageSync("ROOM_SOURCE_DATE");
    let curreInid = checkInDate.substr(0, 4) + "-" + (checkInDate.substr(5, 2) < 10 ? checkInDate.substr(6, 1) : checkInDate.substr(5, 2));//选择入住的id
    let curreOutid = checkOutDate.substr(0, 4) + "-" + (checkOutDate.substr(5, 2) < 10 ? checkOutDate.substr(6, 1) : checkOutDate.substr(5, 2));//选择离店的id
    let dayIn = checkInDate.substr(8, 2) >= 10 ? checkInDate.substr(8, 2) : checkInDate.substr(9, 1);//选择入住的天id
    let dayOut = checkOutDate.substr(8, 2) >= 10 ? checkOutDate.substr(8, 2) : checkOutDate.substr(9, 1);//选择离店的天id
    let monthIn = checkInDate.substr(5, 2) >= 10 ? checkInDate.substr(5, 2) : checkInDate.substr(6, 1);//选择入店的月id
    let monthOut = checkOutDate.substr(5, 2) >= 10 ? checkOutDate.substr(5, 2) : checkOutDate.substr(6, 1);//选择离店的月id

    if (curreInid == curreOutid) {//入住与离店是当月的情况
      for (let i = 0; i < dateList.length; i++) {
        if (dateList[i].id == curreInid) {
          let days = dateList[i].days;

          for (let k = 0; k < days.length; k++) {
            if (days[k].day >= dayIn && days[k].day <= dayOut) {
              days[k].class = days[k].class + ' bgitem';
            }
            if (days[k].day == dayIn) {
              days[k].class = days[k].class + ' active';
              days[k].inday = true;
            }
            if (days[k].day == dayOut) {
              days[k].class = days[k].class + ' active';
              days[k].outday = true;
            }
          }
        }
      }
    } else {//跨月
      for (let j = 0; j < dateList.length; j++) {
        if (dateList[j].month == monthIn) {//入住的开始月份
          let days = dateList[j].days;
          for (let k = 0; k < days.length; k++) {
            if (days[k].day >= dayIn) {
              days[k].class = days[k].class + ' bgitem';
            }
            if (days[k].day == dayIn) {
              days[k].class = days[k].class + ' active';
              days[k].inday = true;
            }
          }
        } else {//入住跨月月份
          if (dateList[j].month < monthOut && dateList[j].month > monthIn) {//离店中间的月份
            let days = dateList[j].days;
            for (let k = 0; k < days.length; k++) {
              days[k].class = days[k].class + ' bgitem';
            }
          } else if (dateList[j].month == monthOut) {//离店最后的月份
            let days = dateList[j].days;
            for (let k = 0; k < days.length; k++) {
              if (days[k].day <= dayOut) {
                days[k].class = days[k].class + ' bgitem';
              }
              if (days[k].day == dayOut) {
                days[k].class = days[k].class + ' active';
                days[k].outday = true;
              }
            }
          }
        }
      }
    }
    this.setData({
      dateList: dateList
    })
  },

  createDateListData: function () {
    let that = this;
    var endDays = that.data.endDays;
    var endYears = that.data.endYears;
    var endMonths = that.data.endMonths;
    var dateList = [];
    var now = new Date();

    /*
      设置日期为 年-月-01,否则可能会出现跨月的问题
      比如：2017-01-31为now ,月份直接+1（now.setMonth(now.getMonth()+1)），则会直接跳到跳到2017-03-03月份.
        原因是由于2月份没有31号，顺推下去变成了了03-03
    */
    now = new Date(now.getFullYear(), now.getMonth(), 1);


    for (var i = 0; i < that.data.maxMonth; i++) {
      var momentDate = Moment(now).add(that.data.maxMonth - (that.data.maxMonth - i), 'month').date;
      var year = momentDate.getFullYear();
      var month = momentDate.getMonth() + 1;

      var days = [];
      var totalDay = that.getTotalDayByMonth(year, month);//总的天数

      var week = that.getWeek(year, month, 1);//每月第一天对应是周几

      //-week是为了使当月第一天的日期可以正确的显示到对应的周几位置上，比如星期三(week = 2)，
      //则当月的1号是从列的第三个位置开始渲染的，前面会占用-2，-1，0的位置,从1开正常渲染
      for (var j = -week + 1; j <= totalDay; j++) {
        var tempWeek = -1;
        if (j > 0)
          tempWeek = that.getWeek(year, month, j);
        var clazz = '';
        if (tempWeek == 0 || tempWeek == 6)
          clazz = 'week'

        if (j < endDays && year == endYears && month == endMonths) {
          //当天之前的日期不可用
          clazz = 'unavailable ' + clazz;


        } else {
          clazz = '' + clazz
        }
        days.push({ day: j, class: clazz })
      }
      var dateItem = {
        id: year + '-' + month,
        year: year,
        month: month,
        days: days
      }

      dateList.push(dateItem);
    }
    var sFtv = that.data.sFtv;
    for (let i = 0; i < dateList.length; i++) {//加入公历节日
      for (let k = 0; k < sFtv.length; k++) {
        if (dateList[i].month == sFtv[k].month) {
          let days = dateList[i].days;
          for (let j = 0; j < days.length; j++) {
            if (days[j].day == sFtv[k].day) {
              days[j].daytext = sFtv[k].name
            }
          }
        }
      }
    }
    this.setData({
      dateList: dateList
    });
    DATE_LIST = dateList;
  },

  /*
	 * 获取月的总天数
	 */
  getTotalDayByMonth: function (year, month) {
    month = parseInt(month, 10);
    var d = new Date(year, month, 0);
    return d.getDate();
  },
	/*
	 * 获取月的第一天是星期几
	 */
  getWeek: function (year, month, day) {
    var d = new Date(year, month - 1, day);
    return d.getDay();
  },
  /**
   * 点击日期事件
   */
  onPressDate: function (e) {
    var dateCount = this.data.dateCount;
    var endDays = this.data.endDays;
    var endYears = this.data.endYears;
    var endMonths = this.data.endMonths;
    var { year, month, day } = e.currentTarget.dataset;
    //当前选择的日期为同一个月并小于今天，或者点击了空白处（即day<0），不执行
    if ((day < endDays && month == endMonths) || day <= 0) return;

    var tempMonth = month;
    var tempDay = day;

    if (month < 10) tempMonth = '0' + month
    if (day < 10) tempDay = '0' + day

    var date = year + '-' + tempMonth + '-' + tempDay;

    //如果点击选择的日期A小于入住时间，则重新渲染入住时间为A
    if ((this.data.markcheckInDate && Moment(date).before(this.data.checkInDate) || this.data.checkInDate === date)) {
      this.setData({
        markcheckInDate: false,
        markcheckOutDate: false,
        dateList: DATE_LIST.concat()
      });
    };

    if (!this.data.markcheckInDate) {
      this.setData({
        checkInDate: date,
        markcheckInDate: true,
        dateList: DATE_LIST.concat()
      });

    } else if (!this.data.markcheckOutDate) {

      this.setData({
        dateCount: dateCount,
        checkOutDate: date,
        markcheckOutDate: true,
      });

      //设缓存，返回页面时，可在onShow时获取缓存起来的日期
      wx.setStorage({
        key: 'ROOM_SOURCE_DATE',
        data: {
          checkInDate: this.data.checkInDate,
          checkOutDate: this.data.checkOutDate,
          // dateCount : this.data.dateCount
        }
      });
      wx.navigateBack({
        delta: 1, // 回退前 delta(默认为1) 页面
      });
    }

    this.renderPressStyle(year, month, day);
  },
  renderPressStyle: function (year, month, day) {
    this.createDateListData();//重新点击时数据初始化
    var dateList = this.data.dateList;
    //渲染点击样式
    for (var i = 0; i < dateList.length; i++) {
      var dateItem = dateList[i];
      var id = dateItem.id;
      if (id === year + '-' + month) {
        var days = dateItem.days;
        for (var j = 0; j < days.length; j++) {
          var tempDay = days[j].day;
          if (tempDay == day) {
            days[j].class = days[j].class + ' active';
            days[j].inday = true;
            break;
          }
        }
        break;
      }
    }
    this.setData({
      dateList: dateList
    });
  }
})