import home from './home.js'
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
	orderPageNum: 0, //请求订单PageNum
	orderList: [], //订单数组
	orderPageCanReq: true, //订单列表页还有更多数据可以请求
	orderId: '', //现在选择的orderid
	needResetHeight: false, //需要重新定义高度
	orderDetailInfo: '', //订单详情信息
	addedDays: 1, //续房天数
	continuePrice: '', //续房金额
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
					state.createRoomType.unshift({
						'none': ''
					})
					//等待浏览器渲染
					setTimeout(() => {
						state.needResetHeight = true
					}, 20)
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
		// console.log(val.range)
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
		state.createFormData.remarks == undefined ? state.createFormData.remarks = '' : '',
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
		let roomId = ''
		if (home.state.nowRoom.id != undefined) {
			// console.log(home.state.nowRoom.id != undefined)
			roomId = home.state.nowRoom.id
		}
		common_request({
			url: '/api/zxkj/order/mobileVersionGetsOrderListData',
			data: {
				'pageNum': state.orderPageNum,
				'pageSize': 30,
				'roomId': roomId,
				'index': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					if (res.data.data != false) {
						res.data.data.forEach((item) => {
							if (item.source == '美团') {
								item.originClass = 'meituan'
							} else if (item.source == '携程') {
								item.originClass = 'xiecheng'
							} else if (item.source == '微信') {
								item.originClass = 'weixin'
							} else {
								item.originClass = ''
							}
							item.checkin = formatDate(false, item.checkin)
							item.checkout = formatDate(false, item.checkout)
							state.orderList.push(item)
						})
						//等待浏览器渲染
						setTimeout(() => {
							state.needResetHeight = true
						}, 5)
					} else {
						uni.showToast({
							title: '没有更多了',
							duration: 2000,
							icon: 'none'
						});
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
	//关闭重置
	resetHeightFalse(state) {
		state.needResetHeight = false
	},
	//重置pageNum
	resetOrderPageNum(state, val) {
		state.orderPageNum = 0
		state.orderList = []
		state.orderPageCanReq = true
		if (val) {
			home.state.nowRoom = {}
		}
	},
	//请求初始化订单详情页面
	req_initOrderDetailInfo(state, val) {
		if (val == '') {} else {
			state.orderId = val
		}
		common_request({
			url: '/api/zxkj/order/mobileVersionGetOrderDetail',
			data: {
				'orderId': state.orderId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					//格式化创建时间
					data.createTime = data.createTime.replace(/T/, ' ')
					//state赋值
					if (data.state == 51) {
						data.stateName = '待付款'
						data.stateClass = 'bgYellow'
					} else if (data.state == 52) {
						data.stateName = '待入住'
						data.stateClass = 'bgYellow'
					} else if (data.state == 112) {
						data.stateName = '入住中'
						data.stateClass = 'bgGreen'
					} else if (data.state == 62) {
						data.stateName = '待退款'
						data.stateClass = 'bgRed'
					} else if (data.state == 63) {
						data.stateName = '订单完成'
						data.stateClass = 'bgGreen'
					} else if (data.state == 54) {
						data.stateName = '交易取消'
						data.stateClass = 'name'
					}

					for (let i = 0; i < data.roomTypeList.length; i++) {
						data.roomTypeList[i].checkin = formatDate(false, data.roomTypeList[i].checkin)
						data.roomTypeList[i].checkout = formatDate(false, data.roomTypeList[i].checkout)
					}
					state.orderDetailInfo = data
					console.log(state.orderDetailInfo)
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
	//请求退押金
	req_refund(state, val) {
		let that = this
		common_request({
			url: '/api/zxkj/refundApplication/confirmRefund',
			data: {
				'id': val.id,
				'refundPrice': val.refundPrice
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '退款成功',
						duration: 2000
					});
					that.commit('req_initOrderDetailInfo', '')
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
	//续房天数改变
	continueDays(state, val) {
		state.addedDays = val
		this.commit('req_continueDays')
	},
	//请求根据续房天数是否可以续房
	req_continueDays(state) {
		common_request({
			url: '/api/zxkj/room/mayRenewTheRoom',
			data: {
				'roomId': home.state.nowRoom.id,
				'addedDays': state.addedDays
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {} else if (res.data.code == -1) {
					uni.showModal({
						title: '提示',
						content: res.data.msg,
						showCancel: false
					})
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
	//续房金额改变
	setContinuePrice(state, val) {
		state.continuePrice = val
	},
	//请求续房
	req_confirmContinue(state) {
		common_request({
			url: '/api/zxkj/room/continuedHousingOperation',
			data: {
				'roomId': home.state.nowRoom.id,
				'addedDays': state.addedDays,
				'additionalRoomRates': state.continuePrice
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '续房成功',
						duration: 2000
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
	//初始化订单详情列表
	initOrderDetailInfo({
		commit
	}, value) {
		commit('req_initOrderDetailInfo', value)
	},
	//退押金
	refund({
		commit
	}, value) {
		commit('req_refund', value)
	},
	// 提交续房
	confirmContinue({
		commit
	}) {
		commit('req_confirmContinue')
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
					state.loginData = uni.getStorageInfoSync('userList')
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
