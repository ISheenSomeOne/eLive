<template>
	<view style="padding-top: 10px;">
		<view class="topBox">
			<view class="topBoxItem">
				<view class="topItemTop">3</view>
				<view class="topItemBottom">公司数量</view>
			</view>
		</view>
		<view class="tableBox">
			<view class="tableTitle">
				<view class="tableItem" style="width: 300rpx;">公司名称</view>
				<view class="tableItem" style="width: 120rpx;">联系人</view>
				<view class="tableItem" style="width: 180rpx;">电话</view>
			</view>
			<!-- <block v-for="(item, index) in listData" :key="index"> -->
			<view class="tableList" @click="toCompanyInfo(123)">
				<view class="tableItem" style="width: 300rpx;">云南住行科技有限公司</view>
				<view class="tableItem" style="width: 120rpx;">张三</view>
				<view class="tableItem" style="width: 180rpx;">13888131313</view>
			</view>
			<view class="tableList">
				<view class="tableItem" style="width: 300rpx;">云南住行科技有限公司</view>
				<view class="tableItem" style="width: 120rpx;">张三</view>
				<view class="tableItem" style="width: 180rpx;">13888131313</view>
			</view>
			<!-- </block> -->
		</view>
		<view class="bottomMenu"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			options: [],
			buttonGroup: [
				{
					text: '修改协议',
					backgroundColor: '#ffa200',
					color: '#fff'
				},
				{
					text: '添加公司',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			]
		};
	},
	methods: {
		buttonClick(e) {
			console.log(e.index);
			if (e.index == 0) {
			} else if (e.index == 1) {
				uni.navigateTo({
					url: 'companyInfo'
				});
			}
		},
		toCompanyInfo(id) {
			uni.navigateTo({
				url: 'companyInfo?id=' + id
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.topBox {
	margin: 0px 10px;
	padding: 10px 30rpx;
	background-color: #007aff;
	color: #fff;
	border-radius: 10px;
	display: flex;
	justify-content: space-around;
	text-align: center;
	font-size: 12px;
}
.topBoxItem {
}

.topItemTop {
	font-size: 24px;
	font-weight: bold;
	line-height: 40px;
}
.topItemBottom {
	font-size: 12px;
	line-height: 20px;
}

.tableBox {
	margin: 10px;
	color: #333;
	border-radius: 10px;
}
.tableTitle {
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	font-weight: bold;
	height: 30px;
	line-height: 30px;
	background-color: #eee;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
}
.tableList {
	display: flex;
	justify-content: space-between;
	font-size: 20rpx;
	height: 60rpx;
	line-height: 60rpx;
	border-bottom: 1px solid #f8f8f8;
}
.tableItem {
	width: 100rpx;
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.bottomMenu {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
</style>
