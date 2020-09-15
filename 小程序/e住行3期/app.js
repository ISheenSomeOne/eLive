    App({

      onShow: function() {
        //		console.log(getCurrentPages())
      },
      onHide: function() {
        //	console.log(getCurrentPages())
      },
      onError: function(msg) {
        //console.log(msg)
      },

      util: require('/utils/util.js'),

      tabBar: {
        "color": "#123",
        "selectedColor": "#1ba9ba",
        "borderStyle": "#1ba9ba",
        "backgroundColor": "#fff",
        "list": [

        ]
      },



      onLaunch: function(options) {
        // console.log(222222222222222)
        // console.log(options)
        // console.log(decodeURIComponent(options.scene))
        // console.log(decodeURIComponent(options.query.q))
        //获取顶部窗口的高度
        wx.getSystemInfo({
          success: (res) => {
            console.log('topBar---' + res.statusBarHeight)
            this.globalData.height = res.statusBarHeight
          }
        })

        //版本更新提示
        const updateManager = wx.getUpdateManager()

        updateManager.onCheckForUpdate(function (res) {
          // 请求完新版本信息的回调
          console.log(res.hasUpdate)
        })

        updateManager.onUpdateReady(function () {
          wx.showModal({
            title: '更新提示',
            content: '新版本已经准备好，是否重启应用？',
            success: function (res) {
              if (res.confirm) {
                // 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
                updateManager.applyUpdate()
              }
            }
          })
        })

        updateManager.onUpdateFailed(function () {
          // 新版本下载失败
        })

        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)

        //今天日期
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

        this.globalData1.startTime = Y + '-' + M + '-' + D;
        this.globalData1.endTime = tY + '-' + tM + '-' + tD;
        this.globalData1.dateCount = 1

        // 登录
        wx.login({
          success: res => {
            // 发送 res.code 到后台换取 openId, sessionKey, unionId
          }
        })
        // 获取用户信息
        // wx.getSetting({
        //   success: res => {
        //     if (res.authSetting['scope.userInfo']) {
        //       // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        //       wx.getUserInfo({
        //         success: res => {
        //           // 可以将 res 发送给后台解码出 unionId
        //           this.globalData.userInfo = res.userInfo

        //           // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
        //           // 所以此处加入 callback 以防止这种情况
        //           if (this.userInfoReadyCallback) {
        //             this.userInfoReadyCallback(res)
        //           }
        //         }
        //       })
        //     }
        //   }
        // })
      },
      getLocationInfo: function(cb) {
        var that = this;
        if (this.globalData.locationInfo) {
          cb(this.globalData.locationInfo)
        } else {
          wx.getLocation({
            type: 'gcj02', // 默认为 wgs84 返回 gps 坐标，gcj02 返回可用于 wx.openLocation 的坐标
            success: function(res) {
              that.globalData.locationInfo = res;
              cb(that.globalData.locationInfo)
            },
            fail: function() {
              // fail
            },
            complete: function() {
              // complete
            }
          })
        }
      },
      globalDataRoom: {
        roomId: '',
        door: '', //房间号
        building: '', //建筑
        floor: '', //楼层
        orderList: '', //订单集合
        maxRuZhuRenCount: '', //房间最大入住人数总量
        orderRoomId: '', //订单下房间的ID
        createTime: '', //下单时间
        outTradeNo: '', //订单号 
        orderId: '', //
      },
      globalData3: { //优惠券的相关数据
        couponId: '', //优惠券的ID
        man: '', //满减值得满
        jian: '', //满减值的减
        totalPrice: '', //总价
        manPrice: '',
        tel: '', //下单人联系电话
        contacts: '', //下单人
        idcard: '', //实名身份证
        showValue: '', //选择的房间数量
        info: ''
      },

      globalData2: { //房间的相关数据
        roomTypeId: '', //房间类型的ID
        roomName: '', //房间名字
        roomCount: '', //房间数量
        bed: '', //床型 
        area: '', //面积
        price: '', //价格
        deposit: '', //押金
        minNegotiatedPrice: '', //协议价格
      },

      globalData1: {
        latitude: 0,
        longitude: 0,
        startTime: '', //开始时间
        endTime: '', //结束时间
        dateCount: '', //选择的天数
        address: '', //酒店地址
        memberId: '', //会员ID
        hotelId: '', //酒店ID
        hotelDistance: '',
        star: '',
        hotelName: '', //酒店名字
        area: '',
        renovationTime: '',
        street: '',
        newPeople: '' //是否显示新人领券弹窗的值
      },

      globalDataDoorList: { //用于续房功能
        orderListContinue: '',
        checkInDate: '',
        roomDoorList: '',
        price: '',
        numbelLength: '',
        roomId: '',
        hotelId: '',
        orderId: '',
        totalPrice: '',
        deposit: ''
      },

      globalData: {
        phone: '',
        height: '',
        userInfo: '',
        openid: '',
        session_key: '',
        iv: '',
        encryptedData: '',
        // rootApi: 'http://192.168.2.135:9955',//彭兴华测试环境
        // rootApi: 'http://siwce9.natappfree.cc',//测试环境
        rootApi:'https://zxkj.webinn.online',//正式环境
        imgApi: 'https://zxkj.webinn.online/zxkj/imgs/' //'http://webinn.online:9955/zxkj/img/'
      }
});