// pages/evaluation/evaluation.js
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '评论', //导航栏 中间的标题
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20, 
    page: 0,
    hotelStar: '',
    hotelRate: [
    ],
    serviceRate: '',
    hygieneRate: '',
    positionRate: '',
    deviceRate: '',
    userRateList: [],
    api: '',
    haveEval: false

  },
  zan: function(e) {
    let index = e.currentTarget.dataset['index']
    let rateId = e.currentTarget.dataset['rateid']
    console.log(index + ',' + rateId)

    //当前评论是否点赞
    let hasGood = this.data.userRateList[index].hasGood
    
    //当前评论点赞状态
    let isGood = 'userRateList['+index+'].hasGood'
    console.log(hasGood)

    if (!hasGood) {
      this.setData({
        [isGood]: true
      })
    } else {
      this.setData({
        [isGood]: false
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    wx.request({
      url: app.globalData.rootApi + '/zxkj/comment/wxLookComment',
      data: {
        // hotelId: app.globalData1.hotelId,
        hotelId: options.hotelId,
        num: that.data.page
      },
      method: 'GET',
      header: { 'content-type': 'application/json' },
      success: function (res) {
        console.log('评论返回---', res.data)
        let data = res.data
        
        if(data.length > 0){
          let hotelStar = (data[0].serviceRate + data[0].hygieneRate + data[0].positionRate + data[0].deviceRate) / 4
          // let serviceRate = data[0].serviceRate
          // let hygieneRate = data[0].hygieneRate
          // let positionRate = data[0].positionRate
          // let deviceRate = data[0].deviceRate
          for (let i = 0; i < data.length; i++) {
            data[i].createTime = data[i].createTime.substring(0, 10)
            data[i].inTime = data[i].inTime.substring(0, 10)
            //收到4个评分，算出平均分并赋值给roomScore
            data[i].roomScore = (data[i].serviceScore + data[i].environmentScore + data[i].facilitiesScore + data[i].roomScore) / 4

            if ((data[i].imgs != null) && (data[i].imgs != '')) {
              var jsonStr = data[i].imgs

              jsonStr = jsonStr.replace(" ", "");
              jsonStr = jsonStr.replace(/\ufeff/g, "");//重点
              var jj = JSON.parse(jsonStr);
              data[i].imgs = jj
            }

          }

          let serviceName = 'hotelRate[0].name'
          let hygieneName = 'hotelRate[1].name'
          let positionName = 'hotelRate[2].name'
          let deviceName = 'hotelRate[3].name'
          let serviceRate = 'hotelRate[0].star'
          let hygieneRate = 'hotelRate[1].star'
          let positionRate = 'hotelRate[2].star'
          let deviceRate = 'hotelRate[3].star'
          that.setData({
            haveEval: true,
            api: app.globalData.rootApi,
            userRateList: data,
            hotelStar: hotelStar,
            [serviceName]: '服务',
            [hygieneName]: '卫生',
            [positionName]: '位置',
            [deviceName]: '设施',
            [serviceRate]: data[0].serviceRate,
            [hygieneRate]: data[0].hygieneRate,
            [positionRate]: data[0].positionRate,
            [deviceRate]: data[0].deviceRate,
          })
        }else{
          that.setData({
            haveEval: false
          })
        }
      },
      fail: function (res) {

      }
    })
  },

  good: function(e){

  },
  medium:function(e){

  },
  negative: function(e){

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
    console.log(that.data.userRateList.length)
    if (that.data.userRateList.length <= 0) {
      that.setData({
        haveEval: false
      })
    }
    console.log(that.data.haveEval)
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
  onReachBottom: function () {
    // var that = this;
    // // 显示加载图标
    // wx.showLoading({
    //   title: '玩命加载中',
    // })
    // // 页数+1
    // page = page + 1;
    // wx.request({
    //   url: app.globalData.rootApi + '/zxkj/comment/wxLookComment',
    //   data: {
    //     // hotelId: app.globalData1.hotelId,
    //     hotelId: 83,
    //     num: that.data.page
    //   },
    //   method: 'GET',
    //   header: { 'content-type': 'application/json' },
    //   success: function (res) {
    //     console.log('评论返回---', res.data)
    //     let data = res.data
    //     let hotelStar = (data[0].serviceRate + data[0].hygieneRate + data[0].positionRate + data[0].deviceRate) / 4
    //     for (let i = 0; i < data.length; i++) {
    //       data[i].createTime = data[i].createTime.substr(0, 10)
    //       data[i].inTime = data[i].inTime.substr(0, 10)
    //       //收到4个评分，算出平均分并赋值给roomScore
    //       data[i].roomScore = (data[i].serviceRate + data[i].environmentScore + data[i].facilitiesScore + data[i].roomScore) / 4

    //       // data[i].imgs.splice(0, 1)
    //       // data[i].imgs.splice(-1, 1)
    //       let img = data[i].imgs.split(',')
    //       console.log(img)
    //       for (let j = 0; j < data[i].imgs.length; j++) {
    //         data[i].imgs[j] = app.globalData.rootApi + data[i].imgs[j]
    //       }
    //     }
    //     that.setData({
    //       userRateList: data,
    //       hotelStar: hotelStar
    //     })
    //     // 隐藏加载框
    //     wx.hideLoading();
    //   },
    //   fail: function (res) {

    //   }
    // })

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },

  /**
   * 用户下拉加载
   */
  onPullDownRefresh: function(){
    // wx.showToast({
    //   title: '加载中',
    //   icon: 'loading',
    //   duration: 1000
    // })
    // setTimeout(() => {
    //   wx.stopPullDownRefresh()
    // }, 1000);

   
  }
})