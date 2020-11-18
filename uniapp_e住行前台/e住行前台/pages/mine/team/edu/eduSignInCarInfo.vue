<template>
	<view class="container999">
		<block v-for="(signInCar, index1) in signInCarList" :key="index1">
			<uni-section class="titleClass" :title="signInCar.numbering + ' - ' + signInCar.carNumber" type="circle"></uni-section>
			<block v-for="(item, index2) in signInCar.examPath" :key="index2">
				<view class="line" @click="look(item.examPathId)">
					<view class="lineLeft">行程{{index2 + 1}}</view>
					<view class="lineRight">
						{{item.boardingLocation}} — {{item.dropOffPoint}}
						<view class="tips fontBlue">{{item.numberArrivedLocationPeople}}/{{item.headcount}}</view>
					</view>
				</view>
			</block>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			checkinNumber: ''
		};
	},
	computed: {
		signInCarList() {
			return this.$store.state.edu.signInCarList;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			if (options.checkinNumber != '' && options.checkinNumber != 'undefined' && options.checkinNumber != null) {
				that.checkinNumber = options.checkinNumber;
				let val = { examId: that.examId, checkinNumber: that.checkinNumber };
				that.$store.commit('req_getExamCheckinCarInfo', val);
			}
		}
	},
	methods:{
		look(examPathId){
			let that = this
			uni.navigateTo({
			    url:'eduSignInInfo?examPathId=' + examPathId + '&examId='+that.examId
			})
		}
	}
};
</script>

<style lang="scss">
.titleClass {
	text-align: left;
	font-weight: bold;
}
.fontBlue {
	color: $uni-color-primary !important;
}
.container999 {
	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 4%;
		border-bottom: 1px solid #f5f5f5;
	}
	.buttonBox {
		transition: all 0.3s;
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
				color: $uni-color-primary;
				padding: 4rpx 8rpx;
				border-radius: 6rpx;
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
			width: 15%;
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
	width: 690rpx;
	font-size: 14px;
	min-height: 75vh;
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}
</style>
