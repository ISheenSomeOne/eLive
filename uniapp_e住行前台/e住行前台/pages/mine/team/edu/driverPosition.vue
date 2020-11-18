<template>
	<view class="container999">
		<uni-section class="titleClass" title="上车点" type="line"></uni-section>
		<block v-for="(startingPointInformation, index1) in driverSeeInfo.startingPointInformation" :key="index1">
			<view class="line">
				<view class="lineLeft">上车点{{ index1 + 1 }}</view>
				<view class="lineRight">
					{{ startingPointInformation.name }}
					<view
						:class="startingPointInformation.isArrived ? 'tips fontGreen' : 'tips'"
						@click="look(startingPointInformation.name, startingPointInformation.longitude, startingPointInformation.latitude)"
					>
						导航
						<text v-show="startingPointInformation.isArrived">（已到达）</text>
					</view>
				</view>
			</view>
		</block>
		<uni-section class="titleClass" title="下车点" type="line"></uni-section>
		<block v-for="(targetLocationInformation, index2) in driverSeeInfo.targetLocationInformation" :key="index2">
			<view class="line">
				<view class="lineLeft">下车点{{ index2 + 1 }}</view>
				<view class="lineRight">
					{{ targetLocationInformation.name }}
					<view class="tips" @click="look(startingPointInformation.name, targetLocationInformation.longitude, targetLocationInformation.latitude)">导航</view>
				</view>
			</view>
		</block>
		<uni-section class="titleClass" title="定位（方便乘客找到车辆）" type="line"></uni-section>
		<button class="positionButton" @click="getLocation" type="primary">点击定位</button>
		<view v-show="positionSuccess == 0" class="positionTip fontBlue">获取定位（方便乘客查找）</view>
		<view v-show="positionSuccess == 1" class="positionTip fontGreen">定位成功</view>
		<view v-show="positionSuccess == 2" class="positionTip fontRed">请在设置中打开手机定位</view>
		<uni-section class="titleClass" title="上传停车位置图片" type="line"></uni-section>
		<view class="imgBox clearfix">
			<block v-for="(item, index) in imgList" :key="index"><image @click="previewImage(index)" class="imgClass" :src="item" mode="aspectFill"></image></block>
			<image class="imgClass" @click="chooseImg" src="../../../../static/icon/addImg.svg" mode="aspectFit"></image>
		</view>
		<view class="buttonBox" @click="showDrawer('showLeft')">通知乘客我已到达</view>
		<uni-drawer ref="showLeft" mode="left" :width="320">
			<view class="showDrawerTitle">选择到达的地点</view>
			<uni-list>
				<block v-for="(startingPointInformation, index1) in driverSeeInfo.startingPointInformation" :key="index1">
					<uni-list-item
						class="itemClass"
						@click="submit(startingPointInformation.name)"
						:title="startingPointInformation.isArrived ? startingPointInformation.name + '（已到达）' : startingPointInformation.name"
					/>
				</block>
			</uni-list>
			<view class="close">
				<view class="word-btn" hover-class="word-btn--hover" :hover-start-time="20" :hover-stay-time="70" @click="closeDrawer('showLeft')">
					<button class="closeDrawer" size="mini" type="warn">返 回</button>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
import OpenMap from '@/js_sdk/fx-openMap/openMap.js';
export default {
	data() {
		return {
			examPathId: '',
			imgList: [], //图片列表
			longitude: '', //经度
			latitude: '', //纬度
			positionSuccess: 0, //成功定位
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
		driverSeeInfo() {
			return this.$store.state.edu.driverSeeInfo;
		},
		needRefresh() {
			return this.$store.state.edu.needRefresh;
		}
	},
	watch: {
		needRefresh(newData, oldData) {
			let that = this;
			if (newData) {
				that.$store.commit('req_getDriverSeeInfo', that.examPathId);
				that.imgList = [];
				that.$store.commit('setNeedRefresh');
			}
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examPathId != '' && options.examPathId != 'undefined' && options.examPathId != null) {
			that.examPathId = options.examPathId;
			that.$store.commit('req_getDriverSeeInfo', that.examPathId);
		}
	},
	onShow() {
		let that = this;
		// that.getLocation();
	},
	methods: {
		//打开导航
		look(name, longitude, latitude) {
			let that = this;

			//打开地图app
			// var options = {
			// origin: {
			// 	//导航起点坐标和名称,如果不传则起点为当前位置
			// 	latitude: that.latitude + 0.01,
			// 	longitude: that.longitude + 0.01,
			// 	name: '起点名称'
			// },
			// destination: {
			// 	//导航终点点坐标和名称
			// 	latitude: latitude,
			// 	longitude: longitude,
			// 	name: name
			// },
			// mode: 'walk' //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
			// };
			//只有有终点(起点默认为当前位置)
			var options = {
				destination: {
					//导航终点点坐标和名称
					latitude: latitude,
					longitude: longitude,
					name: name
				},
				mode: 'walk' //导航方式 公交：bus驾车：drive（默认）,步行：walk,骑行：bike
			};
			OpenMap.openMap(options, 'gcj02');
		},
		// 打开窗口
		showDrawer(e) {
			this.$refs[e].open();
		},
		// 关闭窗口
		closeDrawer(e) {
			this.$refs[e].close();
		},
		chooseImg() {
			let that = this;
			uni.chooseImage({
				count: 6, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: function(res) {
					let data = res.tempFilePaths;
					for (let i = 0; i < data.length; i++) {
						that.imgList.push(data[i]);
					}
				}
			});
		},
		previewImage(data) {
			let that = this;
			let img = [];
			img.push(that.imgList[data]);
			// 预览图片
			uni.previewImage({
				urls: img
			});
		},
		getLocation() {
			let that = this;
			uni.showLoading({
				mask: true,
				title: '定位中...'
			});
			uni.getLocation({
				type: 'gcj02',
				success: function(res) {
					if (res.latitude) {
						that.positionSuccess = 1;
						that.longitude = res.longitude;
						that.latitude = res.latitude;
						that.covers[0].longitude = res.longitude;
						that.covers[0].latitude = res.latitude;
					}
				},
				fail: function() {
					uni.showModal({
						title: '提示',
						content: '请先打开手机定位',
						showCancel: false,
						confirmText: '好的',
						success: function(res) {
							if (res.confirm) {
							} else if (res.cancel) {
							}
						}
					});
					that.positionSuccess = 2;
				},
				complete: function(res) {
					// alert('当前位置的经度：' + res.longitude + '当前位置的纬度：' + res.latitude);
					console.log(res);
					uni.hideLoading();
				}
			});
		},
		submit(name) {
			let that = this;
			if (that.longitude != '') {
				let uploadList = [];
				for (let i = 0; i < that.imgList.length; i++) {
					let item = that.imgList[i];
					uploadList.push(item);
				}
				let val = {
					uploadList: uploadList,
					longitude: that.longitude,
					latitude: that.latitude,
					examPathId: that.examPathId,
					name: name
				};
				that.$store.commit('req_driverPositioning', val);
				that.closeDrawer('showLeft');
			} else {
				uni.showToast({
					title: '您还没有定位哦',
					duration: 2000,
					icon: 'none'
				});
			}
		}
	}
};
</script>

<style lang="scss">
.showDrawerTitle {
	height: 44px;
	line-height: 44px;
	font-size: 18px;
	font-weight: bold;
	background-color: $uni-color-primary;
	color: #fff;
	text-align: center;
	margin-bottom: 10px;
}
.closeDrawer {
	width: 70%;
	margin-top: 60rpx;
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
				color: $uni-color-primary;
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
	width: 690rpx;
	font-size: 14px;
	min-height: 75vh;
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}
.positionButton {
	width: 90%;
	margin-top: 20rpx;
}
.titleClass {
	height: 44px;
	text-align: left;
	font-size: 30rpx;
	font-weight: bold;
	margin: 0;
}
.positionTip {
	font-weight: bold;
	font-size: 32rpx;
	width: 690rpx;
	margin: 30rpx auto;
}
.fontRed {
	color: $uni-color-error !important;
}
.fontGreen {
	color: $uni-color-success !important;
}
.fontBlue {
	color: $uni-color-primary !important;
}
.imgBox {
	width: 100%;
	margin: 30rpx 0;
}
.imgClass {
	float: left;
	display: block;
	height: 200rpx;
	width: 200rpx;
	margin: 15rpx;
	background-color: #f9f9f9;
	border-radius: 10rpx;
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
</style>
