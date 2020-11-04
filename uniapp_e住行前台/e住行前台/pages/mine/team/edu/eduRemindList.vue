<template>
	<view class="eduRemaindList">
		<uni-section title="需反馈" type="line"></uni-section>
		<block v-for="(item1, index) in eduNeedFeedbackRemindList" :key="index">
			<uni-list><uni-list-item @click="checkFeedback(item1.remindIndex)" :title="item1.remindContent" :rightText="item1.createTime" :show-arrow="false" /></uni-list>
		</block>
		<uni-section title="无需反馈" type="line"></uni-section>
		<block v-for="(item2, index) in eduDontNeedFeedbackRemindList" :key="index">
			<uni-list><uni-list-item :title="item2.remindContent" :rightText="item2.createTime" :show-arrow="false" /></uni-list>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: ''
		};
	},
	computed: {
		eduNeedFeedbackRemindList() {
			return this.$store.state.edu.eduNeedFeedbackRemindList;
		},
		eduDontNeedFeedbackRemindList() {
			return this.$store.state.edu.eduDontNeedFeedbackRemindList;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			that.$store.commit('req_getEduRemindList', that.examId);
		}
	},
	methods: {
		checkFeedback: function(remindIndex) {
			let that = this;
			uni.navigateTo({
				url: 'eduFeedbackList?examId=' + that.examId + '&remindIndex=' + remindIndex
			});
		}
	}
};
</script>

<style lang="scss">
.eduRemaindList {
	text-align: left;
}
</style>
