<template>
	<view class="editSend">
		<view class="switchItem">
			<view class="uni-list-cell-db">自动发送行程</view>
			<switch :checked="needTravel" @change="needTravelChange" />
		</view>
		<view class="switchItem">
			<view class="uni-list-cell-db">需要反馈</view>
			<switch :checked="needFeedback" @change="needFeedbackChange" />
		</view>
		<textarea class="textareClass" maxlength="-1" placeholder="在此输入要发送的内容（注意:不可换行）" @blur="bindTextAreaBlur" auto-height />
		<view class="sendButton" @click="confirm">发 送</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			remindContent: '',
			needTravel: true,
			needFeedback: true
		};
	},
	computed: {
		navigateBack() {
			return this.$store.state.edu.navigateBack;
		}
	},
	watch:{
		navigateBack(newData, oldData) {
			if (newData) {
				uni.navigateBack({
					delta:1
				})
			this.$store.commit('setNeedNavigateBack');
			}
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
		}
	},
	methods: {
		bindTextAreaBlur: function(e) {
			this.remindContent = e.detail.value;
		},
		confirm: function() {
			let that = this;
			uni.showModal({
				title: '提示',
				content: '点击确定发送提醒',
				success: function(res) {
					if (res.confirm) {
						let val = { examId: that.examId, type: 1, remindContent: that.remindContent, needTravel: that.needTravel, needFeedback: that.needFeedback };
						that.$store.commit('req_sendRemind', val);
					} else if (res.cancel) {
					}
				}
			});
		},
		needTravelChange: function(e) {
			this.needTravel = e.target.value;
			console.log(this.needFeedback);
		},
		needFeedbackChange: function(e) {
			this.needFeedback = e.target.value;
		}
	}
};
</script>

<style lang="scss" scoped>
.switchItem {
	display: flex;
	justify-content: space-between;
	width: 670rpx;
	margin: 0 auto;
	height: 100rpx;
	line-height: 100rpx;
	border-bottom: 1rpx solid #eee;
}
.sendButton {
	width: 91%;
	margin: 0 auto;
	height: 40px;
	border-radius: 100px;
	font-size: 16px;
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
.textareClass {
	min-height: 30vh;
	text-align: left;
	padding: 10px;
	width: 650rpx;
	margin: 12px auto 60px auto;
	background-color: #f3f3f3;
	border-radius: 2px;
	color: #333;
}
</style>
