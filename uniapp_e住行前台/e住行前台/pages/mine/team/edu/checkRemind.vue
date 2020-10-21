<template>
	<view class="checkRemind">
		<view v-if="travel != ''" class="cont">{{travel}}</view>
		<view v-if="remindContent != ''" class="cont">{{remindContent}}</view>
		<view v-show="needFeedback" class="buttonBoxAdd" @click="confirm">确 认</view>
		<view v-show="!needFeedback" class="buttonBoxAdd" style="background-color: #999999;">已反馈</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	computed:{
		travel() {
			return this.$store.state.edu.travel;
		},
		remindContent() {
			return this.$store.state.edu.remindContent;
		},
		needFeedback() {
			return this.$store.state.edu.needFeedback;
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examRemindId != '' && options.examRemindId != undefined && options.examRemindId != null) {
			that.examRemindId = option.examRemindId;
			that.$store.commit('req_getRemind', that.examRemindId);
		}
	},
	methods:{
		confirm:function(){
			this.$store.commit('req_examConfirmRemind', this.examRemindId);
		}
	}
};
</script>

<style lang="scss">
.cont {
	text-align: left;
	padding: 30rpx;
	text-indent: 2em;
	margin-bottom: 60px;
}
.buttonBoxAdd {
	width: 91%;
	margin: 0 auto;
	height: 40px;
	border-radius: 100px;
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
</style>
