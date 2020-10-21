import Vue from 'vue'
import App from './App'
import store from './store/index.js'

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()

const api = 'https://zxkj.webinn.online'

//仅支持微信小程序、支付宝小程序、App 平台
// const unipayIns = unipay.initWeixin({
//   appId: 'wx68064214de16779e',
//   mchId: '1503420871',
//   key: 'you parterner key',
//   // pfx: fs.readFileSync('/path/to/your/pfxfile'), // p12文件路径，使用微信退款时需要，需要注意的是阿里云目前不支持以相对路径读取文件，请使用绝对路径的形式
// })


Vue.prototype.common_request = function(params){
	console.log('9999')
    /*默认值*/
    params.showLoading = params.showLoading == undefined ? true : params.showLoading;
    params.method = params.method == undefined ? "POST" : params.method;
    params.header = params.header == undefined ? {
    	'X-Requested-With': 'XMLHttpRequest'
    } : params.header;
    //请求头里一定要带上用户登录信息,没得商量  
    if (params.header.token == undefined || params.header.token == "") {
    	params.header.token = JSON.stringify({
    		"token": uni.getStorageSync("token")
    	});
    }
    /**/
    if (params.showLoading) {
    	uni.showLoading({
    		mask: true,
    		title: (params.showLoadingTitle ? params.showLoadingTitle : "加载中...")
    	});
    }
    uni.request({
    	url: params.url,
    	data: params.data,
    	header: params.header,
    	method: params.method,
    	success: (res) => {
    		var status = res.data.status;
    		var data = res.data.info;
    		var token = res.header.token;
    		//更新token  
    		if (token) {
    			var token = uni.getStorageSync("token");
    			uni.setStorageSync("token", token);
    		}
    		//执行success方法
    		params.success(res);
    	},
    	complete: () => {
    		if (params.showLoading) {
    			uni.hideLoading();
    		}
    	}
    });
}
