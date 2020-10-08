import home from './home.js'
const state = {
	createExamData: '', //创建考试表单
	unifiedPaymentLink: '', //【统一支付】页面链接
	qr: '', //学生报名二维码图片
	paymentInfo: '',//统一支付页面信息
	eduList: '', //教育列表
	eduListPage: 1,//教育列表下次请求页码
	eduOrderInfo: '',//教育订单详情
	eduDistributionInfo: '',//教育订单分配信息
	eduCarInfo: '', //教育车辆信息
}
const mutations = {
	//创建考试表单数据改变
	createExamChange(state, val) {
		state.createExam = val
		console.log(state.createExam)
	},
	//请求-创建考试
	req_createExam(state, value) {
		let val = value
		val.examSiteList = JSON.stringify(val.examSiteList)
		val.startingList = JSON.stringify(val.startingList)
		common_request({
			url: '/api/zxkj/exam/createExam',
			data: {
				'examName': val.examName,
				'examStartDate': val.examStartDate,
				'examEndDate': val.examEndDate,
				'deadline': val.deadline,
				'examLink': val.examLink,
				'examDirections': val.examDirections,
				'examSiteList': val.examSiteList,
				'startingList': val.startingList,
				'checkinDate': val.checkinDate,
				'checkoutDate': val.checkoutDate,
				'payWay': val.payWay,
				'serviceType': val.serviceType,
				'principal': val.principal,
				'contact': val.contact,
				'allFee': val.allFee,
				'roomFee': val.roomFee,
				'otherFee': val.otherFee,
				'peopleNum': val.peopleNum,
				'remarks': val.remarks,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.navigateTo({
						url: 'createSuccess?examId=' + res.data.data
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
	//请求-成功创建
	req_getExamLinkGroup(state, val) {
		common_request({
			url: '/api/zxkj/exam/getExamLinkGroup',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.qr = res.data.data.qr
					// uni.navigateTo({
					// 	url: 'createSuccess?examId='+res.data.data
					// });
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
	//获取统一支付信息页面
	req_getUnifiedPaymentInfo(state, val) {
		common_request({
			url: '/api/zxkj/exam/getUnifiedPaymentInfo',
			data: {
				'examId': val
			},
			method: 'GET',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					data.examStartDate = formatDate1(true, data.examStartDate)
					data.examEndDate = formatDate1(true, data.examEndDate)
					data.checkinDate = formatDate1(true, data.checkinDate)
					data.checkoutDate = formatDate1(true, data.checkoutDate)
					state.paymentInfo = res.data.data
					// state.qr = res.data.data.qr
					// uni.navigateTo({
					// 	url: 'createSuccess?examId='+res.data.data
					// });
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
	// unifiedPaymentPay(state){
	// 	if (typeof WeixinJSBridge == "undefined"){
	// 	   if( document.addEventListener ){
	// 	       document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
	// 	   }else if (document.attachEvent){
	// 	       document.attachEvent('WeixinJSBridgeReady', onBridgeReady); 
	// 	       document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
	// 	   }
	// 	}else{
	// 	   onBridgeReady();
	// 	}
	// },
	// req_unifiedPaymentPay(state){
	// 	WeixinJSBridge.invoke(
	// 	      'getBrandWCPayRequest', {
	// 	         "appId":"wxa2b9b0e8f700f867",     //公众号名称，由商户传入     
	// 	         "timeStamp": new Date().getTime(), //时间戳，自1970年以来的秒数     
	// 	         "nonceStr":state.paymentInfo.num, //随机串     
	// 	         "package":"prepay_id=u802345jgfjsdfgsdg888",     
	// 	         "signType":"MD5",         //微信签名方式：     
	// 	         "paySign":"70EA570631E4BB79628FBCA90534C63FF7FADD89" //微信签名 
	// 	      },
	// 	      function(res){
	// 	      if(res.err_msg == "get_brand_wcpay_request:ok" ){
	// 	      // 使用以上方式判断前端返回,微信团队郑重提示：
	// 	            //res.err_msg将在用户支付成功后返回ok，但并不保证它绝对可靠。
	// 	      } 
	// 	   }); 
	// },
	
	//重置列表页码
	resetEduList(state) {
		state.eduList = ''
		state.eduListPage = 1
		state.eduListCanReq = true
	},
	
	//获取教育订单列表
	req_getEduList(state) {
		common_request({
			url: '/api/zxkj/exam/getEduList',
			data: {
				'page': state.eduListPage
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					data.examStartDate = formatDate(true, data.examStartDate)
					state.eduList = data
					state.eduListPage++
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
	
	//获取教育订单详情
	req_getEduOrderInfo(state,val) {
		common_request({
			url: '/api/zxkj/exam/getEduOrderInfo',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					data.examStartDate = formatDate(true, data.examStartDate)
					data.examEndDate = formatDate(true, data.examEndDate)
					data.checkinDate = formatDate(true, data.checkinDate)
					data.checkoutDate = formatDate(true, data.checkoutDate)
					data.deadline = formatDate(true, data.deadline)+ ' 23:59:59'
					state.eduOrderInfo = data
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
	
	//获取教育订单分配信息
	req_getEduDistribution(state,val) {
		common_request({
			url: '/api/zxkj/exam/getEduDistribution',
			data: {
				'examId': val.examId,
				'type': val.type
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.eduDistributionInfo = data
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
	
	//
	req_autoDistribution(state,val) {
		common_request({
			url: '/api/zxkj/exam/autoDistribution',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
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
	
	//获取车辆信息
	req_getCarInfo(state,val) {
		common_request({
			url: '/api/zxkj/exam/getCarInfo',
			data: {
				'carId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.eduCarInfo = data
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
	
	//添加车辆信息
	req_addCarInfo(state,val) {
		val = JSON.stringify(val)
		common_request({
			url: '/api/zxkj/exam/addCarInfo',
			data: {
				 'numbering': val.numbering,
				 'carNumber': val.carNumber,
				 'driver': val.driver,
				 'contact': val.contact,
				 'peopleNum': val.peopleNum
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
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
	
	//修改车辆信息
	req_updateCarInfo(state,val) {
		let carId = JSON.stringify(val.carId)
		let carInfo = JSON.stringify(val.carInfo)
		
		common_request({
			url: '/api/zxkj/exam/updateCarInfo',
			data: {
				'carId': val.carId,
				 'numbering': carInfo.numbering,
				 'carNumber': carInfo.carNumber,
				 'driver': carInfo.driver,
				 'contact': carInfo.contact,
				 'peopleNum': carInfo.peopleNum
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
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
	
	//删除车辆信息
	req_delEduCar(state,val) {
		common_request({
			url: '/api/zxkj/exam/delEduCarInfo',
			data: {
				'carId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
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
	
	//创建订单的支付方式改变
	payWayChange(state, val) {
		if (val == '选择方式') {
			state.createPayWay = ''
		} else {
			state.createPayWay = val
		}
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
	createExam({
		commit
	}, value) {
		commit("req_createExam", value);
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

//格式化时间为yyyy-MM-dd
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

//格式化时间为yyyy年MM月dd日
function formatDate1(needYear, date) {
	var d = new Date(date)
	var month = '' + (d.getMonth() + 1)
	var day = '' + d.getDate()
	if (needYear) {
		var year = d.getFullYear()
	}

	if (needYear) {
		return year + '年' + month + '月' + day + '日'
	}
	return month + '月' + day + '日'
}
