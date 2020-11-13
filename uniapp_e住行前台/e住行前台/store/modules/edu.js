import home from './home.js'
const state = {
	createExamData: '', //创建考试表单
	unifiedPaymentLink: '', //【统一支付】页面链接
	qr: '', //学生报名二维码图片
	payQR: '', //统一支付二维码
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
	resSuccess: false, //返回值200
	needResetEduDistributionHeight: false, //重置高度
	needTravel: false, //需要显示行程
	eduCarCanAdd: false, //教育车辆可以加人
	eduUnifiedPaymentQR: '', //教育统一支付二维码
	eduNeedFeedbackRemindList: '', //需要反馈的提醒列表
	eduDontNeedFeedbackRemindList: '', //不需要反馈的提醒列表
	eduReceiveFeedbackRemindMemberList: '', //已反馈的人员名单
	eduDontReceiveFeedbackRemindMemberList: '', //未反馈的人员名单
	signInList: '',//签到列表
	membersWhoHaveSignedIn: '', //签到人员名单
	unsignedMembers: '', //未签到的会员
	driverSeeInfo: '', //司机查看信息
	driverInfo: '', //司机信息
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
		if (val.payWay == 1 || val.payWay == 3) {
			if (val.serviceType == 3) {
				val.checkinDate = ''
				val.checkoutDate = ''
			} else if (val.serviceType == 2) {
				val.startingList = ''
				val.examSiteList = ''
			}
		} else {
			val.serviceType = ''
		}
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
					state.payQR = 'https://zxkj.webinn.online/zxkj/' + res.data.data.payQR
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
					this.commit('req_paymentCompletesTheCallback', val)
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

	//支付成功回调
	req_paymentCompletesTheCallback(state, val) {
		common_request({
			url: '/api/zxkj/exam/paymentCompletesTheCallback',
			data: {
				'examId': val
			},
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
					this.commit('req_examOrderPay', val)
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
					this.commit('req_examOrderPay', val)
					// state.qr = res.data.data.qr
					// uni.navigateTo({
					// url: 'createSuccess?examId='+res.data.data
					// });
				} else if (res.data.code == 202) {

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
		this.commit('req_examOrderPay', val)
		//获取openId
		// common_request({
		// 	url: '/wxPay/connect/oauth2/authorize',
		// 	data: {
		// 		appid: 'wx68064214de16779e',
		// 		redirect_uri: 'https://group.webinn.online/phone',
		// 		// redirect_uri: 'https%3a%2f%2fzxkj.webinn.online%2fzxkj',
		// 		response_type: 'code',
		// 		scope: 'snsapi_base',
		// 		state: 'STATE#wechat_redirect'
		// 	},
		// 	method: 'GET',
		// 	header: {
		// 		'content-type': 'application/x-www-form-urlencoded'
		// 	},
		// 	success: (res) => {
		// 		state.res = res
		// 		alert(res)
		// 		//上线测试
		// 		// if (res.data.code == 200) {

		// 		// } else {
		// 		// 	uni.showModal({
		// 		// 		title: '提示',
		// 		// 		content: '服务器错误',
		// 		// 		showCancel: false
		// 		// 	})
		// 		// }
		// 	},
		// })
	},

	//申请订单
	req_examOrderPay(state, val) {
		common_request({
			url: '/api/zxkj/exam/examPay',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.eduUnifiedPaymentQR = 'https://zxkj.webinn.online/zxkj/wx/code?codeUrl=' + res.data.data.codeUrl
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
					// console.log(data)
					data.examSiteList = JSON.parse(data.examSiteList)
					data.startingList = JSON.parse(data.startingList)
					data.examStartDate = formatDate(true, data.examStartDate)
					data.examEndDate = formatDate(true, data.examEndDate)
					if (data.checkinDate) {
						data.checkinDate = formatDate(true, data.checkinDate)
						data.checkoutDate = formatDate(true, data.checkoutDate)
					}
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
			url: '/api/zxkj/examOrder/getEduDistribution',
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
					if (val.type == 2) {
						data.startingList = JSON.parse(data.startingList)
					}
					if (val.type == 3) {
						data.examSiteList = JSON.parse(data.examSiteList)
					}
					state.eduDistributionInfo = data
					//等待浏览器渲染
					setTimeout(() => {
						state.needResetEduDistributionHeight = true
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

	//自动分配
	req_autoDistribution(state, val) {
		common_request({
			url: '/api/zxkj/examOrder/autoDistribution',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					// let data = res.data.data
					state.needRefresh = true
					uni.showModal({
						title: '提示',
						content: '自动分配成功',
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

	//获取车辆信息
	req_getCarInfo(state, val) {
		common_request({
			url: '/api/zxkj/examBus/getCarInfo',
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
		let form = val.form
		common_request({
			url: '/api/zxkj/examBus/addCarInfo',
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
					state.navigateBack = true
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
		// let carId = JSON.stringify(val.carId)
		// let carInfo = val.carInfo

		common_request({
			url: '/api/zxkj/examBus/updateCarInfo',
			data: {
				'carId': val.busId,
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
					state.navigateBack = true
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
			url: '/api/zxkj/examBus/delEduCarInfo',
			data: {
				'carId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.navigateBack = true
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
			url: '/api/zxkj/examHotel/getEduHotel',
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
			url: '/api/zxkj/examHotel/makeAddHotelLink',
			data: {
				'examId': val.examId,
				'hotelId': val.hotelId,
				'roomCount': val.roomCount
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.resSuccess = true
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
	req_delEduHotel(state, val) {
		common_request({
			url: '/api/zxkj/examHotel/delEduHotel',
			data: {
				'examId': val.examId,
				'hotelId': val.hotelId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.navigateBack = true
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

	//改变状态
	changeResSuccess(state) {
		state.resSuccess = false
	},

	//获取需要添加的酒店房型房间信息
	req_getEduHotelRoom(state, val) {
		common_request({
			url: '/api/zxkj/examHotel/getEduHotelRoom',
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
		if (state.eduHotelRoom.needRoom < val.roomList.length) {
			uni.showModal({
				title: '提示',
				content: '房间选多了',
				showCancel: false
			})
		} else {
			common_request({
				url: '/api/zxkj/examRoom/addEduHotelRoom',
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
						uni.showToast({
							title: '添加成功',
							duration: 2000,
							icon: 'success'
						});
						setTimeout(() => {
							state.needRefresh = true
						}, 1500)
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

	},

	//获取分类下的用户列表
	req_getEduUserList(state, val) {
		common_request({
			url: '/api/zxkj/examOrder/getEduUserList',
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
					if (state.eduDistributionMax > state.eduDistributionItem.length) {
						state.eduCarCanAdd = true
					} else if (state.eduDistributionMax < 0) {
						state.eduCarCanAdd = true
					} else {
						state.eduCarCanAdd = false
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

	//删除用户列表中的一个
	req_delEduUserListItem(state, val) {
		let carId = ''
		let roomId = ''
		let startingId = ''
		let examSiteId = ''
		if (val.addType == 1) {
			carId = val.reqId
		} else if (val.addType == 2) {
			roomId = val.reqId
		} else if (val.addType == 3) {
			startingId = val.reqId
		} else if (val.addType == 4) {
			examSiteId = val.reqId
		}
		common_request({
			url: '/api/zxkj/examOrder/delEduUserListItem',
			data: {
				'examId': val.examId,
				'carId': carId,
				'roomId': roomId,
				'startingId': startingId,
				'examSiteId': examSiteId,
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
			url: '/api/zxkj/examOrder/getEduUserInfo',
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
			url: '/api/zxkj/examOrder/getUnassignedList',
			data: {
				'examId': val.examId,
				'type': val.addType
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					data.forEach((item) => {
						item.checked = false
					})
					state.unassignedList = data
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
			url: '/api/zxkj/examOrder/addDistribution',
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
			url: '/api/zxkj/examRemind/sendRemind',
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
					uni.showToast({
						title: '发送成功',
						duration: 2000,
						icon: 'none'
					});
					// setTimeout(()=>{
					// 		state.navigateBack = true
					// },2000)
				} else if (res.data.code == -1) {
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

	//打开查看提醒
	req_getRemind(state, val) {
		common_request({
			url: '/api/zxkj/examRemind/getRemind',
			data: {
				'examRemindId': val
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
					state.needTravel = data.needTravel
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
			url: '/api/zxkj/examRemind/examConfirmRemind',
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
					setTimeout(() => {
						this.commit('req_getRemind', val);
					}, 2000)
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

	//查询提醒列表
	req_getEduRemindList(state, val) {
		common_request({
			url: '/api/zxkj/examRemind/getEduRemindList',
			data: {
				'examId': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					if (data.eduNeedFeedbackRemindList.length > 0) {
						for (let i = 0; i < data.eduNeedFeedbackRemindList.length; i++) {
							if (data.eduNeedFeedbackRemindList[i].remindContent.length > 40) {
								data.eduNeedFeedbackRemindList[i].remindContent = data.eduNeedFeedbackRemindList[i].remindContent.substring(
									0, 40) + '...'
							}
							data.eduNeedFeedbackRemindList[i].createTime = formatDate2(data.eduNeedFeedbackRemindList[i].createTime)
						}
						state.eduNeedFeedbackRemindList = data.eduNeedFeedbackRemindList
					}
					if (data.eduDontNeedFeedbackRemindList.length > 0) {
						for (let i = 0; i < data.eduDontNeedFeedbackRemindList.length; i++) {
							if (data.eduDontNeedFeedbackRemindList[i].remindContent.length > 40) {
								data.eduDontNeedFeedbackRemindList[i].remindContent = data.eduDontNeedFeedbackRemindList[i].remindContent.substring(
									0, 40) + '...'
							}
							data.eduDontNeedFeedbackRemindList[i].createTime = formatDate2(data.eduDontNeedFeedbackRemindList[i].createTime)
						}
						state.eduDontNeedFeedbackRemindList = data.eduDontNeedFeedbackRemindList
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

	//查询“需反馈的提醒”的反馈情况
	req_getEduRemindMemberList(state, val) {
		common_request({
			url: '/api/zxkj/examRemind/getEduRemindMemberList',
			data: {
				'examId': val.examId,
				'remindIndex': val.remindIndex
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					console.log(data)
					state.eduReceiveFeedbackRemindMemberList = data.eduReceiveFeedbackRemindMemberList
					state.eduDontReceiveFeedbackRemindMemberList = data.eduDontReceiveFeedbackRemindMemberList

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

	// =====================================================================================================================签到
	//创建签到
	req_addNewCheckin(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/addNewCheckin',
			data: {
				'examId': val.examId,
				'targetLocation': val.targetLocation,
				'startingPoint': val.startingPoint
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.navigateBack = true

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
	
	//获取教育签到列表
	req_getExamCheckinList(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/getExamCheckinList',
			data: {
				'examId': val.examId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					for(let i = 0; i < data.length; i++){
						data[i].careateTime = formatDate2(data[i].careateTime)
					}
					state.signInList = data
					
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
	
	//获取教育签到车辆信息
	req_getExamCheckinCarInfo(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/getExamCheckinCarInfo',
			data: {
				'examId': val.examId,
				'checkinNumber': val.checkinNumber
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.signInCarList = data
					
				} else if(res.data.code == -1){
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
	
	//获取车辆路径的会员签到信息
	req_getExamCheckinMemberInfo(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/getExamCheckinMemberInfo',
			data: {
				'examPathId': val,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					state.membersWhoHaveSignedIn = data.membersWhoHaveSignedIn
					state.unsignedMembers = data.unsignedMembers
					
				} else if(res.data.code == -1){
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
	
	//获取司机查看信息
	req_getDriverSeeInfo(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/getDriverSeeInfo',
			data: {
				'examPathId': val,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {	
					let data = res.data.data
					state.driverSeeInfo = data
				} else if(res.data.code == -1){
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
	
	//学生查看司机位置信息
	req_studentGetsDriverInfo(state, val) {
		common_request({
			url: '/api/zxkj/examCheckin/studentGetsDriverLocationInformation',
			data: {
				'examCheckinId': val,
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {	
					let data = res.data.data
					state.driverInfo = data
				} else if(res.data.code == -1){
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

	//关闭重置
	resetEduDistributionHeightFalse(state) {
		state.needResetEduDistributionHeight = false
	},

	//设置为false
	setNeedRefresh(state) {
		state.needRefresh = false
	},

	//设置为false
	setNeedNavigateBack(state) {
		state.navigateBack = false
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

//格式化时间为yyyy-MM-dd hh:mm
function formatDate2(date) {
	var d = new Date(date)
	var month = '' + (d.getMonth() + 1)
	var day = '' + d.getDate()
	var year = d.getFullYear()
	var hour = '' + d.getHours()
	var min = d.getMinutes()

	if (month.length < 2) month = '0' + month;
	if (day.length < 2) day = '0' + day;
	if (hour.length < 2) hour = '0' + hour;
	if (min.length < 2) min = '0' + min;

	return [year, month, day].join('-') + ' ' + hour + ':' + min;

}
