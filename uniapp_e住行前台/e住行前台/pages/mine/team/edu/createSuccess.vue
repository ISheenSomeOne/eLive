<template>
	<view>
		<uni-section class="titleClass" title="统一支付链接" type="line"></uni-section>
		<input class="input" @input="formChange" value="http://sdgfdsgsdg" />
		<uni-section class="titleClass" title="学生报名链接" type="line"></uni-section>
		<input class="input" @input="formChange" value="http://sdgfdsgsdg" />
		<image class="qr" src="../../../../static/icon/logo.png" mode="aspectFit"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods:{
	}
};
</script>

<style lang="scss" scoped>
.titleClass {
	text-align: left;
	margin: 0;
}
.plaClass {
	color: #cfcfcf;
	line-height: 50px;
}
.input {
	padding: 0 15rpx;
	margin: 0 auto;
	height: 40px;
	line-height: 40px;
	width: 690rpx;
	text-align: left;
	font-size: 14px;
	color: #545151;
	border-bottom: 1px solid #eee;
}
.qr{
	margin-top: 30px;
	width: 500rpx;
	max-width: 400px;
}
</style>
