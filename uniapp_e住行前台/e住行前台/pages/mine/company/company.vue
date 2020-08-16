<template>
	<view style="padding-top: 10px;">
		<view class="topBox">
			<view class="topBoxItem">
				<view class="topItemTop">{{companyList.length}}</view>
				<view class="topItemBottom">公司总数</view>
			</view>
			<view class="topBoxItem">
				<view class="topItemTop">{{normalCount}}</view>
				<view class="topItemBottom">异常数量</view>
			</view>
		</view>
		<view class="tableBox">
			<view class="tableTitle">
				<view class="tableItem" style="width: 280rpx;">公司名称</view>
				<view class="tableItem" style="width: 120rpx;">联系人</view>
				<view class="tableItem" style="width: 180rpx;">电话</view>
				<view class="tableItem" style="width: 100rpx;">状态</view>
			</view>
			<block v-for="(item, index) in companyList" :key="index">
				<view class="tableList" @click="toCompanyInfo(item.id)">
					<view class="tableItem" style="width: 280rpx;">{{item.companyName}}</view>
					<view class="tableItem" style="width: 120rpx;">{{item.linkman}}</view>
					<view class="tableItem" style="width: 180rpx;">{{item.tel}}</view>
					<view class="tableItem green" v-if="item.state" style="width: 100rpx;">正常</view>
					<view class="tableItem red" v-else style="width: 100rpx;">停用</view>
				</view>
			</block>
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
	computed: {
		companyList() {
			return this.$store.state.company.companyList;
		},
		normalCount() {
			return this.$store.state.company.normalCount;
		},
	},
	onShow() {
		this.$store.dispatch('initCompanyList');
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
	margin-bottom: 55px;
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
	font-size: 22rpx;
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
.green{
	color: #3eb352;
	font-weight: bold;
}
.red{
	color: $uni-color-error;
	font-weight: bold;
}
</style>
