import home from './home.js'
const state = {
	createExamData: '', //创建考试表单
	unifiedPaymentLink: '', //【统一支付】页面链接
	qr: '', //学生报名二维码图片
	paymentInfo: '', //统一支付页面信息
	eduList: '', //教育列表
	eduListPage: 1, //教育列表下次请求页码
	eduOrderInfo: '', //教育订单详情
	eduDistributionInfo: '', //教育订单分配信息
	eduCarInfo: '', //教育车辆信息
	eduHotelInfo: '', //教育酒店信息
	navigateBack: false, //返回上一级
	eduHotelRoom: '', //教育酒店房间信息
	eduDistributionMax: '', //获取用户列表的最大值
	eduDistributionItem: '', //获取用户列表
	needRefresh: false, //页面需要刷新
	eduUserInfo: '', //教育用户信息
	unassignedList: '', //未分配用户列表
	remindContent: '', //提醒的内容
	travel: '', //考试行程
	needFeedback: false, //是否需要反馈
	unifiedPaymentPaid: false, //订单已支付
	eduListHaveMore: true, //教育订单列表能否获取
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
						url: 'createSuccess?examId=' + res.data.data + '&payWay=' + val.payWay
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
					state.qr = 'https://zxkj.webinn.online/zxkj/' + res.data.data.qr
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

	//判断这个订单是否需要付款
	req_howMuchDoesThisOrderCost(state, val) {
		common_request({
			url: '/api/zxkj/exam/howMuchDoesThisOrderCost',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.unifiedPaymentPaid = false
				} else if (res.data.code == 202) {
					state.unifiedPaymentPaid = true
					uni.showModal({
						title: '提示',
						content: '订单已支付',
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
					// url: 'createSuccess?examId='+res.data.data
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

	//统一支付-微信支付
	unifiedPaymentPay(state, val) {
		//获取openId
		alert('获取openid开始')
		common_request({
			url: '/wxPay/connect/oauth2/authorize',
			data: {
				appid: 'wx68064214de16779e',
				redirect_uri: 'https://group.webinn.online/phone',
				// redirect_uri: 'https%3a%2f%2fzxkj.webinn.online%2fzxkj',
				response_type: 'code',
				scope: 'snsapi_base',
				state: 'STATE#wechat_redirect'
			},
			method: 'GET',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				alert(res)
				//上线测试
				// if (res.data.code == 200) {

				// } else {
				// 	uni.showModal({
				// 		title: '提示',
				// 		content: '服务器错误',
				// 		showCancel: false
				// 	})
				// }
			},
		})
	},

	//申请订单
	req_examOrderPay(state, val) {
		common_request({
			url: '/api/zxkj/exam/examOrderPay',
			data: {
				'examId': val,
				'openId': ''
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					// WeixinJSBridge.invoke(
					// 	'getBrandWCPayRequest', {
					// 		"appId": 'wx68064214de16779e', //公众号名称，由商户传入
					// 		"timeStamp": res.data.data.timeStamp, //时间戳     
					// 		"nonceStr": res.data.data.nonceStr, //随机串     
					// 		"package": res.data.data.package,
					// 		"signType": res.data.data.signType, //微信签名方式：     
					// 		"paySign": res.data.data.paySign //微信签名 
					// 	},
					// 	function(ress) {
					// 		if (ress.err_msg == "get_brand_wcpay_request:ok") {
					// 			uni.showToast({
					// 				icon: 'success',
					// 				title: '支付成功'
					// 			})
					// 			setTimeout(() => {
					// 				uni.navigateBack({
					// 					delta: 2
					// 				})
					// 			}, 500);
					// 		} else if (ress.err_msg == "get_brand_wcpay_request:cancel") {
					// 			uni.showToast({
					// 				icon: "none",
					// 				title: "'已取消支付"
					// 			})
					// 		} else {
					// 			uni.showToast({
					// 				icon: "none",
					// 				title: "支付失败"
					// 			})
					// 		}
					// 	}
					// );
					uni.navigateTo({
						url: 'createSuccess?examId=' + val
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

	//重置列表页码
	resetEduList(state) {
		state.eduList = []
		state.eduListPage = 1
		state.eduListHaveMore = true
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
					if (state.eduListHaveMore) {
						for (let i = 0; i < data.length; i++) {
							data[i].examStartDate = formatDate(true, data[i].examStartDate)
							state.eduList.push(data[i])
						}
						if (data.length < 20) {
							state.eduListHaveMore = false
							uni.showToast({
								title: '没有更多了',
								duration: 2000,
								icon: 'none'
							});
						}
						// state.eduList = data
						state.eduListPage++
					}
				} else {
					uni.showToast({
						title: '没有更多了',
						duration: 2000,
						icon: 'none'
					});
				}
			},
		})
	},

	//获取教育订单详情
	req_getEduOrderInfo(state, val) {
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
					console.log(data)
					data.examSiteList = JSON.parse(data.examSiteList)
					data.startingList = JSON.parse(data.startingList)
					data.examStartDate = formatDate(true, data.examStartDate)
					data.examEndDate = formatDate(true, data.examEndDate)
					data.checkinDate = formatDate(true, data.checkinDate)
					data.checkoutDate = formatDate(true, data.checkoutDate)
					data.deadline = formatDate(true, data.deadline) + ' 23:59:59'
					if (data.state == '交易取消') {
						data.stateClass = 'bgRed'
					} else if (data.state == '入住中' || data.state == '已完成') {
						data.stateClass = 'bgGreen'
					} else {
						data.stateClass = 'bgYellow'
					}
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
	req_getEduDistribution(state, val) {
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

	//自动分配
	req_autoDistribution(state, val) {
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
	req_getCarInfo(state, val) {
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
	req_addCarInfo(state, val) {
		let form = JSON.stringify(val.form)
		common_request({
			url: '/api/zxkj/exam/addCarInfo',
			data: {
				'examId': val.examId,
				'numbering': form.numbering,
				'carNumber': form.carNumber,
				'driver': form.driver,
				'contact': form.contact,
				'peopleNum': form.peopleNum
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
	req_updateCarInfo(state, val) {
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
	req_delEduCar(state, val) {
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

	//获取教育订单酒店房间信息
	req_getEduHotel(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduHotel',
			data: {
				'examId': val.examId,
				'hotelId': val.eduHotelId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.eduHotelInfo = data
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

	//添加教育订单酒店信息
	req_makeAddHotelLink(state, val) {
		common_request({
			url: '/api/zxkj/exam/makeAddHotelLink',
			data: {
				'examId': val.examId,
				'hotelId': val.eduHotelId,
				'roomCount': val.roomCount
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.navigateBack = true

					setTimeout(() => {
						state.navigateBack = false
					}, 1000)
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

	//获取需要添加的酒店房型房间信息
	req_getEduHotelRoom(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduHotelRoom',
			data: {
				'examId': val.examId,
				'hotelId': val.eduHotelId,
				'roomTypeId': val.roomTypeId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.eduHotelRoom = data
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

	//添加的酒店房型房间信息
	req_addEduHotelRoom(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduHotelRoom',
			data: {
				'examId': val.examId,
				'hotelId': val.eduHotelId,
				'roomList': val.roomList
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {

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

	//获取分类下的用户列表
	req_getEduUserList(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduUserList',
			data: {
				'examId': val.examId,
				'carId': val.carId,
				'roomId': val.roomId,
				'startingId': val.startingId,
				'examSiteId': val.examSiteId,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.eduDistributionMax = res.data.data.max
					state.eduDistributionItem = res.data.data.userList
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

	//删除用户列表中的一个
	req_delEduUserListItem(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduUserList',
			data: {
				'examId': val.examId,
				'carId': val.carId,
				'roomId': val.roomId,
				'startingId': val.startingId,
				'examSiteId': val.examSiteId,
				'memberId': val.memberId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '删除成功',
						duration: 2000,
						icon: 'success'
					});
					state.needRefresh = true
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

	//改变页面更新状态
	changeNeedRefresh(state) {
		state.needRefresh = !state.needRefresh
	},

	//获取教育用户信息
	req_getEduUserInfo(state, val) {
		common_request({
			url: '/api/zxkj/exam/getEduUserInfo',
			data: {
				'examId': val.examId,
				'memberId': val.memberId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.eduUserInfo = res.data.data
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

	//获取教育用户信息
	req_getUnassignedList(state, val) {
		common_request({
			url: '/api/zxkj/exam/getUnassignedList',
			data: {
				'examId': val.examId,
				'type': val.type
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.unassignedList = res.data.data
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

	//添加教育用户信息
	req_addDistribution(state, val) {
		common_request({
			url: '/api/zxkj/exam/addDistribution',
			data: {
				'examId': val.examId,
				'type': val.type,
				'carId': val.carId,
				'roomId': val.roomId,
				'startingId': val.startingId,
				'examSiteId': val.examSiteId,
				'userList': val.userList
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.navigateBack = true
					// state.unassignedList = res.data.data
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

	//发送提醒
	req_sendRemind(state, val) {
		common_request({
			url: '/api/zxkj/exam/sendRemind',
			data: {
				'examId': val.examId,
				'type': val.type,
				'remindContent': val.remindContent,
				'needTravel': val.needTravel,
				'needFeedback': val.needFeedback
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.navigateBack = true
					uni.showToast({
						title: '发送成功',
						duration: 2000,
						icon: 'none'
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

	//打开查看提醒
	req_getRemind(state, val) {
		common_request({
			url: '/api/zxkj/exam/getRemind',
			data: {
				'examRemindId': val.examRemindId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.remindContent = data.remindContent
					state.travel = data.travel
					state.needFeedback = data.needFeedback
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

	//教育收到提醒确认反馈
	req_examConfirmRemind(state, val) {
		common_request({
			url: '/api/zxkj/exam/subFeedback',
			data: {
				'examRemindId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '反馈成功',
						duration: 2000,
						icon: 'none'
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
