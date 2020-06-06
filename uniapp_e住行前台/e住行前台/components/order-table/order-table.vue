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
			<view class="table-list-item" @click="toOrderInfo(item.id)">
				<view class="table-cont-item short">
					<text :class="item.originClass">{{ item.origin }}</text>
				</view>
				<view class="table-cont-item">张是是三</view>
				<view class="table-cont-item long">3×智享大床房</view>
				<view class="table-cont-item short">05-26</view>
				<view class="table-cont-item short">05-26</view>
				<view class="table-cont-item short">12000</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'OrderTable',
	props: {
		type: {
			type: String,
			default: 'default'
		},
		inverted: {
			type: Boolean,
			default: false
		},
		text: {
			type: [String, Number],
			default: ''
		},
		size: {
			type: String,
			default: 'normal'
		}
	},
	data() {
		return {
			orderList: [
				{
					id: 1,
					origin: '美团',
					originClass: 'meituan'
				},
				{
					id: 2,
					origin: '携程',
					originClass: 'xiecheng'
				}
			]
		};
	},
	mounted() {},
	methods: {
		toOrderInfo(orderId){
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
}

.table-list-item {
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
</style>
