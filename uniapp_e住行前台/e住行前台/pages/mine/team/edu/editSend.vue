<template>
	<view class="editSend">
		<textarea class="textareClass" maxlength="-1" placeholder="在此输入要发送的内容（注意:不可换行）" @blur="bindTextAreaBlur" auto-height />
		<view class="sendButton" @click="confirm">发 送</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {
		bindTextAreaBlur: function(e) {
			console.log(e.detail.value);
		}
	}
};
</script>

<style lang="scss" scoped>
.sendButton {
	width: 91%;
	margin: 0 auto;
	height: 40px;
	border-radius: 100px;
	font-size: 16px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	position: fixed;
	bottom: 10px;
	left: 0;
	right: 0;
	background-color: #4cd964;
}
.textareClass {
	min-height: 30vh;
	text-align: left;
	padding: 10px;
	width: 670rpx;
	margin: 12px auto 60px auto;
	background-color: #f3f3f3;
	border-radius: 2px;
	color: #333;
}
</style>
