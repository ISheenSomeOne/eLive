// pages/lookPermission/lookPermission.js
let app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 组件所需的参数
    nvabarData: {
      showCapsule: 1, //是否显示左上角图标   1表示显示    0表示不显示
      title: '查看权限', //导航栏 中间的标题
      goHome: 1
    },
    // 此页面 页面内容距最顶部的距离
    height: app.globalData.height * 2 + 20,
    orderRoomId: '',
    chooseOwner: true,
    roomNum: '国际银座B栋A2707国际银座B栋A2707国际银座B栋A2707国际银座B栋A2707',
    roomPass: '121548',
    roomOwner: '李三岁',
    nowOwnerList: [],
    ownerList: [],
    isChosen: [],
    readOnly: 'canWrite'
  },
  transferRights:function(){
    let that = this
    // wx.navigateTo({
    //   url: '/pages/transferRights/transferRights?orderRoomId=' + that.data.orderRoomId,
    // })

    wx.showToast({
      title: '功能正在开发中···',
      duration: 1500,
      icon: "none"
    })
  },
  //完成按钮
  doneBtn: function() {
    let that = this
    let nowOwnerList = that.data.nowOwnerList //获取已选择入住人
    let memberIds = [] //新建已选择入住人请求数组
    let count = 0
    for (let i = 0; i < nowOwnerList.length; i++) { //判断现有入住人数量
      console.log('nowOwnerListItem----')
      console.log(nowOwnerList[i])
      if (nowOwnerList[i] != '') {
        count++
      }
    }
    if (count == 0) { //是否为空
      wx.showModal({
        title: '提示',
        content: '您没有选择入住人，确定继续吗？',
        success(res) {
          if (res.confirm) {
            wx.request({
              url: app.globalData.rootApi + '/zxkj/OrderRoom/wxThoroughUpdateRuZhuRen',
              data: {
                orderRoomId: that.data.orderRoomId,
                memberIds: memberIds
              },
              method: 'POST',
              header: {
                'content-type': 'application/x-www-form-urlencoded'
              },
              success: function(res) {
                console.log('点击完成---', res.data)
                if (res.data.code == 200) {
                  that.setData({
                    chooseOwner: false
                  })
                } else if (res.data.code == -1) {
                  wx.showToast({
                    title: res.data.msg,
                    duration: 2000,
                    icon: "none"
                  })
                } else {
                  wx.showToast({
                    title: '服务器错误',
                    duration: 2000,
                    icon: "none"
                  })
                }
                // this.setData({
                //   newPeople: false
                // })
              },
              fail: function(res) {
                wx.showToast({
                  title: '建议重新进入或关闭小程序重启',
                  duration: 1500,
                  icon: "none"
                })
              }
            })

          } else if (res.cancel) {
            console.log('用户点击取消')
          }
        }
      })
    } else {
      for (let i = 0; i < nowOwnerList.length; i++) {
        if (nowOwnerList[i] != '') {
          memberIds.push(nowOwnerList[i].id)
        }
      }
      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxThoroughUpdateRuZhuRen',
        data: {
          orderRoomId: that.data.orderRoomId,
          memberIds: memberIds
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log('点击完成---', res.data)
          if (res.data.code == 200) {
            that.setData({
              chooseOwner: false
            })
          } else if (res.data.code == -1) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '服务器错误',
              duration: 2000,
              icon: "none"
            })
          }
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function(res) {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 1500,
            icon: "none"
          })
        }
      })
    }
  },
  addBtn: function() {
    this.setData({
      chooseOwner: true
    })
  },
  selectOwner: function(e) {
    let that = this
    let count = 0 //当前入住人数量
    let index = e.target.dataset.index
    let nowOwnerList = that.data.nowOwnerList
    console.log(nowOwnerList)
    for (let i = 0; i < nowOwnerList.length; i++) { //判断现有入住人数量
      console.log(nowOwnerList[i])
      if (nowOwnerList[i] != '') {
        count++
      }
    }
    console.log('count---' + count)
    if (count >= that.data.maxRuZhuRenCount) {
      wx.showToast({
        title: '入住人数达到上限',
        duration: 1500,
        icon: "none"
      })
    } else {
      nowOwnerList[index] = that.data.ownerList[index]
      that.setData({
        nowOwnerList: nowOwnerList
      })
    }
  },
  del: function(e) {
    let index = e.target.dataset.index
    let nowOwnerList = this.data.nowOwnerList
    nowOwnerList[index] = ''
    this.setData({
      nowOwnerList: nowOwnerList
    })

  },
  //邀请好友入住
  inviteOwner: function() {
    let that = this
    let nowOwnerList = that.data.nowOwnerList //获取已选择入住人
    let memberIds = [] //新建已选择入住人请求数组
    let count = 0
    for (let i = 0; i < nowOwnerList.length; i++) { //判断现有入住人数量
      console.log('nowOwnerListItem----')
      console.log(nowOwnerList[i])
      if (nowOwnerList[i] != '') {
        count++
      }
    }
    if (count == 2) { //是否满员
      wx.showToast({
        title: '入住人数达到上限',
        duration: 2000,
        icon: "none"
      })
    } else {
      for (let i = 0; i < nowOwnerList.length; i++) {
        if (nowOwnerList[i] != '') {
          memberIds.push(nowOwnerList[i].id)
        }
      }
      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxThoroughUpdateRuZhuRen',
        data: {
          orderRoomId: that.data.orderRoomId,
          memberIds: memberIds
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log('点击邀请好友入住---', res.data)
          if (res.data.code == 200) {
            that.setData({
              chooseOwner: false
            })
            wx.navigateTo({
              url: '/pages/inviteOwner/inviteOwner?orderRoomId=' + that.data.orderRoomId,
            })
          } else if (res.data.code == -1) {
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: "none"
            })
          } else {
            wx.showToast({
              title: '服务器错误',
              duration: 2000,
              icon: "none"
            })
          }
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function(res) {
          wx.showToast({
            title: '建议重新进入或关闭小程序重启',
            duration: 1500,
            icon: "none"
          })
        }
      })
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this
    let orderRoomId = options.orderRoomId
    let maxRuZhuRenCount = options.maxRuZhuRenCount
    let readOnly = options.readOnly
    console.log(options)
    that.setData({
      orderRoomId: orderRoomId,
      maxRuZhuRenCount: maxRuZhuRenCount,
      readOnly: readOnly
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
    let that = this
    console.log(that.data.orderRoomId)
    if (that.data.orderRoomId == '' || that.data.orderRoomId == null) {
      wx.showToast({
        title: '建议重新进入或关闭小程序重启',
        duration: 1500,
        icon: "none"
      })
    } else {
      wx.showLoading({
        title: '加载中',
        mask: true
      })

      wx.request({
        url: app.globalData.rootApi + '/zxkj/OrderRoom/wxSelectVerified',
        data: {
          orderRoomId: that.data.orderRoomId
        },
        method: 'POST',
        header: {
          'content-type': 'application/x-www-form-urlencoded'
        },
        success: function(res) {
          console.log('-------------', res.data)
          if (res.data.code == -1) {
            wx.hideLoading()
            wx.showToast({
              title: '建议重新进入或关闭小程序重启',
              duration: 1500,
              icon: "none"
            })
          } else {
            let ownerList = res.data.ownerList
            let nowOwnerList = res.data.nowOwnerList
            // for (let i = 0; i < ownerList.length; i++) { //需要后台按顺序传
            //   if (typeof(nowOwnerList[i].id) == 'undefined') {
            //     console.log(i)
            //     nowOwnerList.splice(i, 0, '')
            //   } else if (ownerList[i].id != nowOwnerList[i].id) {
            //     console.log(i)
            //     nowOwnerList.splice(i, 0, '')
            //     console.log(nowOwnerList)
            //   }
            // }
            let isChosen = []
            for (let i = 0; i < ownerList.length; i++) {
              isChosen.push('')
            }
            for (let i = 0; i < nowOwnerList.length; i++) {
              for (let j = 0; j < ownerList.length; j++) {
                if (nowOwnerList[i].id == ownerList[j].id) {
                  isChosen.splice(j, 0, nowOwnerList[i])
                }
              }
            }
            that.setData({
              roomAddress: res.data.roomAddress,
              ownerList: ownerList,
              password: res.data.password,
              nowOwnerList: isChosen
            })
            wx.hideLoading()
          }
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function(res) {
          wx.hideLoading()
        }
      })
    }

  },
  // changeOwner: function() {
  //   let that = this
  //   let nowOwnerList = that.data.nowOwnerList
  //   let ownerList = that.data.ownerList

  //   that.setData({
  //     isChosen: isChosen
  //   })
  // },

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