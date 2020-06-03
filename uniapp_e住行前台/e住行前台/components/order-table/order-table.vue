<template>
	<view class="table-box">
		<view class="table-list-item table-title">
			<view class="table-cont-item">来源</view>
			<view class="table-cont-item">姓名</view>
			<view class="table-cont-item">房间信息</view>
			<view class="table-cont-item">入离日期</view>
			<view class="table-cont-item">房价</view>
		</view>
		<view class="table-list-item">
			<view class="table-cont-item">美团</view>
			<view class="table-cont-item">张三</view>
			<view class="table-cont-item">1间 智享大床房</view>
			<view class="table-cont-item">05-26至05-27</view>
			<view class="table-cont-item">100</view>
		</view>
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
			badgeStyle: ''
		};
	},
	mounted() {},
	methods: {}
};
</script>

<style lang="scss" scoped>
.table-box {
	font-size: 14px;
}

.table-cont-item {
}

.table-title {
}
</style>
