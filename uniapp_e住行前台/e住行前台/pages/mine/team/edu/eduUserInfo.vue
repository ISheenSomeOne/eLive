<template>
	<view>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">姓名</view>
				<view class="lineRight">{{eduUserInfo.memberName}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">性别</view>
				<view class="lineRight">{{eduUserInfo.sex ? '男' : '女'}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">电话</view>
				<view class="lineRight">{{eduUserInfo.contact}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">身份证号</view>
				<view class="lineRight">{{eduUserInfo.idCard}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">住宿方式</view>
				<view class="lineRight" v-if="eduUserInfo.liveWay == 1">系统分配</view>
				<view class="lineRight" v-if="eduUserInfo.liveWay == 2">邀请他人</view>
				<view class="lineRight" v-if="eduUserInfo.liveWay == 3">加入他人</view>
				<view class="lineRight" v-if="eduUserInfo.liveWay == 4">一人独住</view>
			</view>
			<view class="line">
				<view class="lineLeft">车辆</view>
				<view class="lineRight">{{eduUserInfo.carNumbering}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">出发点</view>
				<view class="lineRight">{{eduUserInfo.startiung}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">酒店房间</view>
				<view class="lineRight">{{(eduUserInfo.hotel ? eduUserInfo.hotel : '--') + '-' + (eduUserInfo.room ? eduUserInfo.room : '--')}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">考点</view>
				<view class="lineRight">{{eduUserInfo.examSite}}</view>
			</view>
			<view class="line">
				<view class="lineLeft">支付费用</view>
				<view class="lineRight" v-if="eduUserInfo.payWay == 2">{{eduUserInfo.allFee ? '￥'+eduUserInfo.allFee : '￥0'}}</view>
				<view class="lineRight" v-else>统一支付</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			memberId: ''
		};
	},
	computed:{
		eduUserInfo() {
			return this.$store.state.edu.eduUserInfo;
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			if (options.memberId != '' && options.memberId != 'undefined' && options.memberId != null) {
				that.memberId = options.memberId;
				let val = { examId: that.examId, memberId: that.memberId };
				that.$store.commit('req_getEduUserInfo', val);
			}
		}
	},
	methods:{
		
	}
};
</script>

<style lang="scss" scoped>
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
			padding-right: 20rpx;
			height: 100%;
			width: 70%;
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
