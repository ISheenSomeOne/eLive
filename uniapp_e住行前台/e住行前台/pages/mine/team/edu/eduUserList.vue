<template>
	<view>
		<uni-notice-bar style="margin: 0;" :single="true" text="长按某一行即可删除" />
		<view style="margin-bottom: 60px;"><order-table :listType="'eduDistributionItem'" :examId="examId" :addType="addType" :reqId="reqId" :titleList="titleList" :tableList="eduDistributionItem"></order-table></view>
		<view class="buttonBoxAdd" @click="toAddUser">添加人员</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			carId: '',
			roomId: '',
			startingId: '',
			examSiteId: '',
			canAdd: false,
			addType: '',
			reqId: '',//上传用的id（可能是4种之一）
			titleList: [
				{ cont: '姓名', width: 'short' },
				{ cont: '性别', width: 'short' },
				{ cont: '车辆', width: 'short' },
				{ cont: '出发点', width: 'normal' },
				{ cont: '酒店房间', width: 'long' },
				{ cont: '考点', width: 'normal' }
			]
			// eduDistributionItem: [
			// 	{
			// 		memberId: '123',
			// 		memberName: '张三',
			// 		sex: '男',
			// 		car: '1号车',
			// 		startingName: 'xxxxx学校',
			// 		hotelName: '春田惠谷酒店',
			// 		roomName: '201',
			// 		examSite: 'xxxxx学校'
			// 	}
			// ]
		};
	},
	computed: {
		eduDistributionMax() {
			return this.$store.state.edu.eduDistributionMax;
		},
		eduDistributionItem() {
			return this.$store.state.edu.eduDistributionItem;
		},
		needRefresh() {
			return this.$store.state.edu.needRefresh;
		},
	},
	watch:{
		needRefresh(newData, oldData) {
			if (newData) {
				this.init()
				this.$store.commit('setNeedRefresh');
			}
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;

			if (options.carId != '' && options.carId != 'undefined' && options.carId != null) {
				that.carId = options.carId;
				that.addType = 1;
				that.reqId = options.carId
			}
			if (options.roomId != '' && options.roomId != 'undefined' && options.roomId != null) {
				that.roomId = options.roomId;
				that.addType = 2;
				that.reqId = options.roomId
			}
			if (options.startingId != '' && options.startingId != 'undefined' && options.startingId != null) {
				that.startingId = options.startingId;
				that.addType = 3;
				that.reqId = options.startingId
			}
			if (options.examSiteId != '' && options.examSiteId != 'undefined' && options.examSiteId != null) {
				that.examSiteId = options.examSiteId;
				that.addType = 4;
				that.reqId = options.examSiteId
			}
			that.init()
		}
	},
	onShow() {
		this.init()
	},
	methods: {
		init(){
			let that = this
			let val = { examId: that.examId, carId: that.carId, roomId: that.roomId, startingId: that.startingId, examSiteId: that.examSiteId };
			that.$store.commit('req_getEduUserList', val);
		},
		toAddUser() {
			let that = this;
			if (that.$store.state.edu.eduCarCanAdd) {
				uni.navigateTo({
					url: 'eduAddUser?examId='+that.examId+'&addType=' + that.addType+'&carId=' + that.carId+'&roomId=' + that.roomId+'&startingId=' + that.startingId+'&examSiteId=' + that.examSiteId
				});
			} else {
				uni.showToast({
					title: '本组人员已满',
					duration: 2000,
					icon: 'none'
				});
			}
		},
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
