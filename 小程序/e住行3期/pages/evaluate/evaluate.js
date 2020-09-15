// pages/evaluate/evaluate.js
let app = getApp()
var util = require('../../utils/util.js')
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
    evalCont: ['服务', '卫生', '位置', '设施'],
    orderId: '',
    serviceScore: 0,
    roomScore: 0,
    environmentScore: 0,
    facilitiesScore: 0,
    comment: '',
    images: [],
    canAdd: true,
    updateImg: '',
    openid: ''
  },

  bindTextAreaBlur: function(e) {
    console.log(e.detail.value)
    this.setData({
      comment: e.detail.value
    })
  },
  getStar: function(e) {
    console.log("star--" + e.detail.num)
    let index = e.currentTarget.dataset.index;
    let num = e.detail.num
    console.log(num)

    if (index == 0) {
      this.setData({
        serviceScore: num
      })
    } else if (index == 1) {
      this.setData({
        roomScore: num
      })
    } else if (index == 2) {
      this.setData({
        environmentScore: num
      })
    } else if (index == 3) {
      this.setData({
        facilitiesScore: num
      })
    }

  },
  addImg: function(e) {
    let that = this
    wx.chooseImage({
      count: 5,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        console.log(res)
        const tempFilePaths = res.tempFilePaths
        const images = that.data.images.concat(tempFilePaths)
        // 限制最多只能留下5张照片
        console.log(that.data.images.length)
        // that.data.images = localImage.length <= 5 ? images : images.slice(0, 5)
        if (images.length < 4) {
          that.setData({
            images: images
          })
        } else if (images.length == 4) {

          that.setData({
            canAdd: false,
            images: images
          })
        } else {
          that.setData({
            canAdd: false,
            images: images.slice(0, 4)
          })

        }
        console.log(that.data.images)
      }
    })
  },
  handleImagePreview(e) {
    const index = e.target.dataset.index
    const images = this.data.images
    wx.previewImage({
      current: images[index], //当前预览的图片
      urls: images, //所有要预览的图片
    })
  },
  
  /**
   * 删除图片按钮
   */
  deleteImg: util.throttle(function(e) {
    let index = e.currentTarget.dataset.index
    let images = this.data.images
    images.splice(index, 1)
    this.setData({
      images: images,
      canAdd: true
    })
  },3000),

  /**
   * 提交按钮
   */
  confirm: util.throttle(function () {
    wx.showLoading({
      title: '请稍等',
      mask:true,
    })

    let that = this
    let images = that.data.images
    let updateImg = {};
    let ok = []
    console.log('length' + images.length)
    if(images.length ==0){
      wx.request({
        url: app.globalData.rootApi + '/zxkj/comment/wxAddComment',
        data: {
          openid: that.data.openid,
          orderId: that.data.orderId, //还需要初始化
          roomScore: that.data.roomScore,
          serviceScore: that.data.serviceScore,
          environmentScore: that.data.environmentScore,
          facilitiesScore: that.data.facilitiesScore,
          imgs: that.data.updateImg,
          comment: that.data.comment,
        },
        method: 'GET',
        // dataType: 'json',
        header: {
          'content-type': 'application/json'
        },
        success: function (res) {
          console.log('评论成功返回--', res.data)
          wx.hideLoading()
          wx.navigateTo({
            url: '/pages/successEval/successEval',
          })
          // this.setData({
          //   newPeople: false
          // })
        },
        fail: function (res) {

        }
      })
    }else{
      for (let i = 0; i < images.length; i++) {
        //开始上传图片并保存图片名
        wx.uploadFile({
          url: app.globalData.rootApi + '/zxkj/comment/wxUploadImage', //仅为示例，非真实的接口地址
          filePath: images[i],
          name: 'files',
          header: {
            "Content-Type": "multipart/form-data"
          },
          formData: null,

          success(res) {
            const data = res.data
            updateImg[i] = data
            console.log(updateImg)
            that.setData({
              updateImg: updateImg
            })
            ok.push('1')
            if (ok.length == images.length) {
              // setTimeout(function() {

              //开始提交评论请求（带上图片名字）
              console.log(that.data.updateImg)
              wx.request({
                url: app.globalData.rootApi + '/zxkj/comment/wxAddComment',
                data: {
                  // memberId: app.globalData1.memberId,
                  openid: that.data.openid,
                  orderId: that.data.orderId, //还需要初始化
                  roomScore: that.data.roomScore,
                  serviceScore: that.data.serviceScore,
                  environmentScore: that.data.environmentScore,
                  facilitiesScore: that.data.facilitiesScore,
                  imgs: that.data.updateImg,
                  comment: that.data.comment,
                },
                method: 'GET',
                // dataType: 'json',
                header: {
                  'content-type': 'application/json'
                },
                success: function (res) {
                  console.log('评论成功返回--', res.data)
                  wx.hideLoading()
                  wx.navigateTo({
                    url: '/pages/successEval/successEval',
                  })
                  // this.setData({
                  //   newPeople: false
                  // })
                },
                fail: function (res) {

                }
              })

              // }, 5000)

            }
          },
          fail: function (res) {
            wx.hideToast();
            wx.showModal({
              title: '错误提示',
              content: '上传图片失败',
              showCancel: false,
              success: function (res) { }
            })
          }
        })
      }
    }

  },3000),
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    this.setData({
      orderId: options.orderId
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
    wx.getStorage({
      key: 'openid',
      success: function (res) {
        that.setData({
          openid: res.data
        })
        console.log('缓存的openid', res.data)
      }
    });
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