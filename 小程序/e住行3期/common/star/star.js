// common/star/star.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    rateStar: {
      type: Number,
      value: 5
    }
  },
  ready: function () {
    this.formatStar(this.data.rateStar)
  },

  /**
   * 组件的初始数据
   */
  data: {
    star: 0,
    starBan: 0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    formatStar: function (rate){
      let rateStar = rate
      //评分为整数
      if(rateStar % 1 == 0){
        this.setData({
          star: rateStar,
          starBan: false
        })
      }else{
        this.setData({
          star: Math.floor(rateStar / 1),
          starBan: true
        })
      }
    }
  }
})