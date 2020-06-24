const state = {
	createOrderDate: '', //创建订单的入离日期
	createSource: '', //创建订单的来源
	createFormData: '', //创建订单的form表单数据
	createRoomType: '',//创建订单的房型数据
	此处需要接口获取信息才可继续-----
}
const mutations = {
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
	//创建订单表单数据改变
	formDataChange(state, val) {
		state.createFormData = val
	},
}
const actions = {

}

export default {
	state,
	actions,
	mutations
}
