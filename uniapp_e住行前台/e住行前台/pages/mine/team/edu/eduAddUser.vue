<template>
	<view>
		<view style="margin-bottom: 60px;"><order-table :listType="'eduAddUserList'" :titleList="titleList" :tableList="unassignedList" @getNewList="getNewList"></order-table></view>
		<view class="buttonBoxAdd" @click="comfirm">确定</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			addType: '',
			carId: '',
			roomId: '',
			startingId: '',
			examSiteId: '',
			reqData: '', //用于上传的数据
			titleList: [
				{ cont: '选择', width: 'short' },
				{ cont: '姓名', width: 'short' },
				{ cont: '性别', width: 'short' },
				{ cont: '车辆', width: 'short' },
				{ cont: '出发点', width: 'normal' },
				{ cont: '酒店房间', width: 'long' },
				{ cont: '考点', width: 'normal' }
			]
			// eduAddUserList: [
			// 	{
			// 		memberId: '123',
			// 		memberName: '张三',
			// 		sex: '男',
			// 		car: '1号车',
			// 		startingName: 'xxxxx学校',
			// 		hotelRoom: '春田惠谷酒店-201',
			// 		examSite: 'xxxxx学校'
			// 	},
			// ]
		};
	},
	computed: {
		unassignedList() {
			return this.$store.state.edu.unassignedList;
		},
		navigateBack() {
			return this.$store.state.edu.navigateBack;
		}
	},
	watch: {
		navigateBack(newData, oldData) {
			if (newData) {
				uni.navigateBack({
					delta: 1
				});
			this.$store.commit('setNeedNavigateBack');
			}
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			that.addType = options.addType;

			if (options.carId != '' && options.carId != 'undefined' && options.carId != null) {
				that.carId = options.carId;
			} else {
				that.carId = ''
			}
			if (options.roomId != '' && options.roomId != 'undefined' && options.roomId != null) {
				that.roomId = options.roomId;
			} else {
				that.roomId = ''
			}
			if (options.startingId != '' && options.startingId != 'undefined' && options.startingId != null) {
				that.startingId = options.startingId;
			} else {
				that.startingId = ''
			}
			if (options.examSiteId != '' && options.examSiteId != 'undefined' && options.examSiteId != null) {
				that.examSiteId = options.examSiteId;
			} else {
				that.examSiteId = ''
			}
			let val = { examId: that.examId, addType: that.addType };
			that.$store.commit('req_getUnassignedList', val);
		}
	},
	methods: {
		//获取子组件传值
		getNewList(e) {
			this.reqData = e;
		},
		comfirm() {
			let that = this;
			let data = [];
			if (that.reqData.length) {
				for (let i = 0; i < that.reqData.length; i++) {
					if (that.reqData[i].checked) {
						data.push(that.reqData[i].memberId);
					}
				}
				let val = { examId: that.examId, type: that.addType, carId: that.carId, roomId: that.roomId, startingId: that.startingId, examSiteId: that.examSiteId, userList: data };
				that.$store.commit('req_addDistribution', val);
			} else {
				uni.showToast({
					title: '您没有选择人员',
					duration: 2000,
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.buttonBoxAdd {
	width: 91%;
	margin: 0 auto;
	height: 40px;
	border-radius: 100px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	bottom: 10px;
	left: 0;
	right: 0;
	background-color: #4cd964;
}
</style>
