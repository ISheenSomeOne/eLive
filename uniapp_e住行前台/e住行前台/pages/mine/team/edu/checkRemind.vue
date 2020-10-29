<template>
	<view class="checkRemind">
		<view class="container999">
			<block v-if="needTravel">
				<uni-section class="titleClass" title="行程信息" type="line"></uni-section>
				<view class="line" v-show="travel[0].name != null">
					<view class="lineLeft">出发点</view>
					<view class="lineRight">{{ travel[0].name }}</view>
				</view>
				<view class="line" v-show="travel[0].name != null">
					<view class="lineLeft">出发时间</view>
					<view class="lineRight">{{ travel[0].startingDateTime }}</view>
				</view>
				<view class="line" v-show="travel[3].name != null">
					<view class="lineLeft">考点</view>
					<view class="lineRight">{{ travel[3].name }}</view>
				</view>
				<uni-section class="titleClass" title="酒店信息" type="line" v-show="travel[1].name != null"></uni-section>
				<view class="line" v-show="travel[1].name != null">
					<view class="lineLeft">酒店信息</view>
					<view class="lineRight">{{ travel[1].name + '-' + travel[1].door }}</view>
				</view>
				<uni-section class="titleClass" title="车辆信息" type="line" v-show="travel[2].carNumber != null"></uni-section>
				<view class="line" v-show="travel[2].carNumber != null">
					<view class="lineLeft">车辆编号</view>
					<view class="lineRight">{{ travel[2].numbering }}</view>
				</view>
				<view class="line" v-show="travel[2].carNumber != null">
					<view class="lineLeft">车牌号</view>
					<view class="lineRight">{{ travel[2].driver }}</view>
				</view>
				<view class="line" v-show="travel[2].carNumber != null">
					<view class="lineLeft">司机</view>
					<view class="lineRight">{{ travel[2].carNumber }}</view>
				</view>
				<view class="line" v-show="travel[2].carNumber != null">
					<view class="lineLeft">联系方式</view>
					<view class="lineRight">{{ travel[2].contact }}</view>
				</view>
			</block>
			
			<uni-section class="titleClass" title="通知信息" type="line"></uni-section>
			<view class="line" style="min-height: 50rpx;height: auto!important;line-height: 50rpx;" v-if="remindContent != ''">
				<view class="lineLeft" style="line-height: 100rpx;">提醒</view>
				<view class="lineRight" style="line-height: 50rpx;padding-top: 25rpx;padding-bottom: 25rpx;">{{remindContent}}</view>
			</view>
		</view>
		<view v-show="needFeedback && !receivedReminder" class="buttonBoxAdd" @click="confirm">确 认</view>
		<view v-show="needFeedback && receivedReminder" class="buttonBoxAdd" style="background-color: #999999;">已反馈</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed: {
		travel() {
			return this.$store.state.edu.travel;
		},
		remindContent() {
			return this.$store.state.edu.remindContent;
		},
		needFeedback() {
			return this.$store.state.edu.needFeedback;
		},
		receivedReminder() {
			return this.$store.state.edu.receivedReminder;
		},
		needTravel() {
			return this.$store.state.edu.needTravel;
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examRemindId != '' && options.examRemindId != 'undefined' && options.examRemindId != null) {
			that.examRemindId = options.examRemindId;
			that.$store.commit('req_getRemind', that.examRemindId);
		}
	},
	mounted() {
		document.querySelector('.uni-page-head-hd').style.display = 'none';
	},
	methods: {
		confirm: function() {
			this.$store.commit('req_examConfirmRemind', this.examRemindId);
		}
	}
};
</script>

<style lang="scss">
.cont {
	text-align: left;
	width: 650rpx;
	padding: 20rpx;
	text-indent: 2em;
	margin: 20rpx auto;
	border: #007aff 1rpx solid;
	border-radius: 6rpx;
	line-height: 60rpx;
}
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
.container999 {
	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 4%;
		border-bottom: 1px solid #f5f5f5;
	}
	.buttonBox {
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
	.tri {
		width: 0;
		height: 0;
		border-left: 8rpx solid transparent;
		border-right: 8rpx solid transparent;
		right: 30rpx !important;
		border-top: 16rpx solid #545151;
	}
	.line {
		margin-top: 15px;
		height: 50px;
		width: 92%;
		margin: 0 auto;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		.lineRight {
			.tips {
				color: #9a9a9c;
				font-weight: bold;
			}
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
		}
		.lineLeft {
			display: flex;
			width: 23%;
			align-items: center;
			height: 100%;
			font-weight: bold;
			color: #333;
		}
		.input {
			height: 100%;
			width: 100%;
			line-height: 40rpx;
			overflow: auto;
			text-align: left;
			font-size: 14px;
			color: #545151;
		}
		.picker {
			height: 100%;
			justify-content: flex-start;
			display: flex;
			align-content: center;
			width: 500rpx;
		}
		picker {
			height: 50px;
			line-height: 50px;
		}
	}
	width: 90%;
	font-size: 14px;
	min-height: 75vh;
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}
</style>
