<template>
	<view class="unifiedPayment">
		<!-- <uni-title type="h1" :title="paymentInfo.examName" align="center"></uni-title>
		<uni-title type="h4" :title="paymentInfo.examStartDate + ' —— ' + paymentInfo.examEndDate" align="center"></uni-title>
		<view class="container999">
			<view class="line" v-if="paymentInfo.peopleNum">
				<view class="lineLeft">人数</view>
				<view class="lineRight">{{ paymentInfo.peopleNum }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">入住时间</view>
				<view class="lineRight">{{ paymentInfo.checkinDate }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">离店时间</view>
				<view class="lineRight">{{ paymentInfo.checkoutDate }}</view>
			</view>
			<view class="line" style="height: auto;" v-if="paymentInfo.remarks">
				<view class="lineLeft" style="height: 50px;line-height: 50px;">备注</view>
				<view class="lineRight" style="padding: 5px 0 5px 10px;">{{ paymentInfo.remarks }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">支付费用</view>
				<view class="lineRight" style="font-size: 20px;font-weight: bold;color: #dd524d;">￥{{ paymentInfo.allFee }}</view>
			</view>
			<view style="margin-top: 20rpx;"><uni-notice-bar :single="true" text="注意:  请在微信长按下方二维码进行支付" /></view>
			<image style="width: 100%;" :src="eduUnifiedPaymentQR" mode="aspectFit"></image>
			<view class="buttonBox" @click="submit">支 付</view>
			<view v-if="unifiedPaymentPaid" class="buttonBox">已支付</view>
		</view> -->
		<button type="default" @click="geta">获取位置</button>
		<map @tap="goto" style="width: 100%; height: 300px;" scale="16" :markers="covers" :latitude="latitude" :longitude="longitude"></map>
		<button type="default" @click="chooseImg">选图片</button>
	</view>
</template>

<script>
import Map from '../../../../js_sdk/ms-openMap/openMap.js';
import OpenMap from '@/js_sdk/fx-openMap/openMap.js';
export default {
	data() {
		return {
			// examId: '',
			// isWX: false //是否微信打开
			//102.79002
			//24.966476
			longitude: 102.793706,
			latitude: 24.964393,
			covers: [
				{
					longitude: 102.793706,
					latitude: 24.964393,
					iconPath: '../../../../static/icon/dingwei.png',
					width: 20,
					height: 20,
					callout: {
						//自定义标记点上方的气泡窗口 点击有效
						content: '车辆地点', //文本
						color: '#ffffff', //文字颜色
						fontSize: 14, //文本大小
						borderRadius: 2, //边框圆角
						bgColor: '#777', //背景颜色
						display: 'ALWAYS' //常显
					}
				}
			]
		};
	},
	computed: {
		paymentInfo() {
			return this.$store.state.edu.paymentInfo;
		},
		unifiedPaymentPaid() {
			return this.$store.state.edu.unifiedPaymentPaid;
		},
		eduUnifiedPaymentQR() {
			return this.$store.state.edu.eduUnifiedPaymentQR;
		}
	},
	watch: {
		unifiedPaymentPaid(newData, oldData) {
			let that = this;
			if (newData) {
				uni.showToast({
					icon: 'success',
					title: '订单已支付'
				});
				setTimeout(() => {
					uni.navigateTo({
						url: 'createSuccess?examId=' + that.examId
					});
				}, 1000);
			}
		}
	},
	onLoad(options) {
		// let that = this;
		// if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
		// 	that.examId = options.examId;
		// 	//初始化页面
		// 	that.$store.commit('req_getUnifiedPaymentInfo', that.examId);
		// }
		// //判断是否微信扫码打开
		// var ua = navigator.userAgent.toLowerCase();
		// if (ua.match(/MicroMessenger/i) == 'micromessenger') {
		// 	that.isWX = true;
		// 	// console.log('微信浏览器');
		// } else {
		// 	that.isWX = false;
		// 	// console.log('其他浏览器');
		// 	uni.showModal({
		// 		title: '提示',
		// 		content: '请在微信打开',
		// 		showCancel: false,
		// 		confirmText: '知道了',
		// 		success: function(res) {}
		// 	});
		// }
	},
	onShow() {
		let that = this;
		//删除左上角返回
		// document.querySelector('.uni-page-head-hd').style.display = 'none';

		//判断这个订单是否需要付款
		// that.$store.commit('req_howMuchDoesThisOrderCost', that.examId);
	},
	methods: {
		submit: function() {
			let that = this;
			that.$store.commit('unifiedPaymentPay', that.examId);
			// if (that.isWX) {
			// 	//开始微信支付
			// 	that.$store.commit('unifiedPaymentPay', that.examId);
			// } else {
			// 	uni.showModal({
			// 		title: '提示',
			// 		content: '请在微信打开',
			// 		showCancel: false,
			// 		confirmText: '好的',
			// 		success: function(res) {}
			// 	});
			// }
		},
		geta: function() {
			let that = this;

			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					if (res.latitude) {
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.covers[0].longitude = res.longitude;
						that.covers[0].latitude = res.latitude;
					}
				},
				complete: function(res) {
					alert('当前位置的经度：' + res.longitude + '当前位置的纬度：' + res.latitude);
					console.log(res);
				}
			});
		},
		goto: function() {
			let that = this;
			// alert(that.longitude+ ','+that.latitude)
			console.log(123);
			// Map.openMap(that.latitude, that.longitude, '车辆地点', 'gcj02')

			//打开地图app
			var options = {
				origin: {
					//导航起点坐标和名称,如果不传则起点为当前位置
					latitude: that.latitude + 0.01,
					longitude: that.longitude + 0.01,
					name: '起点名称'
				},
				destination: {
					//导航终点点坐标和名称
					latitude: that.latitude,
					longitude: that.longitude,
					name: '终点名称'
				},
				mode: 'drive' //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
			};
			//只有有终点(起点默认为当前位置)
			var options = {
				destination: {
					//导航终点点坐标和名称
					latitude: that.latitude,
					longitude: that.longitude,
					name: '终点名称'
				},
				mode: 'drive' //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
			};
			OpenMap.openMap(options, 'gcj02');
		},
		chooseImg: function() {
			uni.chooseImage({
			    count: 6, //默认9
			    sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
			    sourceType: ['album'], //从相册选择
			    success: function (res) {
			        console.log(JSON.stringify(res.tempFilePaths));
			    }
			});
		}
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
