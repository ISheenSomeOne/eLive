<template>
	<view>
		<uni-section class="titleClass" title="统一支付链接" type="line"></uni-section>
		<input class="input" @input="formChange" :value="unifiedPaymentLink" />
		<uni-section class="titleClass" title="学生报名二维码" type="line"></uni-section>
		<image class="qr" :src="qr" mode="aspectFit"></image>
	</view>
</template>

<script>
export default {
	data() {
		return {
			unifiedPaymentLink: '',
			showLink: false
		};
	},
	onLoad(options) {
		let that = this;
		//初始化成功页面
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			if (options.payWay != 2) {
				that.showLink = true;
				that.unifiedPaymentLink = 'http://localhost:8080/pages/mine/team/edu/unifiedPayment?examId=' + that.examId;
			}
			that.$store.commit('req_getExamLinkGroup', that.examId);
		}
	},
	computed: {
		qr() {
			return this.$store.state.edu.qr;
		}
	},
	methods: {}
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
.qr {
	margin-top: 30px;
	width: 500rpx;
	max-width: 400px;
}
</style>
