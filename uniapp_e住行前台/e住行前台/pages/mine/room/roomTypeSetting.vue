<template>
	<view class="roomTypeSetting">
		<uni-list style="text-align: left;padding-bottom: 60px;">
			<uni-list-item style="font-weight: 600;" title="豪华大床房" note="￥100" @switchChange="usingType" :switchChecked="isUsing" showSwitch="true" :showArrow="false" thumb="/static/icon/logo.png" />
			<navigator url="roomSetting"><uni-list-item title="301" /></navigator>
			<navigator url="roomSetting"><uni-list-item title="301" /></navigator>
			<navigator url="roomSetting"><uni-list-item title="301" /></navigator>
			<navigator url="roomSetting"><uni-list-item title="301" /></navigator>
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
		usingType(e) {
			console.log(e);
		}
	}
};
</script>

<style lang="scss" scoped>
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
