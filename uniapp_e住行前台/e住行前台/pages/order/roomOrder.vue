<template>
	<view class="roomOrder">
		<order-table :orderList="orderList"></order-table>
		<button v-show="orderPageCanReq" class="more-btn" @click="getMore" size="mini" type="default">查看更多···</button>
	</view>
</template>

<script>
	const util = require('../../util/util.js');  //防重点击函数
	export default {
		data() {
			return {
				
			};
		},
		onLoad() {
			this.$store.commit('resetOrderPageNum',false)
			this.$store.dispatch('initOrderListInfo',2)
		},
		computed: {
			orderList() {
				return this.$store.state.order.orderList
			},
			orderPageCanReq() {
				return this.$store.state.order.orderPageCanReq
			},
		},
		methods:{
			//获取更多order信息
			getMore: util.throttle(function(e) {
				//加载更多
				this.$store.dispatch("initOrderListInfo",2)
			}, 1000), //防重点击,1s内只可点击一次
		},
	}
</script>

<style lang="scss" scoped>
	.more-btn{
		width: 500rpx;
	}
</style>
