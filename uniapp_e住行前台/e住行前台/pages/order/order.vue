<template>
	<view style="height: 100%;">
		<view class="uni-tab-bar">
			<scroll-view scroll-x="true" class="uni-swiper-tab">
				<view class="swiper-list-box">
					<block v-for="(tabBar, index) in tabBars" :key="index">
						<view class="swiper-tab-list" :class="{ active: tabIndex == index }" @tap="toggleTab(index)">
							{{ tabBar.name }}
							<view class="swiper-tab-line"></view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>

		<!--内容区-->
		<view class="uni-tab-bar" style="height: 100%;background-color: #54D2FF;">
			<swiper :current="tabIndex" @change="tabChange">
				<swiper-item>
					<order-table></order-table>
				</swiper-item>
				<swiper-item>2</swiper-item>
				<swiper-item>3</swiper-item>
				<swiper-item>4</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			tabIndex: 0, //选中标签栏的序列
			contentList: ['待入住', '入住中', '全部', '创建订单'],
			tabBars: [
				{
					name: '待入住',
					id: '1'
				},
				{
					name: '入住中',
					id: '2'
				},
				{
					name: '全部',
					id: '3'
				},
				{
					name: '创建订单',
					id: '4'
				}
			],
			swiperHeight: 0
		};
	},
	methods: {
		toggleTab(index) {
			// console.log(index);
			this.tabIndex = index;
		},
		//滑动切换swiper
		tabChange(e) {
			// console.log(e.detail);
			const tabIndex = e.detail.current;
			this.tabIndex = tabIndex;
		}
	}
};
</script>

<style lang="scss" scoped>
.swiper-list-box {
	display: flex;
	justify-content: space-around;
	padding: 5px;
	height: 34px;
	line-height: 34px;
}
.swiper-tab-list {
	color: #FFFFFF;
	width: 177rpx;
	font-size: 14px;
}
.uni-tab-bar .active {
	color: #FFF;
	font-weight: bold;
}

.active .swiper-tab-line {
	border-bottom: 3px solid #FFF;
	width: 80rpx;
	margin: auto;
	// border-top: 2rpx solid #FFF;
	border-radius: 10px;
}
.uni-swiper-tab {
	background-color: $uni-color-primary;
}
</style>
