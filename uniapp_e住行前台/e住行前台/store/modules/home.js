const state = {
	roomStatePageNum: 1, //请求页数
	roomList: [], //房间列表
	roomStateCountList: [0, 0, 0, 0, 0, 0, 0], //房间状态的房间数列表
	fabCont: [], //首页悬浮按钮数据
	typePikerData: [], //所有房型数据
	typePikerNameData: [], //房型选择器数据
	typePikerIndex: 0, //房型选择当前下标
	nowTypeId: '', //首页选择的房型id
	floorpikerData: [], //楼层数组
	floorIndex: 0, //楼层选择当前下标
	nowFloor: '', //首页选择的楼层
	showEmpty: false, //显示空房
	reqKong: '', //请求参数
	nowRoom: {}, //首页选择的房间
	changeRoomInfo: {}, //换房信息
	changeRoomName: [], //换房房间名
	changeRoomIndex: 0, //换房下标
	changeFlag: false, //是否关闭换房悬浮框
	current: '', //当前登录用户
	imgApi: 'https://zxkj.webinn.online/zxkj/imgs/', //正式环境
	// imgApi: 'http://9e839285f12d7e57.natapp.cc:9997/zxkj/imgs/', //测试环境
}
const mutations = {
	//初始化楼层
	initHomeFloor(state) {
		state.floorpikerData = ['选择楼层']
		for (let i = 1; i <= 50; i++) {
			state.floorpikerData.push(i + '楼')
		}
	},
	//初始化状态数据
	initStateInfo(state) {
		state.roomStateCountList = [0, 0, 0, 0, 0, 0, 0]
		state.fabCont = [{
				iconPath: '/static/icon/kongxian.svg',
				selectedIconPath: '/static/icon/kongxian.svg',
				text: '空闲',
				active: false
			},
			{
				iconPath: '/static/icon/yuliu.svg',
				selectedIconPath: '/static/icon/yuliu.svg',
				text: '预留',
				active: false
			},
			{
				iconPath: '/static/icon/zaizhu.svg',
				selectedIconPath: '/static/icon/zaizhu.svg',
				text: '在住',
				active: false
			},
			{
				iconPath: '/static/icon/chaoshi.svg',
				selectedIconPath: '/static/icon/chaoshi.svg',
				text: '超时',
				active: false
			},
			{
				iconPath: '/static/icon/dasao.svg',
				selectedIconPath: '/static/icon/dasao.svg',
				text: '打扫',
				active: false
			},
			{
				iconPath: '/static/icon/weixiu.svg',
				selectedIconPath: '/static/icon/weixiu.svg',
				text: '维修',
				active: false
			},
			{
				iconPath: '/static/icon/baoliu.svg',
				selectedIconPath: '/static/icon/baoliu.svg',
				text: '保留',
				active: false
			}
		]
	},
	//请求获取用户权限
	req_getAuth(state) {
		common_request({
			url: '/api/zxkj/getAuth',
			method: 'GET',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					//初始化信息
					uni.setStorageSync('authList', data)
					console.log(uni.getStorageSync('authList'))
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
	//请求初始化房态数据
	req_initRoomStatus(state) {
		let json = {
			"pageNum": state.roomStatePageNum,
			"length": 1000,
			"start": getTime(),
			"end": getTime(1),
			"#rt.id": state.nowTypeId,
			"#floor": state.nowFloor,
			"#r.state": state.reqKong,
		}
		let postData = JSON.stringify(json)

		this.dispatch('getAuth')
		common_request({
			url: '/api/zxkj/room/getIconListData',
			data: {
				'postData': postData
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data.data
					//初始化信息
					this.commit('initStateInfo')
					//添加剩余数量信息
					for (let i = 0; i < data.length; i++) {
						if (data[i].state == '空闲') {
							if (data[i].canTheHousing == true) {
								state.roomStateCountList[0]++
								data[i].state = 'kongxian'
							} else {
								state.roomStateCountList[1]++
								data[i].state = 'yuliu'
							}
						} else if (data[i].state == '在用') {
							state.roomStateCountList[2]++
							data[i].state = 'zaizhu'
						} else if (data[i].state == '超时') {
							state.roomStateCountList[3]++
							data[i].state = 'chaoshi'
						} else if (data[i].state == '打扫') {
							state.roomStateCountList[4]++
							data[i].state = 'dasao'
						} else if (data[i].state == '维修') {
							state.roomStateCountList[5]++
							data[i].state = 'weixiu'
						} else if (data[i].state == '保留') {
							state.roomStateCountList[6]++
							data[i].state = 'baoliu'
						}
					}
					for (let i = 0; i < state.fabCont.length; i++) {
						state.fabCont[i].text = state.fabCont[i].text + state.roomStateCountList[i]
					}
					state.roomList = data
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
	//请求初始化房型数据
	req_initRoomType(state) {
		common_request({
			url: '/api/zxkj/roomType/getNameByHotelId',

			data: {
				'startTime': getTime(),
				'endTime': getTime(1)
			},
			method: 'GET',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.typePikerData = res.data.data
					state.typePikerNameData = ['选择房型']
					res.data.data.forEach((item) => {
						state.typePikerNameData.push(item.name)
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
	//房态页面房间类型选择
	homeRoomTypeChange(state, val) {
		state.typePikerIndex = val
		if (state.typePikerIndex <= 0) {
			state.nowTypeId = ''
		} else {
			state.nowTypeId = state.typePikerData[state.typePikerIndex - 1].id
		}
		//调用方法重新加载页面
		this.commit('req_initRoomStatus')
	},
	//房态页面楼层选择
	homeFloorChange(state, val) {
		// console.log(val)
		state.floorIndex = val
		if (state.floorIndex <= 0) {
			state.nowFloor = ''
		} else {
			state.nowFloor = val
		}
		//调用方法重新加载页面
		this.commit('req_initRoomStatus')
	},
	//选择空房改变事件
	emptyChange(state, val) {
		// console.log(val)
		state.showEmpty = val
		if (val) {
			state.reqKong = 4
		} else {
			state.reqKong = ''
		}
		//调用方法重新加载页面
		this.commit('req_initRoomStatus')
	},
	//首页选择的房间
	chooseRoomId(state, val) {
		state.nowRoom = val
	},
	//首页更改房态
	req_ChangeRoomState(state, val) {
		common_request({
			url: '/api/zxkj/room/updateStateById',
			method: 'GET',
			data: {
				'id': state.nowRoom.id,
				'state': val
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '成功',
						duration: 2000
					});
					//调用方法重新加载页面
					this.commit('req_initRoomStatus')
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
	//开锁
	req_OpenRoom(state) {
		common_request({
			url: '/api/zxkj/room/sweep/openLockByRoomId',
			data: {
				'roomId': state.nowRoom.id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '成功',
						duration: 2000
					});
				} else if (res.data.code == -1 || res.data.code == 0 || res.data.code == -2) {
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
	//请求退房
	req_checkout(state) {
		let that = this
		common_request({
			url: '/api/zxkj/room/checkOutByRoomId',
			data: {
				'roomId': state.nowRoom.id
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					uni.showToast({
						title: '退房成功',
						duration: 2000
					});
					that.commit('req_initRoomStatus')
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
	//请求换房参数
	req_initChangeRoom(state) {
		common_request({
			url: '/api/zxkj/room/getQtExchangeRoomsByRoomId/' + state.nowRoom.id,
			method: 'GET',
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					let data = res.data.data
					data.rooms.unshift({
						'door': '选择房间',
						'id': ''
					})

					state.changeRoomName = []
					data.rooms.forEach((item) => {
						state.changeRoomName.push(item.door)
					})

					state.changeRoomInfo = data
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
	//换房中换房
	setChangeRoomIndex(state, val) {
		state.changeRoomIndex = val
	},
	//换房请求
	req_confirmChange(state) {
		common_request({
			url: '/api/zxkj/OrderRoom/exchangeRoomByOldRoomIdAndNewRoomId',
			data: {
				'newRoomId': state.changeRoomInfo.rooms[state.changeRoomIndex].id,
				'oldOrderRoomId': state.changeRoomInfo.orderRoomId
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				if (res.data.code == 200) {
					state.changeFlag = true
					state.changeRoomIndex = 0

					//调用方法重新加载页面
					this.commit('req_initRoomStatus')

					uni.showToast({
						title: '换房成功',
						duration: 2000
					});
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
	//更改状态
	setChangeFlag(state) {
		state.changeFlag = false
	},
}
const actions = {
	initRoomStatus({
		commit
	}) {
		commit("req_initRoomStatus");
	},
	initRoomType({
		commit
	}) {
		commit("req_initRoomType");
	},
	changeRoomState({
		commit
	}, value) {
		commit("req_ChangeRoomState", value);
	},
	openRoom({
		commit
	}, value) {
		commit("req_OpenRoom");
	},
	checkout({
		commit
	}) {
		commit("req_checkout");
	},
	initChangeRoom({
		commit
	}) {
		commit("req_initChangeRoom");
	},
	confirmChange({
		state,
		commit
	}) {
		if (state.changeRoomIndex == 0) {
			uni.showToast({
				title: '请选择房间',
				duration: 2000,
				icon: 'none'
			});
		} else {
			commit("req_confirmChange");
		}
	},
	getAuth({
		commit
	}) {
		commit("req_getAuth");
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
	state.current = current
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
				console.log(Object.keys(userListJson).length)
				console.log(userListJson)
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
