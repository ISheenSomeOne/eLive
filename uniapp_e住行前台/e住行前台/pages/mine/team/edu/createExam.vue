<template>
	<view>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">名称</view>
				<view class="lineRight"><input class="input" @input="formChange" value="" data-name="examName" placeholder-class="plaClass" placeholder="请输入考试名称" /></view>
			</view>
			<view class="line">
				<view class="lineLeft">考试日期</view>
				<view class="lineRight">
					<picker mode="date" :value="startDate" @change="bindStartDateChange">
						<view class="uni-input">{{ startDate }}</view>
					</picker>
					<picker mode="date" :value="endDate" @change="bindEndDateChange">
						<view class="uni-input">{{ endDate }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">报名截止</view>
				<view class="lineRight">
					<picker mode="date" :value="deadline" @change="bindTimeChange">
						<view class="uni-input">{{ deadline }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">网站链接</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="examLink" placeholder-class="plaClass" placeholder="请输入考试网站链接" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">考试说明</view>
				<view class="lineRight">
					<textarea class="input" placeholder-class="plaClass" placeholder="请输入考试网站说明" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">入离时间</view>
				<view class="lineRight">
					<picker mode="date" :value="checkinDate" @change="bindCheckinDateChange">
						<view class="uni-input">{{ checkinDate }}</view>
					</picker>
					<picker mode="date" :value="checkoutDate" @change="bindCheckoutDateChange">
						<view class="uni-input">{{ checkoutDate }}</view>
					</picker>
				</view>
			</view>
			<uni-section class="titleClass" title="考点" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">考点数量</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" type="number" data-name="siteNum" placeholder-class="plaClass" placeholder="请输入考点数量" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">考点1</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="examSiteName" placeholder-class="plaClass" placeholder="请输入考点名称" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">经纬度</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="examSiteLongitude" placeholder-class="plaClass" placeholder="请输入考点经度" />
					<input class="input" @input="formChange" value="" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入考点纬度" />
					<view class="tips">选填</view>
				</view>
			</view>
			<uni-section class="titleClass" title="起点" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">起点数量</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" type="number" data-name="siteNum" placeholder-class="plaClass" placeholder="请输入起点数量" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">起点1</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="startingName" placeholder-class="plaClass" placeholder="请输入考点名称" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">出发时间</view>
				<view class="lineRight">
					<picker mode="date" :value="startingDate" @change="bindStartingDateChange">
						<view class="uni-input">{{ startingDate }}</view>
					</picker>
					<picker mode="time" :value="startingTime" @change="bindStartingTimeChange">
						<view class="uni-input">{{ startingTime }}</view>
					</picker>
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">经纬度</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="examSiteLongitude" placeholder-class="plaClass" placeholder="请输入考点经度" />
					<input class="input" @input="formChange" value="" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入考点纬度" />
					<view class="tips">选填</view>
				</view>
			</view>
			<uni-section class="titleClass" title="支付信息" type="line"></uni-section>
			<view class='line'>
			  <view class='lineLeft'>支付方式</view>
				<view class="lineRight">  
					<picker class="pickerClass" mode="selector" :range="payway" :value="nowPayway" @change="roomTypeChange">
						<view>{{payway[nowPayway]}}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">负责人</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="principal" placeholder-class="plaClass" placeholder="请输入负责人" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">联系方式</view>
				<view class="lineRight">
					<input class="input" @input="formChange" value="" data-name="contact" placeholder-class="plaClass" placeholder="请输入负责人联系方式" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">支付金额</view>
				<view class="lineRight">
					<input class="input" @input="formChange" type="digit" value="" data-name="allFee" placeholder-class="plaClass" placeholder="请输入支付金额" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">房费</view>
				<view class="lineRight">
					<input class="input" @input="formChange" type="digit" value="" data-name="roomFee" placeholder-class="plaClass" placeholder="请输入金额" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">其他费用</view>
				<view class="lineRight">
					<input class="input" @input="formChange" type="digit" value="" data-name="otherFee" placeholder-class="plaClass" placeholder="请输入金额" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">人数</view>
				<view class="lineRight">
					<input class="input" @input="formChange" type="number" value="" data-name="peopleNum" placeholder-class="plaClass" placeholder="请输入参加人数" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">备注</view>
				<view class="lineRight">
					<textarea class="input" placeholder-class="plaClass" placeholder="请输入备注" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="buttonBox" @click="submit">创建订单</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			startDate: '选择开始日期',
			endDate: '选择结束日期',
			startingDate: '选择出发日期',
			startingTime: '选择出发时间',
			checkinDate: '选择入住日期',
			checkoutDate: '选择离店日期',
			deadline: '选择报名截止日期（当日24点）',
			nowPayway: 0,
			payway: ['选择支付方式','统一支付','学生支付','已支付']
		};
	},
	methods: {
		bindDateChange: function(e) {
			this.date = e.target.value;
		},
		bindCheckinDateChange: function(e) {
			this.checkinDate = e.target.value;
		},
		bindCheckoutDateChange: function(e) {
			this.checkoutDate = e.target.value;
		},
		bindStartDateChange: function(e) {
			this.startDate = e.target.value;
		},
		bindEndDateChange: function(e) {
			this.endDate = e.target.value;
		},
		bindStartingDateChange: function(e) {
			this.startingDate = e.target.value;
		},
		bindStartingTimeChange: function(e) {
			this.startingTime = e.target.value;
		},
		submit: function(){
			uni.navigateTo({
				url: 'createSuccess'
			})
		}
	}
};
</script>

<style lang="scss">
//创建订单表单
.plaClass {
	color: #cfcfcf;
	line-height: 50px;
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
.pickerClass {
	width: 100%;
	text-align: left;
}
.more-btn {
	width: 500rpx;
}
.titleClass{
	height: 40px;
}
</style>
