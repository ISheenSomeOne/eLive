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
		common_request({
			url: '/api/zxkj/room/getIconListData',
			data: {
				'postData': postData
			},
			header: {
				'content-type': 'application/x-www-form-urlencoded'
			},
			success: (res) => {
				let data = res.data.data
				// console.log(data)
				//初始化信息
				this.commit('initStateInfo')
				//添加剩余数量信息
				for (let i = 0; i < data.length; i++) {
					if (data[i].state == '空闲') {
						if (data[i].haveYouBeenAssignedARoom == true) {
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
				state.typePikerData = res.data
				state.typePikerNameData = ['选择房型']
				res.data.forEach((item) => {
					state.typePikerNameData.push(item.name)
				})
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
		console.log(val)
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
				console.log(res)
				//调用方法重新加载页面
				this.commit('req_initRoomStatus')
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
