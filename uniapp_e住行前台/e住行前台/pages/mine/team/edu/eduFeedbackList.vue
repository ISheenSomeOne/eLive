<template>
	<view class="eduFeedbackList">
		<uni-section title="未反馈" type="line"></uni-section>
		<block v-if="eduDontReceiveFeedbackRemindMemberList.length != 0">
			<order-table :listType="'eduFeedbackList'" :examId="examId" :titleList="titleList" :tableList="eduDontReceiveFeedbackRemindMemberList"></order-table>
		</block>
		<uni-section title="已反馈" type="line"></uni-section>
		<block v-if="eduReceiveFeedbackRemindMemberList.length != 0">
			<order-table :listType="'eduFeedbackList'" :examId="examId" :titleList="titleList" :tableList="eduReceiveFeedbackRemindMemberList"></order-table>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			remindIndex: '',
			titleList: [
				{ cont: '姓名', width: 'short' },
				{ cont: '性别', width: 'short' },
				{ cont: '车辆', width: 'short' },
				{ cont: '出发点', width: 'normal' },
				{ cont: '酒店房间', width: 'long' },
				{ cont: '考点', width: 'normal' }
			]
		};
	},
	computed: {
		eduReceiveFeedbackRemindMemberList() {
			return this.$store.state.edu.eduReceiveFeedbackRemindMemberList;
		},
		eduDontReceiveFeedbackRemindMemberList() {
			return this.$store.state.edu.eduDontReceiveFeedbackRemindMemberList;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			if (options.remindIndex != '' && options.remindIndex != 'undefined' && options.remindIndex != null) {
				that.remindIndex = options.remindIndex;
				let val = { examId: that.examId, remindIndex: that.remindIndex };
				that.$store.commit('req_getEduRemindMemberList', val);
			}
		}
	}
};
</script>

<style lang="scss">
.eduFeedbackList {
	text-align: left;
}
</style>
