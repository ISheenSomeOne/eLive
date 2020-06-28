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
	createPayWay: '', //创建订单的支付方式
	needRefresh: false, //是否需要刷新（订单完成后）
	orderPageNum: 0,//请求订单PageNum
	orderList: [], //订单数组
	orderPageCanReq: true,//订单列表页还有更多数据可以请求
}
const mutations = {
	//请求初始化信息
	req_initCreateInfo(state) {
		common_request({
			url: '/api/zxkj/metting/getRoomTypeByHotelId',
			data: {
				'startTime': state.createOrderDate.before,
				'endTime': state.createOrderDate.after
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.createRoomTypePiker = []
					state.createRoomCount = []
					state.createRoomType = res.data.data
					state.nowRoomType = 0
					state.nowRoomCount = 0
					state.createFormData = ''
					state.createSource = ''

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
	//创建订单的日期改变
	createOrderDateChange(state, val) {
		console.log(val.range)
		if (val.range.after == '') {
			state.createOrderDate = ''
		} else {
			if (Date.parse(val.range.before) > Date.parse(val.range.after)) {
				let temp = val.range.before
				val.range.before = val.range.after
				val.range.after = temp
			} else if (Date.parse(val.range.before) == Date.parse(val.range.after)) {
				state.createOrderDate = ''
				return
			}
			state.createOrderDate = val.range
			this.commit('req_initCreateInfo')
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
	//验证创建订单表单数据
	isFormOK(state) {
		let that = this
		if (state.createOrderDate == '') {
			uni.showModal({
				title: '错误',
				content: '请选择入离日期',
				showCancel: false
			})
		} else if (state.createSource == '') {
			uni.showModal({
				title: '错误',
				content: '请选择订单来源',
				showCancel: false
			})
		} else if (state.nowRoomType == 0) {
			uni.showModal({
				title: '错误',
				content: '请选择订单房型',
				showCancel: false
			})
		} else {
			uni.showModal({
				title: '提示',
				content: '确定创建订单吗？',
				success: function(res) {
					if (res.confirm) {
						that.commit("req_createOrder");
					} else if (res.cancel) {

					}
				}
			});
		}

	},
	//请求创建订单
	req_createOrder(state) {
		let that = this
		state.createFormData.phone == undefined ? state.createFormData.phone = '' : ''
		state.createFormData.remarks == undefined ? state.createFormData.remarks = '' : ''
		common_request({
			url: '/api/zxkj/order/createOTAOrder',
			data: {
				'startTime': state.createOrderDate.before,
				'endTime': state.createOrderDate.after,
				'source': state.createSource,
				'roomType': state.createRoomType[state.nowRoomType].roomTypeId,
				'roomCount': state.createRoomCount[state.nowRoomType][state.nowRoomCount],
				'price': state.createFormData.price,
				'phone': state.createFormData.phone,
				'owner': state.createFormData.name,
				'remarks': state.createFormData.remarks
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.needRefresh = true
					that.commit('req_initCreateInfo')
					uni.showToast({
						title: '创建成功',
						duration: 2000,
					});
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
	//设置为false
	setNeedRefresh(state) {
		state.needRefresh = false
	},
	//请求订单列表
	req_initOrderListInfo(state, val) {
		state.orderPageNum++
		common_request({
			url: '/api/zxkj/order/mobileVersionGetsOrderListData',
			data: {
				'pageNum': state.orderPageNum,
				'pageSize': 30,
				'roomId': '',
				'index': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				console.log(res.data)
				if (res.data.code == 200) {
					if(res.data.data){
						res.data.data.forEach((item) => {
							if(item.source == '美团'){
								item.originClass = 'meituan'
							} else if(item.source == '携程'){
								item.originClass = 'xiecheng'
							} else if(item.source == '微信'){
								item.originClass = 'weixin'
							} else{
								item.originClass = ''
							}
							state.orderList.push(item)
						})
					} else {
						state.orderPageCanReq = false
					}
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
	//重置pageNum
	resetOrderPageNum(state){
		state.orderPageNum = 0
		state.orderList = []
		state.orderPageCanReq = true
	}
}
const actions = {
	initCreateInfo({
		commit
	}) {
		commit("req_initCreateInfo");
	},
	//创建订单
	createOrder({
		commit
	}) {
		commit('isFormOK')
	},
	//初始化订单列表
	initOrderListInfo({
		commit
	}, value) {
		commit('req_initOrderListInfo', value)
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
