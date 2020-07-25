import store from '../index.js'
const state = {
	username: '', //用户/电话
	password: '', //密码
	isRotate: false, //是否加载旋转
	loginData: [], //登录信息
	loginIndex: 0, //登录列表下标
}
const mutations = {
	//初始化用户信息
	initUserInfo(state) {
		state.username = uni.getStorageSync('username')
		state.password = uni.getStorageSync('password')
	},
	//初始化登录信息
	initLoginData(state) {
		let current = uni.getStorageSync('userList')
		let userList = uni.getStorageSync('userList')
		//更新登录列表
		state.loginData = []
		for (let key in userList) {
			state.loginData.push(key)
		}
		for(let i=0;i<state.loginData.length;i++){
			if(state.loginData[i] == current){
				state.loginIndex = i
			}
		}
	},
	//切换登录用户
	loginChange(state, val) {
		state.loginIndex = val
		uni.setStorageSync('current', state.loginData[val])
		uni.reLaunch({
			url: '/pages/home/home'
		});
	},
	//判断是否自动登录
	isLogin(state) {
		let userList = uni.getStorageSync('userList')

		if (uni.getStorageSync('autoLogin')) {
			if (userList != '' && userList != null && userList != undefined && userList != '{}') {
				uni.reLaunch({
					url: '/pages/home/home'
				});
			} else {
				this.commit('initUserInfo')
			}
		} else {
			this.commit('initUserInfo')
		}

	},
	//输入用户名
	setPhoneData(state, val) {
		state.username = val;
	},
	//输入密码
	setPassData(state, val) {
		state.password = val;
	},
	//登录
	req_login(state) {
		if (state.isRotate) {
			//判断是否加载中，避免重复点击请求
			return false;
		}
		if (state.username.length == '') {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '用户名不能为空'
			});
			return;
		}
		if (state.password.length == '') {
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '请输入密码'
			});
			return;
		}
		//调用请求方法
		common_request({
			url: '/api/zxkj/staff/login',
			data: {
				username: state.username,
				password: state.password,
				securityUser: '2'
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.setStorageSync("current", state.username);
					uni.setStorageSync('username', state.username)
					uni.setStorageSync('password', state.password)
					uni.setStorageSync('autoLogin', true)
					uni.switchTab({
						url: '/pages/home/home'
					});
				} else if (res.data.code == -1) {
					uni.showToast({
						title: res.data.msg,
						duration: 2000,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '服务器错误',
						duration: 2000,
						icon: 'none'
					});
				}
			},
		})
		state.isRotate = true;
		setTimeout(function() {
			state.isRotate = false;
		}, 3000);
	},
	//退出登录
	req_logout(state) {
		common_request({
			url: '/api/zxkj/exit',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let userList = uni.getStorageSync("userList");
					//删除当前用户的数据,并切换用户
					delete userList[uni.getStorageSync('current')];
					if (Object.keys(userList).length === 0) {
						uni.reLaunch({
							url: '/pages/login/login'
						});
						uni.setStorageSync('autoLogin', false)
					} else {
						uni.setStorageSync("current", getFirstAttr(userList));
						uni.setStorageSync("userList", userList);
						uni.reLaunch({
							url: '/pages/home/home'
						});
					}
				} else {
					uni.showToast({
						title: '服务器错误',
						duration: 2000,
						icon: 'none'
					});
				}
			},
		})
	},
	//退出全部登录
	logoutAll(state) {
		uni.setStorageSync('userList','')
		uni.setStorageSync('autoLogin',false)
		uni.reLaunch({
			url: '/pages/login/login'
		});
	},
}
const actions = {
	//登录
	startLogin({
		commit
	}) {
		commit("req_login");
	},
	//退出登录
	logout({
		commit
	}) {
		commit("req_logout");
	},
}

export default {
	state,
	actions,
	mutations
}

//公共请求方法
function common_request(params) {
	/*默认值*/
	params.showLoading = params.showLoading == undefined ? true : params.showLoading;
	params.method = params.method == undefined ? "POST" : params.method;
	params.header = params.header == undefined ? {
		'X-Requested-With': 'XMLHttpRequest'
	} : params.header;
	//请求头里一定要带上用户登录信息,没得商量,从userList里面获取token,根据当前用户
	let userList = uni.getStorageSync("userList");
	let current = uni.getStorageSync("current");
	let userListJson = null;
	if (userList == '' || userList == null || userList == undefined || userList == '{}') {
		userList = "{}";
		userListJson = JSON.parse(userList);
	} else {
		userListJson = userList
	}
	params.header.token = userListJson[current];
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
			//执行success方法
			params.success(res);
			if (res.data.code == 401) {
				uni.showToast({
					title: '登录已过期',
					duration: 2000,
					icon: 'none'
				});
				//删除当前用户的数据,并切换用户
				delete userListJson[current];
				uni.setStorageSync("userList", JSON.stringify(userListJson));
				if (Object.keys(userListJson).length === 0) {
					setTimeout(() => {
						uni.reLaunch({
							url: '/pages/login/login'
						});
					}, 2000)
				} else {
					uni.setStorageSync("current", getFirstAttr(userListJson));
					uni.reLaunch({
						url: '/pages/home/home'
					});
				}
			} else if (res.header.authorization != undefined) {
				var token = res.header.authorization;
				current = uni.getStorageSync("current");
				//更新token  
				if (token) {
					console.log(typeof(userListJson))
					userListJson[current] = token;
					uni.setStorageSync("userList", userListJson);

					//更新登录列表
					state.loginData = []
					for (let key in userListJson) {
						state.loginData.push(key)
					}
				}
			}
		},
		complete: () => {
			if (params.showLoading) {
				uni.hideLoading();
			}
		}
	});
}
// 封装一个方法，对json进行循环，实际上执行一次就return了，返回第一个属性
function getFirstAttr(obj) {
	for (var k in obj) {
		return k;
	}
}
