const state = {}
const mutations = {
	//公共请求方法
	common_request(state, params) {
		/*默认值*/
		params.showLoading = params.showLoading == undefined ? true : params.showLoading;
		params.method = params.method == undefined ? "POST" : params.method;
		params.header = params.header == undefined ? {
			'X-Requested-With': 'XMLHttpRequest'
		} : params.header;
		//请求头里一定要带上用户登录信息,没得商量  
		params.header.token = uni.getStorageSync("token");
		params.header['X-Requested-With'] = 'XMLHttpRequest'
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
				if (res.data.code == 401) {
					uni.showToast({
						title: '登录已过期',
						duration: 2000,
						icon: 'none'
					});
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}, 2000)
				} else if (res.header.authorization != undefined) {
					var token = res.header.authorization;
					//更新token  
					if (token) {
						uni.setStorageSync("token", token);
					}
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
	},
}
const actions = {
	initCreateInfo({
		commit
	}) {
		commit("req_initCreateInfo");
	}
}

export default {
	state,
	actions,
	mutations
}

//公共获取当前时间方法
function getTime(days = 0) {
	var date = new Date(),
		year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate() + days
	month >= 1 && month <= 9 ? (month = "0" + month) : ""
	day >= 0 && day <= 9 ? (day = "0" + day) : ""
	var timer = year + '-' + month + '-' + day
	return timer;
}
