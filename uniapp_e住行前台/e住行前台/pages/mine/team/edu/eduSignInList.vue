<template>
	<view class="eduSignInList">
		<view class="signList">
			<view class="signInTitle">
				<view class="titleItem">签到时间</view>
				<view class="titleItem">行程</view>
				<view class="titleItem short">已到/应到</view>
			</view>
			<block v-for="(item, index) in signInList" :key="index">
				<view class="signInItem" @click="toSignInCarInfo(item.checkinNumber)">
					<view class="itemInfo">{{item.careateTime}}</view>
					<view class="itemInfo">{{item.pathType}}</view>
					<view class="itemInfo short fontBlue">{{item.numberArrivedLocationPeople}}/{{item.headcount}}</view>
				</view>
			</block>
		</view>
		<view class="buttonBox" @click="submit">新建签到</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: ''
		};
	},
	computed: {
		signInList() {
			return this.$store.state.edu.signInList;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			that.$store.commit('req_getExamCheckinList', that.examId);
		}
	},
	methods:{
		toSignInCarInfo(checkinNumber){
			let that = this
			uni.navigateTo({
			    url:'eduSignInCarInfo?examId=' + that.examId+'&checkinNumber='+checkinNumber
			})
		}
	}
};
</script>

<style lang="scss">
.signList {
	width: 690rpx;
	margin: 0 auto;
	padding-bottom: 60px;
}
.signInTitle {
	height: 50px;
	line-height: 50px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	background-color: #f8f8f8;
	border-bottom: 1px solid #e5e5e5;
	font-size: 14px;
}
.titleItem {
	height: 100%;
	width: 250rpx;
}
.signInItem {
	height: 50px;
	line-height: 50px;
	width: 100%;
	display: flex;
	justify-content: space-between;
	border-bottom: 1px solid #e5e5e5;
	font-size: 13px;
}
.itemInfo {
	width: 250rpx;
}
.short {
	width: 180rpx;
}
.fontBlue {
	color: $uni-color-primary !important;
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
</style>
