<template>
	<view>
		<uni-list style="text-align: left;padding-bottom: 60px;">
			<navigator url="roomTypeSetting"><uni-list-item title="豪华大床房" rightText="启用" :show-extra-icon="true" :extra-icon="{color: '#007aff',size: '22',type: 'home-filled'}" /></navigator>
			<navigator url="roomTypeSetting"><uni-list-item title="豪华大床房" rightText="启用" :show-extra-icon="true" :extra-icon="{color: '#007aff',size: '22',type: 'home-filled'}" /></navigator>
			<navigator url="roomTypeSetting"><uni-list-item title="豪华大床房" rightText="启用" :show-extra-icon="true" :extra-icon="{color: '#007aff',size: '22',type: 'home-filled'}" /></navigator>
			<navigator url="roomTypeSetting"><uni-list-item title="豪华大床房" rightText="启用" :show-extra-icon="true" :extra-icon="{color: '#007aff',size: '22',type: 'home-filled'}" /></navigator>
		</uni-list>
		<button class="addType" hover-class="addTypeHover">新增房型</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			usingSwitch(id,e){
				console.log(e)
			},
			jupmTo(page){
				uni.navigateTo({
					url: page
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.addType{
	transition: all 0.1s;
	background-color: $uni-color-success;
	color: #FFFFFF;
	width: 650rpx;
	font-size: 16px;
		position: fixed;
		left: 0;
		right: 0;
		bottom: 10px;
}
.addTypeHover{
	background-color: #3eb352;
}
</style>
