(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["pages-finance-finance"],{"4bd4":function(t,e,a){"use strict";a.d(e,"b",(function(){return n})),a.d(e,"c",(function(){return s})),a.d(e,"a",(function(){return i}));var i={uniCalendar:a("f579").default,uniIcons:a("ed90").default},n=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("v-uni-view",[a("uni-calendar",{ref:"calendar",attrs:{btm:!0,insert:!1,lunar:!0,range:!0},on:{confirm:function(e){arguments[0]=e=t.$handleEvent(e),t.dateConfirm.apply(void 0,arguments)}}}),a("v-uni-view",{staticClass:"topBox"},[a("v-uni-picker",{staticClass:"pickerClass",attrs:{mode:"selector",range:t.datePiker,value:t.datePikerIndex},on:{change:function(e){arguments[0]=e=t.$handleEvent(e),t.financeDateChange.apply(void 0,arguments)}}},[a("v-uni-view",[t._v(t._s(t.datePiker[t.datePikerIndex])),a("uni-icons",{staticClass:"dateIcon",attrs:{color:"#777",type:"arrowdown"}})],1)],1),a("v-uni-view",{staticClass:"calendar-button",on:{click:function(e){arguments[0]=e=t.$handleEvent(e),t.openCalendar.apply(void 0,arguments)}}},[t._v(t._s(t.financeDate.before)+" 至 "+t._s(t.financeDate.after))])],1),a("v-uni-view",{staticClass:"mainBox"},[a("v-uni-view",{staticClass:"mainTop"},[a("v-uni-view",{staticClass:"mainTopBox"},[a("v-uni-view",{staticClass:"mainTopTitle"},[t._v("实际营收")]),a("v-uni-view",{staticClass:"mainTopCont",staticStyle:{"text-align":"left"}},[t._v(t._s(t.orderData.otherData.total))])],1),a("v-uni-view",{staticClass:"mainTopBox"},[a("v-uni-view",{staticClass:"mainTopTitle"},[t._v("平均房价")]),a("v-uni-view",{staticClass:"mainTopCont",staticStyle:{"text-align":"right"}},[t._v(t._s(t.hejiData.totalAverageHousingPrice))])],1)],1),a("v-uni-view",{staticClass:"mainBottom"},[a("v-uni-view",{staticClass:"mainBottomBox"},[a("v-uni-view",{staticClass:"mainTopTitle"},[t._v("入住率")]),a("v-uni-view",{staticClass:"mainBottomCont"},[t._v(t._s(t.hejiData.totalOccupancy))])],1),a("v-uni-view",{staticClass:"mainBottomBox"},[a("v-uni-view",{staticClass:"mainTopTitle"},[t._v("开房数")]),a("v-uni-view",{staticClass:"mainBottomCont"},[t._v(t._s(t.hejiData.totalRoomOccupancy))])],1),a("v-uni-view",{staticClass:"mainBottomBox"},[a("v-uni-view",{staticClass:"mainTopTitle"},[t._v("房间总数")]),a("v-uni-view",{staticClass:"mainBottomCont"},[t._v(t._s(t.hejiData.totalNumberRooms))])],1)],1)],1),a("v-uni-view",{staticClass:"tableBox"},[a("v-uni-view",{staticClass:"tableTitle"},[a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"150rpx"}},[t._v("营业日期")]),a("v-uni-view",{staticClass:"tableItem"},[t._v("开房数")]),a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"120rpx"}},[t._v("房间总数")]),a("v-uni-view",{staticClass:"tableItem"},[t._v("入住率")]),a("v-uni-view",{staticClass:"tableItem"},[t._v("营收")]),a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"120rpx"}},[t._v("平均房价")])],1),t._l(t.listData,(function(e,i){return[a("v-uni-view",{key:i+"_0",staticClass:"tableList"},[a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"150rpx"}},[t._v(t._s(t.dateData[i]))]),a("v-uni-view",{staticClass:"tableItem"},[t._v(t._s(e.dayIntoHousing))]),a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"120rpx"}},[t._v(t._s(t.hejiData.dayRoomNumber))]),a("v-uni-view",{staticClass:"tableItem"},[t._v(t._s(e.dayOccupancyRate))]),a("v-uni-view",{staticClass:"tableItem"},[t._v(t._s(e.dailyRate))]),a("v-uni-view",{staticClass:"tableItem",staticStyle:{width:"120rpx"}},[t._v(t._s(e.averageRent))])],1)]}))],2)],1)},s=[]},"4cd7":function(t,e,a){var i=a("8485");"string"===typeof i&&(i=[[t.i,i,""]]),i.locals&&(t.exports=i.locals);var n=a("4f06").default;n("7a59f1d3",i,!0,{sourceMap:!1,shadowMode:!1})},"4d4c":function(t,e,a){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var i={data:function(){return{datePiker:["实时","昨天","过去一周","过去一月","过去一年","自定义"]}},onLoad:function(){this.$store.commit("financeInit")},computed:{datePikerIndex:function(){return this.$store.state.finance.datePikerIndex},hejiData:function(){return this.$store.state.finance.hejiData},listData:function(){return this.$store.state.finance.listData},dateData:function(){return this.$store.state.finance.dateData},financeDate:function(){return this.$store.state.finance.financeDate},orderData:function(){return this.$store.state.finance.orderData}},methods:{financeDateChange:function(t){this.$store.commit("financeDateChange",t.target.value)},openCalendar:function(t){this.$refs.calendar.open()},dateConfirm:function(t){this.$store.commit("financeDateConfirm",t)}}};e.default=i},"5f5c":function(t,e,a){"use strict";var i=a("4cd7"),n=a.n(i);n.a},"6ecc":function(t,e,a){"use strict";a.r(e);var i=a("4bd4"),n=a("75d6");for(var s in n)"default"!==s&&function(t){a.d(e,t,(function(){return n[t]}))}(s);a("5f5c");var o,c=a("f0c5"),r=Object(c["a"])(n["default"],i["b"],i["c"],!1,null,"c8fe15aa",null,!1,i["a"],o);e["default"]=r.exports},"75d6":function(t,e,a){"use strict";a.r(e);var i=a("4d4c"),n=a.n(i);for(var s in i)"default"!==s&&function(t){a.d(e,t,(function(){return i[t]}))}(s);e["default"]=n.a},8485:function(t,e,a){var i=a("24fb");e=i(!1),e.push([t.i,'@charset "UTF-8";\r\n/**\r\n * 这里是uni-app内置的常用样式变量\r\n *\r\n * uni-app 官方扩展插件及插件市场（https://ext.dcloud.net.cn）上很多三方插件均使用了这些样式变量\r\n * 如果你是插件开发者，建议你使用scss预处理，并在插件代码中直接使用这些变量（无需 import 这个文件），方便用户通过搭积木的方式开发整体风格一致的App\r\n *\r\n */\r\n/**\r\n * 如果你是App开发者（插件使用者），你可以通过修改这些变量来定制自己的插件主题，实现自定义主题功能\r\n *\r\n * 如果你的项目同样使用了scss预处理，你也可以直接在你的 scss 代码中使用如下变量，同时无需 import 这个文件\r\n */\r\n/* 颜色变量 */\r\n/* 行为相关颜色 */\r\n/* 文字基本颜色 */\r\n/* 背景颜色 */\r\n/* 边框颜色 */\r\n/* 尺寸变量 */\r\n/* 文字尺寸 */\r\n/* 图片尺寸 */\r\n/* Border Radius */\r\n/* 水平间距 */\r\n/* 垂直间距 */\r\n/* 透明度 */\r\n/* 文章场景相关 */.topBox[data-v-c8fe15aa]{position:relative;height:35px;line-height:35px;font-size:14px;padding:8px 10px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between}.calendar-button[data-v-c8fe15aa]{box-shadow:0 0 5px 1px rgba(0,0,0,.1);color:#777;width:65%;text-align:center;border-radius:5px}.pickerClass[data-v-c8fe15aa]{box-shadow:0 0 5px 1px rgba(0,0,0,.1);color:#777;border-radius:5px;width:30%}.dateIcon[data-v-c8fe15aa]{position:absolute;right:15px}.mainBox[data-v-c8fe15aa]{margin:0 10px;padding:10px %?30?%;background-color:#007aff;color:#fff;border-radius:10px;display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-orient:vertical;-webkit-box-direction:normal;-webkit-flex-direction:column;flex-direction:column;-webkit-justify-content:space-around;justify-content:space-around;text-align:center;font-size:12px}.mainTop[data-v-c8fe15aa]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between}.mainTopCont[data-v-c8fe15aa]{font-size:24px;font-weight:700;height:35px;line-height:35px}.mainBottom[data-v-c8fe15aa]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;margin-top:15px}.mainBottomCont[data-v-c8fe15aa]{font-size:18px;font-weight:700;height:28px;line-height:28px}.tableBox[data-v-c8fe15aa]{margin:10px;color:#333;border-radius:10px}.tableTitle[data-v-c8fe15aa]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;font-size:13px;font-weight:700;height:30px;line-height:30px;background-color:#eee;border-top-right-radius:5px;border-top-left-radius:5px}.tableList[data-v-c8fe15aa]{display:-webkit-box;display:-webkit-flex;display:flex;-webkit-box-pack:justify;-webkit-justify-content:space-between;justify-content:space-between;font-size:%?25?%;height:%?55?%;line-height:%?55?%;border-bottom:1px solid #f8f8f8}.tableItem[data-v-c8fe15aa]{width:%?100?%}.tableItemLong[data-v-c8fe15aa]{width:%?200?%}',""]),t.exports=e}}]);