// common/chooseDate/chooseDate.js
var bianLIyear;

var bianLImonth;

var bianLIday;

var riLi = []

var shangY = []

var xiaY = []

var xianxuNZ = [];

var xuanZheData = [];

var windowHeight;

var app = getApp();

Component({
  /**
   * 组件的属性列表
   */
  properties: {

  },

  /**
   * 组件的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 0, //是否显示左上角图标   1表示显示    0表示不显示
      title: 'e住行', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,  
    date: ['日', '一', '二', '三', '四', '五', '六'],

    year: null, //遍历的年

    month: null, //遍历的月

    day: null,

    xianShi: null, //今天的年月

    xianDay: null, //今天的日期

    xianShiZongData: [], //今后3个月遍历的日期

    jiaShu: 0,

    animationData: '',
    today: '',//今天日期
    tomorrow: '',//明天日期
    startTime: '',//入住时间
    endTime: '', //离店时间
    dateCount: "1", //共几晚
  },
  ready: function() {
    this.yunXian();

    wx.getSystemInfo({

      success: function(res) {

        windowHeight = res.windowHeight

      }

    })
    var timestamp = Date.parse(new Date());
    var date1 = new Date(timestamp);
    var date = new Date(date1.getTime() - 7 * 60 * 60 * 1000);
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
    //获取当日日期 
    var tD = tomorrow.getDate() < 10 ? '0' + tomorrow.getDate() : tomorrow.getDate();
    
    console.log('----------'+Y + '-' + M + '-' + D+'=='+app.globalData1.startTime)

    // const checkInYearAndMonth = `xuanZheData[0].xuanShiJian`
    // const checkInDay = `xuanZheData[0].xuanDayShi`
    // const checkOutYearAndMonth = `xuanZheData[1].xuanShiJian`
    // const checkOutDay = `xuanZheData[1].xuanDayShi`
    const chaDay = `xuanZheData[1].chaDay`
    // app.globalData1.startTime = Y + '-' + M + '-' + D
    this.setData({
      //初始化入住时间
      today: Y + '-' + M + '-' + D,
      tomorrow: tY + '-' + tM + '-' + tD,
      startTime: app.globalData1.startTime,
      endTime: app.globalData1.endTime,
      dateCount: app.globalData1.dateCount
    })
    

    //将数据传到调用页面
    this.transfor();
  },

  /**
   * 组件的方法列表
   */
  methods: {
    yunXian: function() {
      let that =this

      var myDate =new Date(new Date().getTime() - 7 * 60 * 60 * 1000);//当前时间减7小时（在凌晨7点前可订前一天房间）

      var year = myDate.getFullYear()

      var month = myDate.getMonth() + 1

      var day = myDate.getDate()
      
      let hours = myDate.getHours()

      var jiaYue = month + 2; //要循环的月份

      var shangBu;

      var xiabu;

      if (jiaYue > 12) {

        shangBu = 12

        xiabu = jiaYue - 12

      } else {

        // console.log(jiaYue)

      }

      if (jiaYue > 12) {

        for (let l = year; l <= parseInt(year) + 1; l++) {

          if (jiaYue > 12) {

            if (l == year) {

              for (let ll = month; ll <= shangBu; ll++) {

                bianLIyear = l;

                bianLImonth = ll;

                bianLIday = day

                this.kaiSHiyun();

              }

            } else {

              for (let ll = 1; ll <= xiabu; ll++) {

                bianLIyear = l;

                bianLImonth = ll;

                bianLIday = day

                this.kaiSHiyun();

              }

            }

          }

        }

      } else {

        for (let l = year; l <= parseInt(year); l++) {

          for (let ll = month; ll <= jiaYue; ll++) {

            bianLIyear = l;

            bianLImonth = ll;

            bianLIday = day

            this.kaiSHiyun();

          }

        }

      }

      if (month.toString().length < 2) {

        month = '0' + month

      } else {

        month = month

      }

      this.setData({

        xianShiZongData: xianxuNZ,

        xianShi: year + '-' + month,

        xianDay: day,

      })

      // console.log(this.data.xianShiZongData)

    },
    //计算每个月的数据

    kaiSHiyun: function() {

      riLi = []

      shangY = []

      xiaY = []

      var dayNum = new Date(bianLIyear, bianLImonth, 0).getDate();

      var dayNumS = new Date(bianLIyear, parseInt(bianLImonth) - 1, 0).getDate();

      var dayNumX = new Date(bianLIyear, parseInt(bianLImonth) + 1, 0).getDate();

      var startWeek = new Date('' + bianLIyear + ',' + bianLImonth + ',1').getDay();

      for (var ij = startWeek - 1; ij >= 0; ij--) {

        shangY.push(parseInt(dayNumS) - parseInt(ij))

      }

      for (var ii = 1; ii <= dayNum; ii++) {

        var riqi = {};

        riqi.data = ii;

        riqi.Num = startWeek + (ii - 1) % 7

        riqi.getTime = new Date(bianLIyear + '/' + bianLImonth + '/' + ii).getTime();

        /*↓插入引用方法农历等详情↓*/

        // var xiangQing = util.chajie(bianLIyear, bianLImonth, ii)

        // riqi.lYear = xiangQing.lYear

        // riqi.lMonth = xiangQing.lMonth

        // riqi.lDay = xiangQing.lDay

        // riqi.Animal = xiangQing.Animal

        // riqi.IMonthCn = xiangQing.IMonthCn

        // riqi.IDayCn = xiangQing.IDayCn

        // riqi.cYear = xiangQing.cYear

        // riqi.cMonth = xiangQing.cMonth

        // riqi.cDay = xiangQing.cDay

        // riqi.gzYear = xiangQing.gzYear

        // riqi.gzMonth = xiangQing.gzMonth

        // riqi.gzDay = xiangQing.gzDay

        // riqi.isToday = xiangQing.isToday

        // riqi.isLeap = xiangQing.isLeap

        // riqi.nWeek = xiangQing.nWeek

        // riqi.ncWeek = xiangQing.ncWeek

        // riqi.isTerm = xiangQing.isTerm

        // riqi.Term = xiangQing.Term

        // riqi.astro = xiangQing.astro

        // riqi.festival = xiangQing.festival,

        //   riqi.isFestival = xiangQing.isFestival

        // riqi.Njieri = xiangQing.Njieri

        // riqi.isNjieri = xiangQing.isNjieri

        /*↑插入引用方法农历等详情↑*/

        riLi.push(riqi)

      }

      var shu = riLi.length + shangY.length;

      if (shu % 7 > 0) {

        for (var ijj = 1; ijj <= 7 - shu % 7; ijj++) {

          xiaY.push(ijj)

        }

      }

      var panXZhong = {};

      var jiaBianLiyue

      if (bianLImonth.toString().length < 2) {

        jiaBianLiyue = '0' + bianLImonth

      } else {

        jiaBianLiyue = bianLImonth

      }

      panXZhong.xian = bianLIyear + '-' + jiaBianLiyue

      panXZhong.xainData = riLi

      panXZhong.shangData = shangY

      panXZhong.xiaData = xiaY

      xianxuNZ.push(panXZhong)

    },

    //点击选择时间

    dianXuan: function(e) {
      // console.log(e)

      var shiJIan = e.currentTarget.dataset.shi + '-' + e.currentTarget.dataset.day

      var xuanriArr = shiJIan.split("-");

      var shiJIanHaoMiao = new Date(shiJIan.replace(new RegExp("-", "gm"), "/")).getTime()

      var chang = windowHeight;

      var that = this;

      var cunIndex = -1;

      var startTime = '';

      var animation = wx.createAnimation({

        transformOrigin: "50% 50%",

        duration: 1000,

        timingFunction: "ease",

        delay: 0

      })

      animation.translateY(chang).step()

      if (xuanriArr[1].length < 2) {

        var xuanYue = '0' + xuanriArr[1]

      } else {

        var xuanYue = xuanriArr[1]

      }

      if (xuanriArr[2].length < 2) {

        var xuanRi = '0' + xuanriArr[2]

      } else {

        var xuanRi = xuanriArr[2]

      }

      //第一次点击不走这里
      for (let d = 0; d < xuanZheData.length; d++) {

        if (shiJIanHaoMiao == xuanZheData[d].getTime) {
          cunIndex = d

        }

      }

      if (cunIndex != -1) {

        xuanZheData.splice(cunIndex, 1)

      } else {

        let day = e.currentTarget.dataset.day
        if (e.currentTarget.dataset.day < 10) {
          day = '0' + day
        }

        if (xuanZheData.length < 2) {  //没选或者只选择了一个日期的时候

          if (xuanZheData.length >= 1) {  //选择了一个日期的时候

            var firstZHI = xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi

            firstZHI = firstZHI.replace(new RegExp("-", "gm"), "/")

            var twoZHI = e.currentTarget.dataset.shi + '-' + day

            twoZHI = twoZHI.replace(new RegExp("-", "gm"), "/")

            //console.log('firstZHI', firstZHI)

            //console.log('twoZHI', twoZHI)

            if (new Date(twoZHI).getTime() < new Date(firstZHI).getTime()) { //如果第二次选择的日期比第一次小

              var cha = new Date(firstZHI).getTime() - new Date(twoZHI).getTime()

              xuanZheData.splice(0, 0, {
                xuanShiJian: e.currentTarget.dataset.shi,
                xuanDayShi: day,
                getTime: shiJIanHaoMiao
              })
              // console.log(xuanDayShi)

              xuanZheData[1].chaDay = parseInt(cha / 86400000)

              delete xuanZheData[0].chaDay;

              //重置入住时间
              that.setData({
                startTime: xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi,
                endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
                dateCount: parseInt(cha / 86400000),
              })
              app.globalData1.startTime = xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi;
              app.globalData1.endTime = xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi;
              app.globalData1.dateCount = parseInt(cha / 86400000);
              
            } else {  //第二次选择的时间比第一次大

              var cha = new Date(twoZHI).getTime() - new Date(firstZHI).getTime()

              //设置离店时间
              
              xuanZheData.push({
                xuanShiJian: e.currentTarget.dataset.shi,
                xuanDayShi: day,
                getTime: shiJIanHaoMiao,
                chaDay: parseInt(cha / 86400000),
              })
              delete xuanZheData[0].chaDay;
              
              that.setData({  //设置开始和结束日期
                startTime: xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi,
                endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
                dateCount: parseInt(cha / 86400000)
              })
              app.globalData1.startTime = xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi;
              app.globalData1.endTime = xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi;
              app.globalData1.dateCount = parseInt(cha / 86400000);
              // console.log('app.globalData1.startTime' + xuanZheData[0].xuanShiJian + '----' + xuanZheData[0].xuanDayShi)
            }

          } else {  //没有选择日期的时候
            //设置入住时间
            that.setData({
              startTime: e.currentTarget.dataset.shi + '-' + day
            })
            // console.log('e.currentTarget.dataset.shi---' + e.currentTarget.dataset.shi + '---' + day)
            app.globalData1.startTime = e.currentTarget.dataset.shi + '-' + day;

            xuanZheData.push({
              xuanShiJian: e.currentTarget.dataset.shi,
              xuanDayShi: day,
              getTime: shiJIanHaoMiao
            })
            
              // that.setData({
              //   startTime: xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi,
              //   endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
              //   dateCount: parseInt(cha / 86400000),
              // })

          }

        } else { //选了两个日期的时候

          var firstZHI = xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi

          firstZHI = firstZHI.replace(new RegExp("-", "gm"), "/")

          var twoZHI = e.currentTarget.dataset.shi + '-' + day

          twoZHI = twoZHI.replace(new RegExp("-", "gm"), "/")

          if (new Date(twoZHI).getTime() < new Date(firstZHI).getTime()) { //如果当前选择的日期小于之前的入住时间

            var cha = new Date(firstZHI).getTime() - new Date(twoZHI).getTime()

            xuanZheData.splice(0, 0, {
              xuanShiJian: e.currentTarget.dataset.shi,
              xuanDayShi: day,
              getTime: shiJIanHaoMiao
            })

            xuanZheData[1].chaDay = parseInt(cha / 86400000)

            delete xuanZheData[0].chaDay;

            xuanZheData.splice(2, 1)
            //重置入住和离店时间
            that.setData({
              startTime: xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi,
              endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
              dateCount: parseInt(cha / 86400000)
            })
            app.globalData1.startTime = xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi;
            app.globalData1.endTime = xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi;
            app.globalData1.dateCount = parseInt(cha / 86400000);

          } else { //当前选择的日期大于之前的入住时间

            var cha = new Date(twoZHI).getTime() - new Date(firstZHI).getTime()

            xuanZheData.splice(1, 1, {
              xuanShiJian: e.currentTarget.dataset.shi,
              xuanDayShi: day,
              getTime: shiJIanHaoMiao,
              chaDay: parseInt(cha / 86400000)
            })

            delete xuanZheData[0].chaDay;
            that.setData({
              endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
              dateCount: parseInt(cha / 86400000)
            })
            app.globalData1.endTime = xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi;
            app.globalData1.dateCount = parseInt(cha / 86400000);

          }

        }

      }



      var thatBIanHUan

      if (xuanZheData.length >= 2) {

        // thatBIanHUan = animation.export()

      } else {

        thatBIanHUan = null

      }

      if (xuanZheData.length == 2) {

        xuanZheData[0].text = '入住';
        xuanZheData[1].text = '离开'

      } else {

        //console.log(xuanZheData[0])

        if (xuanZheData[0]) {

          delete xuanZheData[0].text;

        }

        if (xuanZheData[1]) {

          delete xuanZheData[1].text;

        }

      }

      // console.log(xuanZheData)
      if (xuanZheData.length < 2) {

      }

      that.setData({

        animationData: thatBIanHUan,

        xuanShiJian: e.currentTarget.dataset.shi,

        xuanDayShi: e.currentTarget.dataset.day,

        xuanri: xuanYue + '-' + xuanRi,

        xuanZheData: xuanZheData

      })

      // wx.showToast({

      // title:shiJIan,

      // icon: 'success',

      // duration: 2000

      // })

    },
    cancel: function() {

      var chang = windowHeight;

      var that = this;

      var animation = wx.createAnimation({

        transformOrigin: "50% 50%",

        duration: 1000,

        timingFunction: "ease",

        delay: 0

      })



      xuanZheData = []

      animation.translateY(chang).step()

      that.setData({

        animationData: animation.export(),

        tiao: 'tiao',

        xuanShiJian: "",

        xuanDayShi: "",

        xuanri: "",

        xuanZheData: xuanZheData

      })

      that.setData({
        startTime: this.data.today,
        endTime: this.data.tomorrow,
        dateCount: 1
      })
      app.globalData1.startTime = this.data.today;
      app.globalData1.endTime = this.data.tomorrow;
      app.globalData1.dateCount = 1;



    },

    confirm: function() {

      var chang = windowHeight;

      var that = this;

      var animation = wx.createAnimation({

        transformOrigin: "50% 50%",

        duration: 1000,

        timingFunction: "ease",

        delay: 0

      })

      if (xuanZheData.length == 1) {

        wx.showModal({

          title: '提示',

          content: '第一次选择的是开始时间!',

          showCancel: false,

          success: function(res) {

          }

        })

        that.setData({
          endTime: '请选择',
          dateCount: 0
        })

      } else {
        animation.translateY(chang).step()
        const chaDay = `xuanZheData[1].chaDay`

        that.setData({
          xuanZheData: xuanZheData,
          animationData: animation.export(),
          // startTime: xuanZheData[0].xuanShiJian + '-' + xuanZheData[0].xuanDayShi,
          // endTime: xuanZheData[1].xuanShiJian + '-' + xuanZheData[1].xuanDayShi,
          // dateCount: parseInt(cha / 86400000),
        })

        //将数据传到调用页面
        that.transfor();
      }
    },

    /****************其他事件************************* */

    transfor:function() {
      console.log(this.data.endTime)
      let allInfo = {};
      allInfo.startTime = this.data.startTime;
      allInfo.endTime = this.data.endTime;
      allInfo.dateCount = this.data.dateCount;
      this.triggerEvent('getComponentDate', allInfo);
    },

    xianShi: function() {

      var chang = windowHeight;

      var that = this;

      var animation = wx.createAnimation({

        transformOrigin: "50% 50%",

        duration: 500,

        timingFunction: "ease",

        delay: 0

      })

      animation.translateY(-chang).step()

      that.setData({

        animationData: animation.export()

      })

    }
  }
})