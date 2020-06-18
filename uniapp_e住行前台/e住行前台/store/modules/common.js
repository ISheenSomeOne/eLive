const state = {
}
const mutations = {
	//公共请求方法
	common_request(params) {
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
}
const actions = {
	//调用请求
	use_common_request({
		commit
	}) {
		commit("common_request");
	},
}

export default {
	state,
	actions,
	mutations
}
