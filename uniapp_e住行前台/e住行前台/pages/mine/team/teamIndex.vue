<template>
	<view>
		<uni-list style="text-align: left;">
			<navigator url="edu/eduList">
				<uni-list-item title="教育" :show-extra-icon="true" :extra-icon="{ color: '#007aff', size: '22', type: 'person-filled' }" />
			</navigator>
			<navigator url="meeting/meetingList">
				<uni-list-item title="会议" :show-extra-icon="true" :extra-icon="{ color: '#999999', size: '22', type: 'chatboxes-filled' }" />
			</navigator>
			<navigator url="tour/tourList">
				<uni-list-item title="旅行团" :show-extra-icon="true" :extra-icon="{ color: '#4cd964', size: '22', type: 'flag-filled' }" />
			</navigator>
		</uni-list>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			};
		}
	}
</script>

<style lang="scss">

</style>
