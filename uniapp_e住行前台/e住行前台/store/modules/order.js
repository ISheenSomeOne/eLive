const state = {
	createOrderDate: {
		'before': getTime(),
		'after': getTime(1)
	}, //创建订单的入离日期
	createSource: '', //创建订单的来源
	createFormData: '', //创建订单的form表单数据
	createRoomType: '', //创建订单的房型数据
	createRoomTypePiker: '', //创建订单的房型piker数据
	nowRoomType: 0, //创建订单现在选择的房型Index
	createRoomCount: '', //创建订单可选房间数量数组
	nowRoomCount: 0, //创建订单现在选择的房间数量Index，需要配合上面nowRoomType使用
	createPayWay: '',//创建订单的支付方式
}
const mutations = {
	//请求初始化信息
	req_initCreateInfo(state) {
		common_request({
			url: '/api/zxkj/metting/getRoomTypeByHotelId',
			data: {
				'startTime': getTime(),
				'endTime': getTime(1)
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				// console.log(res.data)
				state.createRoomTypePiker = []
				state.createRoomCount = []
				state.createRoomType = res.data

				state.createRoomType.forEach((item) => {
					let countList = []
					state.createRoomTypePiker.push(item.name)
					for (let i = 1; i <= item.roomCount; i++) {
						countList.push(i)
					}
					state.createRoomCount.push(countList)
				})
				state.createRoomTypePiker.unshift('选择房型')
				state.createRoomCount.unshift(['请先选择房型'])
				// if (res.data.code == 200) {
				// 	uni.switchTab({
				// 		url: '/pages/login/login'
				// 	});
				// } else {
				// 	uni.showToast({
				// 		title: '服务器错误',
				// 		duration: 2000,
				// 		icon: 'none'
				// 	});
				// }
			},
		})
	},
	//创建订单的日期改变
	createOrderDateChange(state, val) {
		if (val.range.after == '') {
			state.createOrderDate = ''
		} else {
			state.createOrderDate = val.range
		}
	},
	//创建订单的来源改变
	originChange(state, val) {
		if (val == '选择来源') {
			state.createSource = ''
		} else {
			state.createSource = val
		}
	},
	//创建订单的支付方式改变
	payWayChange(state, val) {
		if (val == '选择方式') {
			state.createPayWay = ''
		} else {
			state.createPayWay = val
		}
	},
	//创建订单表单数据改变
	formDataChange(state, val) {
		state.createFormData = val
	},
	//创建订单选择的房型变化
	roomTypeChange(state, val) {
		state.nowRoomType = val
		state.nowRoomCount = 0
	},
	//创建订单房间数变化
	roomCountChange(state, val) {
		state.nowRoomCount = val
	},
}
const actions = {
	initCreateInfo({
		commit
	}, value) {
		commit("req_initCreateInfo");
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
	//请求头里一定要带上用户登录信息,没得商量  
	params.header.token = JSON.stringify({
		"token": uni.getStorageSync("token")
	});
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
					uni.switchTab({
						url: '/pages/login/login'
					});
				}, 2000)
			} else {
				var token = res.header.token;
				//更新token  
				if (token) {
					var token = uni.getStorageSync("token");
					uni.setStorageSync("token", token);
				}
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
