<template>
	<view class="container">
		<uni-grid :column="3" :show-border="false">
			<uni-grid-item>
				<view class="room">
					301
				</view>
			</uni-grid-item>
			<uni-grid-item><view class="room">
				301
			</view></uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui'
			}
		},
		methods: {

		}
	}
</script>

<style>
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}
	.room {
		text-align: center;
	}
</style>
