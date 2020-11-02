<template>
	<view>
		<uni-section v-show="showLink" class="titleClass" title="统一支付二维码" type="line"></uni-section>
		<image v-show="showLink" class="qr" :src="payQR" mode="widthFix"></image>
		<uni-section class="titleClass" title="学生报名二维码" type="line"></uni-section>
		<image class="qr" :src="qr" mode="widthFix"></image>
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
			if (options.payWay == 1) {
				that.showLink = true;
				// that.unifiedPaymentLink = 'https://group.webinn.online/phone/#/pages/mine/team/edu/unifiedPayment?examId=' + that.examId;
			}
			// console.log(that.unifiedPaymentLink)
			that.$store.commit('req_getExamLinkGroup', that.examId);
		}
	},
	computed: {
		qr() {
			return this.$store.state.edu.qr;
		},
		payQR() {
			return this.$store.state.edu.payQR;
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
	margin: 30rpx 0;
	width: 550rpx;
}
</style>
