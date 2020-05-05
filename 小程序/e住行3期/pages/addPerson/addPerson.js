// pages/addPerson/addPerson.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    chooseRoom: false,
    hotelName: '钟环酒店',
    roomName: '榻榻米大床房 33楼 3033',
    orderInfo: '10月15日 - 10月17日 共2晚 无早餐',
    ownerList: [],
    roomInfo: [{
        roomName: '榻榻米大床房',
        roomFloor: '33楼',
        roomNum: '3303',
        roomDate: '10月15日-10月17日',
        roomTime: '共2晚',
        roomOther: '无早餐'
      },
      {
        roomName: '榻榻米大床房',
        roomFloor: '33楼',
        roomNum: '3303',
        roomDate: '10月15日-10月17日',
        roomTime: '共2晚',
        roomOther: '无早餐'
      },
      {
        roomName: '榻榻米大床房',
        roomFloor: '33楼',
        roomNum: '3303',
        roomDate: '10月15日-10月17日',
        roomTime: '共2晚',
        roomOther: '无早餐'
      }
    ],
    hotelName:'',
    roomName:'',
    door: '',//房间号
    building: '',//建筑
    floor: '',//楼层
    startTime: '',
    endTime: '',
    dateCount:'',
    userName:'',
    card:'',
    


  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },
  confirm: function() {
    this.setData({
      chooseRoom: true
    })
  },
  closeChoose: function(e) {
    this.setData({
      chooseRoom: false
    })
  },
  adds: function(e) {
    this.setData({
      chooseRoom: true
    })
  },
  userName: function(e) {
    var userName = e.detail.value
    this.setData({
      userName: e.detail.value
    })
  },
  card: function(e) {
    var card = e.detail.value
    this.setData({
      card: e.detail.value
    })
  },
  ownerInfo: function(e) {
    wx.redirectTo({
      url: '/pages/ownerInfo/ownerInfo',
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */

  onReady: function() {
    let vm = this;
    var id = '530111111111111111'
    var yincangID = id.replace(/(\w)/g, function(a, b, c, d) {
      return ((c > 1 && c < 6) || c > (id.length - 5)) ? '*' : a
    });
    vm.setData({
      ownerList: [{
        user: '瓜虫犬',
        idCard: yincangID
      }, {
        user: '瓜虫犬',
        idCard: '530111111111111111'
      }]
    })
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