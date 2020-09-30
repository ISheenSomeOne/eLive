<template>
	<view>
		<view class="container999">
			<uni-section class="titleClass" title="订单详情" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">会议名称</view>
				<view class="lineRight">2020云南省公务员会议</view>
			</view>
			<view class="line">
				<view class="lineLeft">会议ID</view>
				<view class="lineRight">zxkj1243543542</view>
			</view>
			<view class="line">
				<view class="lineLeft">联系方式</view>
				<view class="lineRight">13122322111</view>
			</view>
			<view class="line">
				<view class="lineLeft">负责人</view>
				<view class="lineRight">张三</view>
			</view>
			<view class="line">
				<view class="lineLeft">状态</view>
				<view class="lineRight"><view class="bgYellow">报名中</view></view>
			</view>
			<view class="line">
				<view class="lineLeft">会议时间</view>
				<view class="lineRight">2020-10-30 14:00</view>
			</view>
			<view class="line">
				<view class="lineLeft">主办方</view>
				<view class="lineRight">xxxxx公司</view>
			</view>
			<view class="line">
				<view class="lineLeft">会议地址</view>
				<view class="lineRight">张三</view>
			</view>
			<view class="line">
				<view class="lineLeft">会议内容</view>
				<view class="lineRight">张三</view>
			</view>
			<view class="line">
				<view class="lineLeft">领导嘉宾</view>
				<view class="lineRight">张三，李四</view>
			</view>
			<view class="line">
				<view class="lineLeft">参会专家</view>
				<view class="lineRight">张三</view>
			</view>
			<view class="line">
				<view class="lineLeft">人数</view>
				<view class="lineRight">121</view>
			</view>
			<view class="line">
				<view class="lineLeft">主办方链接</view>
				<view class="lineRight">http://zxkj.webinn.online/meeting</view>
			</view>
			<view class="line">
				<view class="lineLeft">参会方链接</view>
				<view class="lineRight">http://zxkj.webinn.online/meeting</view>
			</view>
			<view class="line" style="height: auto;">
				<view class="lineLeft" style="line-height: 50px;">会议日程</view>
				<view class="lineRight" style="padding: 2px 0ds;">手动阀规范化课本上的反馈光华科技发达国家回复的打分间隔后即可水电费更健康的会发生个都是分开几个号</view>
			</view>
			<view class="line" style="height: auto;">
				<view class="lineLeft" style="line-height: 50px;">会议介绍</view>
				<view class="lineRight" style="padding: 2px 0ds;">手动阀规范化课本上的反馈光华科技发达国家回复的打分间隔后即可水电费更健康的会发生个都是分开几个号</view>
			</view>
			<view class="line" style="height: auto;">
				<view class="lineLeft" style="line-height: 50px;">其他事宜</view>
				<view class="lineRight" style="padding: 2px 0ds;">手动阀规范化课本上的反馈光华科技发达国家回复的打分间隔后即可水电费更健康的会发生个都是分开几个号</view>
			</view>
			<view class="line">
				<view class="lineLeft">创建时间</view>
				<view class="lineRight">2020-10-30 14:00</view>
			</view>
			<view class="line">
				<view class="lineLeft">更新时间</view>
				<view class="lineRight">2020-10-30 14:00</view>
			</view>
			<view class="line">
				<view class="lineLeft">操作员工</view>
				<view class="lineRight">张三</view>
			</view>
			<!-- 酒店信息 -->
			<uni-section class="titleClass" title="酒店信息" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">酒店名称</view>
				<view class="lineRight">昆明汇都酒店</view>
			</view>
			<view class="line">
				<view class="lineLeft">房型数量</view>
				<view class="lineRight">标间 × 10</view>
			</view>
			<view class="line">
				<view class="lineLeft">房型数量</view>
				<view class="lineRight">单间 × 10</view>
			</view>
			<!-- 财务信息 -->
			<uni-section class="titleClass" title="财务信息" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">会议费用</view>
				<view class="lineRight">￥1000</view>
			</view>
			<view class="line">
				<view class="lineLeft">押金</view>
				<view class="lineRight">￥1000</view>
			</view>
			<view class="line">
				<view class="lineLeft">总费用</view>
				<view class="lineRight">￥2000</view>
			</view>
			<view class="line">
				<view class="lineLeft">订单编号</view>
				<view class="lineRight">2898737934</view>
			</view>
		</view>
		<view class="bottomMenu"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
				options: [{
					icon: 'trash',
					text: '取消'
				}],
			buttonGroup: [
				{
					text: '修改订单',
					backgroundColor: '#ffa200',
					color: '#fff'
				},
				{
					text: '查看参会信息',
					backgroundColor: '#007aff',
					color: '#fff'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.titleClass {
	height: 40px;
	text-align: left;
	margin: 0;
}

.container999 {
	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 4%;
		border-bottom: 1px solid #f5f5f5;
	}
	.tri {
		width: 0;
		height: 0;
		border-left: 8rpx solid transparent;
		border-right: 8rpx solid transparent;
		right: 30rpx !important;
		border-top: 16rpx solid #545151;
	}
	.line {
		margin-top: 15px;
		height: 50px;
		width: 92%;
		margin: 0 auto;
		border-bottom: 1px solid #f5f5f5;
		display: flex;
		.lineRight {
			.tips {
				color: #9a9a9c;
				font-weight: bold;
			}
			flex: 1;
			height: 100%;
			display: flex;
			align-items: center;
			justify-content: space-between;
			position: relative;
		}
		.lineLeft {
			display: flex;
			width: 23%;
			align-items: center;
			height: 100%;
			font-weight: bold;
			color: #333;
		}
		.input {
			padding-right: 20rpx;
			height: 100%;
			width: 70%;
			text-align: left;
			font-size: 14px;
			color: #545151;
		}
		.picker {
			height: 100%;
			justify-content: flex-start;
			display: flex;
			align-content: center;
			width: 500rpx;
		}
		picker {
			height: 50px;
			line-height: 50px;
		}
	}
	width: 90%;
	font-size: 14px;
	min-height: 75vh;
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}

.bgGreen {
	padding: 2px 4px;
	color: #ffffff;
	background-color: #4cd964;
}

.bgYellow {
	padding: 2px 4px;
	color: #ffffff;
	background-color: #f0ad4e;
}

.bgRed {
	padding: 2px 4px;
	color: #ffffff;
	background-color: #dd524d;
	margin-left: 5px;
}
.bottomMenu {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 0;
}
.buttonBox {
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
		background-color: #007aff;
	}
</style>
