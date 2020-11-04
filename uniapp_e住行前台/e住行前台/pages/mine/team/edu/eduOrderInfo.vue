<template>
	<view>
		<view class="container999">
			<uni-section class="titleClass" title="订单详情" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">考试名称</view>
				<view class="lineRight">{{ eduOrderInfo.examName }}</view>
			</view>
			<view class="line" v-if="eduOrderInfo.checkinDate">
				<view class="lineLeft">入离时间</view>
				<view class="lineRight">{{ eduOrderInfo.checkinDate }} 至 {{ eduOrderInfo.checkoutDate }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">考试时间</view>
				<view class="lineRight">{{ eduOrderInfo.examStartDate }} 至 {{ eduOrderInfo.examEndDate }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">报名截止</view>
				<view class="lineRight">{{ eduOrderInfo.deadline }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">网站链接</view>
				<view class="lineRight">{{ eduOrderInfo.examLink }}</view>
			</view>
			<view class="line" style="height: auto;">
				<view class="lineLeft" style="line-height: 50px;">考试说明</view>
				<view class="lineRight" style="padding: 2px 0ds;">{{ eduOrderInfo.examDescription }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">负责人</view>
				<view class="lineRight">{{ eduOrderInfo.principal }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">联系方式</view>
				<view class="lineRight">{{ eduOrderInfo.contact }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">人数</view>
				<view class="lineRight">{{ eduOrderInfo.peopleNum }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">状态</view>
				<view class="lineRight">
					<view :class="eduOrderInfo.stateClass">{{ eduOrderInfo.state }}</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">备注</view>
				<view class="lineRight"><textarea class="input" :value="eduOrderInfo.remarks" disabled /></view>
			</view>
			<!-- 出发点信息 -->
			<uni-section class="titleClass" title="出发点信息" type="line"></uni-section>
			<block v-for="(item, index) in eduOrderInfo.startingList" :key="index">
				<view class="line">
					<view class="lineLeft">出发点{{ index + 1 }}</view>
					<view class="lineRight">{{ item.name }}</view>
				</view>
				<view class="line">
					<view class="lineLeft">出发时间</view>
					<view class="lineRight">{{ item.startingDate }} {{ item.startingTime }}</view>
				</view>
				<view class="line">
					<view class="lineLeft">出发位置</view>
					<view class="lineRight">
						{{ item.longitude }} , {{ item.latitude }}
						<view class="tips" @click="look">查看</view>
					</view>
				</view>
			</block>
			<!-- 考点信息 -->
			<uni-section class="titleClass" title="考点信息" type="line"></uni-section>
			<block v-for="(item, index) in eduOrderInfo.examSiteList" :key="index">
				<view class="line">
					<view class="lineLeft">考点{{ index + 1 }}</view>
					<view class="lineRight">{{ item.name }}</view>
				</view>
				<view class="line">
					<view class="lineLeft">考点位置</view>
					<view class="lineRight">
						{{ item.longitude }} , {{ item.latitude }}
						<view class="tips" @click="look">查看</view>
					</view>
				</view>
			</block>
			<uni-section class="titleClass" title="酒店信息" type="line"></uni-section>
			<view class="line" v-for="(item, index) in eduOrderInfo.hotelList" :key="index">
				<view class="lineLeft">酒店{{ index + 1 }}</view>
				<view class="lineRight">
					{{ item.name }}
					<view class="tips">{{ item.num }}人</view>
				</view>
			</view>
			<uni-section class="titleClass" title="财务信息" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">支付方式</view>
				<view class="lineRight" v-show="eduOrderInfo.payWay == 1">统一支付</view>
				<view class="lineRight" v-show="eduOrderInfo.payWay == 2">学生支付</view>
				<view class="lineRight" v-show="eduOrderInfo.payWay == 3">已支付</view>
			</view>
			<view class="line" v-if="eduOrderInfo.roomFee">
				<view class="lineLeft">房费</view>
				<view class="lineRight">￥{{ eduOrderInfo.roomFee }}</view>
			</view>
			<view class="line" v-if="eduOrderInfo.otherFee">
				<view class="lineLeft">其他费用</view>
				<view class="lineRight">￥{{ eduOrderInfo.otherFee }}</view>
			</view>
			<view class="line" v-if="eduOrderInfo.payWay != 2">
				<view class="lineLeft">总费用</view>
				<view class="lineRight">￥{{ eduOrderInfo.allFee }}</view>
			</view>
			<view class="line">
				<view class="lineLeft">订单号</view>
				<view class="lineRight">{{ eduOrderInfo.num }}</view>
			</view>
		</view>
		<view class="bottomMenu"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @click="cancel" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			options: [
				{
					icon: 'weixin',
					text: '链接'
				}
			],
			buttonGroup: [
				{
					text: '修改订单',
					backgroundColor: '#ffa200',
					color: '#fff'
				},
				{
					text: '查看分配',
					backgroundColor: '#007aff',
					color: '#fff'
				}
			]
		};
	},
	computed: {
		eduOrderInfo() {
			return this.$store.state.edu.eduOrderInfo;
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '') {
			that.examId = options.examId;
			that.$store.commit('req_getEduOrderInfo', that.examId);
		}
	},
	methods: {
		cancel(e) {
			let that = this
				uni.navigateTo({
					url: '/pages/mine/team/edu/createSuccess?examId='+that.examId+ '&payWay='+that.$store.state.edu.eduOrderInfo.payWay
				});
			// uni.showToast({
			// 	title: '功能开发中',
			// 	duration: 2000,
			// 	icon: 'none'
			// });
		},
		buttonClick(e) {
			//修改
			if (e.index == 0) {
				uni.showToast({
					title: '功能开发中',
					duration: 2000,
					icon: 'none'
				});
				// uni.navigateTo({
				// 	url: '/pages/mine/team/edu/orderDistribution'
				// });
				//分配
			} else if (e.index == 1) {
				uni.navigateTo({
					url: '/pages/mine/team/edu/orderDistribution?examId=' + this.examId
				});
			}
		},
		look(e) {
			uni.showToast({
				title: '功能开发中',
				duration: 2000,
				icon: 'none'
			});
		},
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
		background-color: #4cd964;
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
			height: 100%;
			width: 100%;
			overflow: auto;
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
</style>
