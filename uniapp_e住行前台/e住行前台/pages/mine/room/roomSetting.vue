<template>
	<view class="roomSetting">
		<uni-list style="text-align: left;padding-bottom: 60px;">
			<uni-list-item
				style="font-weight: 600;"
				title="301"
				@switchChange="usingRoom"
				:switchChecked="isUsing"
				showSwitch="true"
				:showArrow="false"
				thumb="/static/icon/logo.png"
			/>
			<view class="listBox">
				<view class="listItem">
					<view class="leftItem">建筑</view>
					<input class="iptClass" type="text" placeholder="请输入建筑地址" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">建筑</view>
					<view class="rightItem"><input class="iptClass" type="text" placeholder="请输入建筑地址" placeholder-class="iptPla" value="" /></view>
				</view>
			</view>
		</uni-list>
		<view class="bottomMenu"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isUsing: true,
			options: [
				{
					icon: 'trash',
					text: '删除'
				}
			],
			buttonGroup: [
				{
					text: '修改房型信息',
					backgroundColor: '#ffa200',
					color: '#fff'
				},
				{
					text: '新增房间',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			]
		};
	},
	methods: {
		usingRoom(e) {
			this.isUsing = e.value;
		}
	}
};
</script>

<style lang="scss" scoped>
.listBox {
	padding: 15px;
}

.listItem {
	display: flex;
	justify-content: left;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #EEEEEE;
}
.leftItem {
	font-size: 14px;
	font-weight: 600;
}
.rightItem {
}
.iptClass{
	margin-left: 15px;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	width: 70%;
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
