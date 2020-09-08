<template>
	<view class="unifiedPayment">
		<uni-title type="h1" title="2020云南省公务员考试" align="center"></uni-title>
		<uni-title type="h4" title="2020年10月30日——2020年10月31日" align="center"></uni-title>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">人数</view>
				<view class="lineRight">200</view>
			</view>
			<view class="line">
				<view class="lineLeft">入住时间</view>
				<view class="lineRight">2020年10月30日</view>
			</view>
			<view class="line">
				<view class="lineLeft">离店时间</view>
				<view class="lineRight">2020年10月31日</view>
			</view>
			<view class="line" style="height: auto;">
				<view class="lineLeft" style="height: 50px;line-height: 50px;">备注</view>
				<view class="lineRight" style="padding: 5px 0 5px 10px;">8月12日DCloud受邀参加iWEB峰会后，9月19日DCloud CEO 王安在千人小程序峰会——见实大会，做了主题为《App和小程序，鱼与熊掌如何兼得？》的分享。</view>
			</view>
			<view class="line">
				<view class="lineLeft">支付费用</view>
				<view class="lineRight" style="font-size: 20px;font-weight: bold;color: #dd524d;">￥20200</view>
			</view>
			<view class="buttonBox" @click="submit">支 付</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	mounted() {
		document.querySelector('.uni-page-head-hd').style.display = 'none';
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
		font-size: 16px;
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
			padding-left: 10px;
		}
		.lineLeft {
			display: flex;
			width: 23%;
			align-items: center;
			height: 100%;
			font-weight: bold;
			color: #333;
			font-size: 14px;
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
	width: 80%;
	font-size: 14px;
	color: #6b8082;
	position: relative;
	margin: 20px auto 0 auto;
	padding-bottom: 60px;
}
</style>
