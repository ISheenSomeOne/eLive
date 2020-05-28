<template>
	<view class="container">
		<picker mode="selector" value="index" :range="typepikerData" @change="typeChange">
			<view>{{typepikerData[typeIndex]}}</view>
		</picker>
		<uni-grid :column="3" :show-border="false" :highlight="false">
			<uni-grid-item>
				<view class="room kongxian">
					<text>301</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room yuliu">
					<text title="301232132132131">123123</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room zaizhu">
					<text>301</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room chaoshi">
					<text>301</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room dasao">
					<text title="301232132132131">301232132132131</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room weixiu">
					<text>301</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room baoliu">
					<text>301</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room">
					<text title="301232132132131">301232132132131</text>
				</view>
			</uni-grid-item>
			<uni-grid-item>
				<view class="room">
					<text>301</text>
				</view>
			</uni-grid-item>
		</uni-grid>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				href: 'https://uniapp.dcloud.io/component/README?id=uniui',
				typepikerData: ['1楼','2楼','3楼'],
				typeIndex: 0
			}
		},
		methods: {
			typeChange:function(e){
				this.typeIndex = e.detail.value;
			}
		}
	}
</script>

<style lang="scss">
	.container {
		padding: 20px;
		font-size: 14px;
		line-height: 24px;
	}

	.room {
		text-align: center;
		height: 90%;
		width: 90%;
		background-color: #007AFF;
		margin: 5%;
		color: #FFFFFF;
		display: flex;
		flex-direction: column;
		justify-content: center;
		font-weight: bold;
	}

	.room text {
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
	
	.kongxian{
		background-color: $uni-color-success;
	}
	
	.yuliu{
		background-color: #54d2ff;
	}
	
	.zaizhu{
		background-color: $uni-color-primary;
	}
	
	.chaoshi{
		background-color: $uni-color-error;
	}
	
	.dasao{
		background-color: #999999;
	}
	
	.weixiu{
		background-color: $uni-color-warning;
	}
	
	.baoliu{
		background-color: #343a40;
	}
</style>
