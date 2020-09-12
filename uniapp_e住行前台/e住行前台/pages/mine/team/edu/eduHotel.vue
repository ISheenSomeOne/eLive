<template>
	<view>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">酒店</view>
				<view class="lineRight">
					<picker class="pickerClass" mode="selector" :range="hotelList" :value="nowHotel" @change="hotelChange">
						<view>{{ hotelList[nowHotel] }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">房间数量</view>
				<view class="lineRight">
					<input class="input" @input="formChange" type="number" value="" data-name="otherFee" placeholder-class="plaClass" placeholder="请输入房间数量" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">链接</view>
				<view class="lineRight" @click="toAddRoom">gssdf2131234fdsv</view>
			</view>
		</view>
		<view class="roomBox clearfix">
			<view class="roomItem">
				11112201222122121
			</view>
			<view class="roomItem">
				201
			</view>
			<view class="roomItem">
				201
			</view>
			<view class="roomItem">
				201
			</view>
			<view class="roomItem">
				201
			</view>
		</view>
		<view class="buttonBox" v-show="true" @click="submit">确定</view>
		<view class="bottomMenu" v-show="!true"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			hotelList: ['选择酒店', '汇都酒店', '兴润酒店'],
			nowHotel: 0,
			options: [],
			buttonGroup: [
				{
					text: '删除酒店',
					backgroundColor: '#dd524d',
					color: '#fff'
				},
				{
					text: '确定，生成链接',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			]
		};
	},
	methods: {
		hotelChange: function(e) {
			this.date = e.target.value;
		},
		submit:function(){
			uni.navigateTo({
				url: 'hotelAddRoom'
			});
		}
	}
};
</script>

<style lang="scss">
	.roomBox{
		.roomItem{
			height: 40px;
			line-height: 40px;
			width: 150rpx;
			background-color: #007aff;
			color: #fff;
			float: left;
			margin: 8px 15rpx;
			font-size: 14px;
			border-radius: 2px;
			overflow: auto;
		}
		width: 720rpx;
		margin: 0 auto;
	}
.bottomMenu {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 5px;
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
	color: #6b8082;
	position: relative;
	margin: 0 auto 20px auto;
}
</style>
