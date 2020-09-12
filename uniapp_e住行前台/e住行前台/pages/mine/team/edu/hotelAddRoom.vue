<template>
	<view>
		<view class="topTip">
			<text>汇都酒店</text>
			—还需选择
			<text>10</text>
			间房
		</view>
		<picker class="pickerClass" mode="selector" :range="roomTypeList" :value="nowRoomType" @change="roomTypeChange">
			<view>{{ roomTypeList[nowRoomType] }}</view>
		</picker>
		<view class="roomBox clearfix">
			<view class="roomItem">11112201222122121</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
		</view>
		<view class="buttonBox" v-show="true" @click="submit">创建订单</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			roomTypeList: ['选择房型', '豪华大床房', '豪华双床房'],
			nowRoomType: 0
		};
	}
};
</script>

<style lang="scss" scoped>
	.pickerClass{
		height: 40px;
		line-height: 40px;
		font-size: 14px;
		width: 710rpx;
		margin: 10px auto 0 auto;
		background-color: #eee;
		border-radius: 2px;
	}
	.topTip{
		height: 40px;
		line-height: 40px;
		width: 710rpx;
		font-size: 14px;
		background-color: #4cd964;
		border-radius: 2px;
		color: #fff;
		margin: 20rpx auto 0 auto;
	}
	.topTip text{
		font-size: 16px;
		font-weight: bold;
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
.roomBox {
	.roomItem {
		height: 40px;
		line-height: 40px;
		width: 150rpx;
		background-color: #007aff;
		color: #fff;
		float: left;
		margin: 8px 15rpx;
		font-size: 14px;
		border-radius: 2px;
		overflow: auto;
	}
	width: 720rpx;
	margin: 0 auto;
}
</style>
