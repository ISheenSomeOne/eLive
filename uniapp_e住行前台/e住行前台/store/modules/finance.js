import store from '../index.js'
const state = {
	datePikerIndex: 0, //日期index
	financeDate: {
		'before': getTime(),
		'after': getTime()
	}, //财务页面日期
	firstDate: '', //第一个时间
	lastDate: '', //第二个时间
	hejiData: '', //合计数据
	listData: '', //列表数据
	dateData: '', //日期数据
	orderData: '', //因接口原因，为一个数据准备的
}
const mutations = {
	//财务页面日期选择器index
	financeDateChange(state, val) {
		state.datePikerIndex = val
		let now = new Date()
		let before = new Date()
		let cut = 0
		if (state.datePikerIndex == 0) {
			cut = 0
		} else if (state.datePikerIndex == 1) {
			cut = 1
			before = before.setDate(now.getDate() - cut)
			state.firstDate = formatReqDate(before, true)
			state.lastDate = formatReqDate(before, false)
			state.financeDate = {
				'before': formatDate(true, before),
				'after': formatDate(true, before)
			}
			this.commit('req_financeInit')
			return
		} else if (state.datePikerIndex == 2) {
			cut = 6
		} else if (state.datePikerIndex == 3) {
			cut = 29
		} else if (state.datePikerIndex == 4) {
			cut = 364
		} else if (state.datePikerIndex == 5) {
			return
		}
		before = before.setDate(now.getDate() - cut)
		state.firstDate = formatReqDate(before, true)
		state.lastDate = formatReqDate(now, false)
		state.financeDate = {
			'before': formatDate(true, before),
			'after': formatDate(true, now)
		}
		this.commit('req_financeInit')
	},
	//财务页面日期选择确定
	financeDateConfirm(state, val) {
		if (val.range.after == '') {
			state.financeDate = ''
		} else {
			if (Date.parse(val.range.before) > Date.parse(val.range.after)) {
				let temp = val.range.before
				val.range.before = val.range.after
				val.range.after = temp
			} else if (Date.parse(val.range.before) == Date.parse(val.range.after)) {
				state.financeDate = {
					'before': val.range.before,
					'after': val.range.after
				}
			}
			state.datePikerIndex = 5
			state.firstDate = formatReqDate(val.range.before, true)
			state.lastDate = formatReqDate(val.range.after, false)
			state.financeDate = val.range
			this.commit('req_financeInit')
		}
	},
	//初始化财务页面
	financeInit(state) {
		let now = new Date()
		state.firstDate = formatReqDate(now, true)
		state.lastDate = formatReqDate(now, false)
		state.datePikerIndex = 0
		this.commit('req_financeInit')
	},
	//请求初始化财务页面
	req_financeInit(state) {
		//1
		common_request({
			url: '/api/zxkj/echarts/getOccupancyStatistics',
			method: 'GET',
			data: {
				'start': state.firstDate,
				'end': state.lastDate
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
		
					//格式化显示数字
					data.otherData.totalRent = data.otherData.totalRent.toFixed(2)
					data.otherData.totalAverageHousingPrice = data.otherData.totalAverageHousingPrice.toFixed(2)
		
					state.hejiData = data.otherData
					state.listData = data.multiwireAmount
					state.dateData = data.abscissaName
				} else {
					uni.showModal({
						title: '提示',
						content: '服务器错误',
						showCancel: false
					})
				}
			},
		})
		//因接口原因，为实际营收数据请求
		common_request({
			url: '/api/zxkj/echarts/orderPriceStatistics',
			method: 'GET',
			data: {
				'start': state.firstDate,
				'end': state.lastDate
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
		
					//格式化显示数字
					data.otherData.total = data.otherData.total.toFixed(2)
					state.orderData = data
				} else {
					uni.showModal({
						title: '提示',
						content: '服务器错误',
						showCancel: false
					})
				}
			},
		})
	}
}
const actions = {
	//登录
	startLogin({
		commit
	}) {
		commit("req_login");
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
					},2000)
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
