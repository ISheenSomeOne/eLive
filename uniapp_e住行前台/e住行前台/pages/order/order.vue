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
		<view class="uni-tab-bar">
			<swiper :current="tabIndex" @change="tabChange" :style="{ height: swiperHeight + 'px' }">
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
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
			swiperHeight: ''
		};
	},
	mounted(){
		this.setSwiperHeight();
	},
	methods: {
		toggleTab(index) {
			this.tabIndex = index;
		},
		//滑动切换swiper
		tabChange(e) {
			const tabIndex = e.detail.current;
			this.tabIndex = tabIndex;
			this.setSwiperHeight();
		},
		setSwiperHeight() {
			let query = uni.createSelectorQuery().in(this);
			query.selectAll('.swiper-item').boundingClientRect();
			query.exec(res => {
				this.swiperHeight = res[0][this.tabIndex].height;
			});
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
	color: #ffffff;
	width: 177rpx;
	font-size: 14px;
}
.uni-tab-bar .active {
	color: #fff;
	font-weight: bold;
}

.active .swiper-tab-line {
	border-bottom: 3px solid #fff;
	width: 80rpx;
	margin: auto;
	border-radius: 10px;
}
.uni-swiper-tab {
	background-color: $uni-color-primary;
}
</style>
