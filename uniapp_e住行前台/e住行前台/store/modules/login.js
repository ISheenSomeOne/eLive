const state = {
	phoneData: '2', //用户/电话
	passData: '22', //密码
	isRotate: false, //是否加载旋转
}
const mutations = {
	//输入用户名
	setPhoneData(state, val) {
		state.phoneData = val;
	},
	//输入密码
	setPassData(state, val) {
		state.passData = val;
	},
	//登录
	startLogin(state) {
		if (state.isRotate) {
			//判断是否加载中，避免重复点击请求
			return false;
		}
		if (state.phoneData.length == '') {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '用户名不能为空'
			});
			return;
		}
		if (state.passData.length == '') {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '请输入密码'
			});
			return;
		}
		uni_request({
			url: '/api/zxkj/staff/login',
			data: {
				username: 'hdjd',
				password: '123456',
				securityUser: '2'
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				console.log(res.data);
				if (res.data.code == 200) {
					uni.switchTab({
						url: '/pages/home/home'
					});
				}
			}
		});
		state.isRotate = true;
		setTimeout(function() {
			state.isRotate = false;
		}, 3000);
	},
}
const actions = {
	//调用请求
	startLogin({
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
