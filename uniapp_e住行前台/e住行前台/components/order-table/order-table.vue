<template>
	<view class="table-box">
		<view class="table-list-item table-title">
			<view class="table-cont-item short">来源</view>
			<view class="table-cont-item">姓名</view>
			<view class="table-cont-item long">房间信息</view>
			<view class="table-cont-item short">入住</view>
			<view class="table-cont-item short">离店</view>
			<view class="table-cont-item short">房价</view>
		</view>
		<block v-for="(item, index) in orderList" :key="index">
			<view class="table-list-item" @click="toOrderInfo(item.orderId)">
				<uni-badge class="tuiYaTip" v-show="item.state == 62" text="退押金" size="small" type="error"></uni-badge>
				<view class="table-cont-item short">
					<text :class="item.originClass">{{ item.source }}</text>
				</view>
				<view class="table-cont-item">{{item.OwnerName}}</view>
				<view class="table-cont-item long">
					<block v-for="(roomType, inde) in item.roomTypeInfo" :key="inde">{{roomType.roomCount+'×'+roomType.roomTypeName}}</block>
				</view>
				<view class="table-cont-item short">{{item.checkin}}</view>
				<view class="table-cont-item short">{{item.checkout}}</view>
				<view class="table-cont-item short">{{item.price}}</view>
			</view>
		</block>
	</view>
</template>

<script>
	export default {
		name: 'OrderTable',
		props: ['orderList'],
		data() {
			return {
				// orderList: [{
				// 		id: 1,
				// 		source: '美团',
				// 		originClass: 'meituan'
				// 	},
				// 	{
				// 		id: 2,
				// 		source: '携程',
				// 		originClass: 'xiecheng'
				// 	},
				// 	{
				// 		id: 3,
				// 		source: '微信',
				// 		originClass: 'weixin'
				// 	}
				// ]
			};
		},
		beforeUpdate() {
			// let info = uni.createSelectorQuery().select(".table-box");
			// 	info.boundingClientRect(function(data) { //data - 各种参数
			// 	console.log(data.height)
			// }).exec()
		},
		methods: {
			toOrderInfo(orderId) {
				uni.navigateTo({
					url: '/pages/order/orderInfo?orderId=' + orderId
				});
			}
		}
	};
</script>

<style lang="scss" scoped>
	.table-box {
		font-size: 13px;
		min-height: 75vh;
		margin-bottom: 10px;
	}

	.table-list-item {
		position: relative;
		display: flex;
		justify-content: space-between;
		text-align: center;
		height: 40px;
		line-height: 40px;
		border-bottom: 1px solid #f1f1f1;
		width: 730rpx;
		margin: 0 auto;
	}

	.table-cont-item {
		width: 110rpx;
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}

	.short {
		width: 85rpx;
	}

	.long {
		width: 205rpx;
	}

	.table-title {
		font-weight: bold;
	}

	.meituan {
		padding: 5px;
		background-color: #ffc300;
	}

	.xiecheng {
		padding: 5px;
		background-color: #3983e5;
		color: #fff;
	}

	.weixin {
		padding: 5px;
		background-color: #09bb07;
		color: #fff;
	}

	.tuiYaTip {
		position: absolute;
		top: -4px;
		right: -5px;
	}
</style>
