// pages/ownerInfo/ownerInfo.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '常用入住人', //导航栏 中间的标题
    },

    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    userInfo: [{
        value: '1',
        userName: '李一岁',
        idCard: '1234123',
        checked: 'true'
      },
      {
        value: '2',
        userName: '李二岁',
        idCard: '1234123',
      },
      {
        value: '3',
        userName: '李三岁',
        idCard: '1234123',
      },
    ]

  },
  radioChange: function(e) {
    console.log('radio发生change事件，携带value值为：', e.detail.value)
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let userInfo = [{
        value: '1',
        userName: '李一岁',
        idCard: '530111111111111111',
        checked: 'true'
      },
      {
        value: '2',
        userName: '李二岁',
        idCard: '530111111111111111',
      },
      {
        value: '3',
        userName: '李三岁',
        idCard: '530111111111111111',
      },
    ]
    let usr= [];
    for(let i=0; i<userInfo.length; i++){
      userInfo[i].idCard = userInfo[i].idCard.replace(/(\w)/g, function (a, b, c, d) {
        return ((c > 3 && c < 16)) ? '*' : a
      });
    }
    this.setData({
      userInfo: userInfo
    })
  },

  addOwner: function(){
   wx.redirectTo({
     url: '/pages/addOwner/addOwner',
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