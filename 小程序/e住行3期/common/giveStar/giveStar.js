// common/giveStar/giveStar.js
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
    star: 0,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    addStar: function (e) {
      let star = this.data.star
      let num = e.currentTarget.dataset.index + 1
      let starNum = {
        num: star + num
      }
      this.triggerEvent('getstar', starNum) //myevent自定义名称事件，父组件中使用  传参
      this.setData({
        star: star + num
      })
    },
    lessStar: function (e) {
      let num = e.currentTarget.dataset.index + 1
      let starNum = {
        num: num
      }
      this.triggerEvent('getstar', starNum) //myevent自定义名称事件，父组件中使用  传参
      this.setData({
        star: num
      })
    }
  }
})
