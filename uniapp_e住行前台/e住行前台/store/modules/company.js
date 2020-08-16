import store from '../index.js'
const state = {
	companyId: '', //公司Id
	companyData: {
		companyName: '',
		companyAdd: '',
		linkman: '',
		tel: '',
		img: '',
		createTime: '',
		orderCount: '',
		link: '',
		state: true,
		qr: ''
	}, //创建公司表单数据
	companyList: [], //公司列表
	companyInfo: '', //公司详情
	normalCount: '', //正常状态数量
}
const mutations = {
	//改变setCompanyId
	setCompanyId(state, val) {
		state.companyId = val
	},
	//改变companyData
	setCompanyData(state, val) {
		state.companyData = val
	},
	//清除companyId
	delCompanyId(state, val) {
		state.companyId = ''
	},
	
	//请求初始化公司列表
	req_initCompanyList(state) {
		common_request({
			url: '/api/zxkj/company/getCompanyList',
			data: {
			},
			success: (res) => {
				if (res.data.code == 200) {
					let normalCount = 0
					res.data.data.forEach((item)=>{
						item.state == 0 ? normalCount++ : ''
					})
					state.normalCount = normalCount
					state.companyList = res.data.data
					
				} else {
					uni.showModal({
						title: '提示',
						content: '服务器错误',
						showCancel: false
					})
				}
			},
		})
	},
	//请求初始化公司详情
	req_initCompanyInfo(state) {
		common_request({
			url: '/api/zxkj/company/getCompanyInfo',
			data: {
				'companyId': state.companyId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					console.log(res.data.data)
					state.companyInfo = res.data.data
				} else {
					uni.showModal({
						title: '提示',
						content: '服务器错误',
						showCancel: false
					})
				}
			},
		})
	},
	//请求创建协议公司
	req_createCompany(state) {
		if (state.companyData.name == '') {
			uni.showToast({
				icon: 'none',
				title: '请填写公司名称',
				duration: 2000
			});
			return
		}
		if (state.companyData.add == '') {
			uni.showToast({
				icon: 'none',
				title: '请填写公司地址',
				duration: 2000
			});
			return
		}
		if (state.companyData.person == '') {
			uni.showToast({
				icon: 'none',
				title: '请填写公司联系人',
				duration: 2000
			});
			return
		}
		if (state.companyData.contact == '') {
			uni.showToast({
				icon: 'none',
				title: '请填写联系方式',
				duration: 2000
			});
			return
		}
		// common_requestUpload({
		// 	url: '/api/zxkj/company/createCompany',
		// 	filePath: state.companyData.license,
		// 	name: state.companyData.name,
		// 	formData: {
		// 		'companyName': state.companyData.name,
		// 		'companyAdd': state.companyData.add,
		// 		'linkman': state.companyData.person,
		// 		'tel': state.companyData.contact
		// 	},
		// 	success: (res) => {
		// 		if (res.data.code == 200) {

		// 		} else {
		// 			uni.showModal({
		// 				title: '提示',
		// 				content: '服务器错误',
		// 				showCancel: false
		// 			})
		// 		}
		// 	},
		// })
		
		common_request({
			url: '/api/zxkj/company/createCompany',
			data: {
				'companyName': state.companyData.companyName,
				'companyAdd': state.companyData.companyAdd,
				'linkman': state.companyData.linkman,
				'tel': state.companyData.tel
			},
			success: (res) => {
				if (res.data.code == 200) {
					console.log(res.data.data)
				} else {
					uni.showModal({
						title: '提示',
						content: '服务器错误',
						showCancel: false
					})
				}
			},
		})
	},
	//请求修改协议公司信息
	// req_updateCompany(state) {
	// 	common_request({
	// 		url: '/api/zxkj/company/updateCompany',
	// 		data: {
	// 			'name': state.firstDate,
	// 			'linkman': state.lastDate,
	// 			'tel': state.firstDate,
	// 			'add': state.firstDate
	// 		},
	// 		header: {
	// 			'content-type': 'application/x-www-form-urlencoded'
	// 		},
	// 		success: (res) => {
	// 			if (res.data.code == 200) {
	// 				let data = res.data.data
	// 				console.log(data)
	// 			} else {
	// 				uni.showModal({
	// 					title: '提示',
	// 					content: '服务器错误',
	// 					showCancel: false
	// 				})
	// 			}
	// 		},
	// 	})
	// }
}
const actions = {
	//创建协议公司
	createCompany({
		commit
	}) {
		commit("req_createCompany");
	},
	//修改协议公司信息
	updateCompany({
		commit
	}) {
		commit("req_updateCompany");
	},
	//初始化公司列表
	initCompanyList({
		commit
	}) {
		commit("req_initCompanyList");
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
			if (res.data.code == 401) {
				uni.showToast({
					title: '登录已过期',
					duration: 2000,
					icon: 'none'
				});
				//删除当前用户的数据,并切换用户
				delete userListJson[current];
				uni.setStorageSync("userList", userListJson);
				if (Object.keys(userListJson).length === 0) {
					uni.setStorageSync('autoLogin', false)
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
					userListJson[current] = token;
					uni.setStorageSync("userList", userListJson);

					//更新登录列表
					state.loginData = []
					for (let key in userListJson) {
						state.loginData.push(key)
					}
				}
				//执行success方法
				params.success(res);
			} else {
				//执行success方法
				params.success(res);
			}
		},
		complete: () => {
			if (params.showLoading) {
				uni.hideLoading();
			}
		}
	});
}


//公共文件上传请求方法
function common_requestUpload(params) {
	/*默认值*/
	params.showLoading = params.showLoading == undefined ? true : params.showLoading;
	params.method = params.method == undefined ? "POST" : params.method;
	params.header = params.header == undefined ? {
		'Content-type': 'multipart/form-data'
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
	params.header['Content-type'] = 'multipart/form-data'
	/**/
	if (params.showLoading) {
		uni.showLoading({
			mask: true,
			title: (params.showLoadingTitle ? params.showLoadingTitle : "加载中...")
		});
	}
	uni.uploadFile({
		url: params.url,
		filePath: params.filePath,
		header: params.header,
		method: params.method,
		name: params.fileName,
		formData: params.data,
		success: (res) => {
			if (res.data.code == 401) {
				uni.showToast({
					title: '登录已过期',
					duration: 2000,
					icon: 'none'
				});
				//删除当前用户的数据,并切换用户
				delete userListJson[current];
				uni.setStorageSync("userList", userListJson);
				if (Object.keys(userListJson).length === 0) {
					uni.setStorageSync('autoLogin', false)
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
					userListJson[current] = token;
					uni.setStorageSync("userList", userListJson);

					//更新登录列表
					state.loginData = []
					for (let key in userListJson) {
						state.loginData.push(key)
					}
				}
				//执行success方法
				params.success(res);
			} else {
				//执行success方法
				params.success(res);
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

//公共获取当前时间方法
function getTime(days = 0) {
	let date = new Date()
	date = new Date(date.setDate(date.getDate() + days))
	let year = date.getFullYear(),
		month = date.getMonth() + 1,
		day = date.getDate()
	month >= 1 && month <= 9 ? (month = "0" + month) : ""
	day >= 0 && day <= 9 ? (day = "0" + day) : ""
	var timer = year + '-' + month + '-' + day
	return timer;
}

//公共格式化请求时间方法
function formatReqDate(date, first) {
	let resData = ''
	if (first) {
		resData = new Date(date).setHours(0, 0, 0, 0)
	} else {
		resData = new Date(date).setHours(23, 59, 59, 999)
	}
	return resData
}

//格式化时间为yy-MM-dd
function formatDate(needYear, date) {
	var d = new Date(date)
	var month = '' + (d.getMonth() + 1)
	var day = '' + d.getDate()
	if (needYear) {
		var year = d.getFullYear()
	}

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;

	if (needYear) {
		return [year, month, day].join('-');
	}
	return [month, day].join('-');
}
