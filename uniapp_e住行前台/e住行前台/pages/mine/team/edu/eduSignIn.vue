<template>
	<view class="container999">
		<uni-section class="titleClass" title="车辆信息" type="line"></uni-section>
		<view class="line">
			<view class="lineLeft">编号</view>
			<view class="lineRight">
				{{ driverInfo.numbering }}
				<view
					v-if="driverInfo.driverLocationInformation.name == driverInfo.startingName"
					class="tips bgGreen"
					@click="look(driverInfo.driverLocationInformation.name, driverInfo.driverLocationInformation.longitude, driverInfo.driverLocationInformation.latitude)"
				>
					已到达(导航)
				</view>
				<view v-else class="tips fontRed">位置未更新</view>
			</view>
		</view>
		<view class="line">
			<view class="lineLeft">车牌号</view>
			<view class="lineRight">{{ driverInfo.carNumber }}</view>
		</view>
		<uni-section class="titleClass" title="位置照片" type="line"></uni-section>
		<view v-show="imgList.length > 0" class="imgBox clearfix">
			<block v-for="(item, index) in driverInfo.referencePictures" :key="index">
				<image @click="previewImage(index)" class="imgClass" :src="item" mode="aspectFill"></image>
			</block>
		</view>
		<view v-show="imgList.length <= 0" class="line errorTip">未提供图片信息</view>
		<view class="subSignIn"></view>
		<view class="buttonBox" @click="submit">点击签到</view>
	</view>
</template>

<script>
import OpenMap from '@/js_sdk/fx-openMap/openMap.js';
export default {
	data() {
		return {
			imgList: []
		};
	},
	computed: {
		driverInfo() {
			return this.$store.state.edu.driverInfo;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examCheckinId != '' && options.examCheckinId != 'undefined' && options.examCheckinId != null) {
			that.examCheckinId = options.examCheckinId;
			that.$store.commit('req_studentGetsDriverInfo', that.examCheckinId);
		}
	},
	mounted() {
		document.querySelector('.uni-page-head-hd').style.display = 'none';
	},
	methods: {
		previewImage(index) {
			uni.previewImage({
				urls: this.imgList,
				loop: true,
				current: index
			});
		},
		//打开导航
		look(name, longitude, latitude) {
			let that = this;
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
		submit(){
			
		}
	}
};
</script>

<style lang="scss">
.titleClass {
	text-align: left;
}
.fontRed {
	color: $uni-color-error !important;
}
.fontGreen {
	color: $uni-color-success !important;
}
.bgGreen {
	background-color: $uni-color-success !important;
	color: #fff !important;
}
.fontBlue {
	color: $uni-color-primary !important;
}
.errorTip {
	justify-content: center;
	line-height: 50px;
	color: $uni-color-error;
}
.imgBox {
	width: 100%;
	margin: 30rpx 0;
	padding-bottom: 60px;
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
				font-weight: bold;
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
</style>
