<template>
	<view class="eduSignInInfo">
		<uni-section title="未到名单" type="line"></uni-section>
		<block v-if="unsignedMembers.length != 0">
			<order-table :listType="'eduFeedbackList'" :examId="examId" :titleList="titleList" :tableList="unsignedMembers"></order-table>
		</block>
		<uni-section title="已到名单" type="line"></uni-section>
		<block v-if="membersWhoHaveSignedIn.length != 0">
			<order-table :listType="'eduFeedbackList'" :examId="examId" :titleList="titleList" :tableList="membersWhoHaveSignedIn"></order-table>
		</block>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			examPathId: '',
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
		membersWhoHaveSignedIn() {
			return this.$store.state.edu.membersWhoHaveSignedIn;
		},
		unsignedMembers() {
			return this.$store.state.edu.unsignedMembers;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examPathId != '' && options.examPathId != 'undefined' && options.examPathId != null) {
			that.examPathId = options.examPathId;
			that.examId = options.examId
			that.$store.commit('req_getExamCheckinMemberInfo', that.examPathId);
		}
	}
};
</script>

<style lang="scss">
.eduSignInInfo {
	text-align: left;
}
</style>
