<template>
	<view>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">酒店</view>
				<view v-if="hasHotel" class="lineRight">{{ eduHotelInfo.nowHotelName }}</view>
				<view v-else class="lineRight">
					<picker class="pickerClass" mode="selector" :range="hotelNameList" :value="nowHotel" @change="hotelChange">
						<view>{{ hotelNameList[nowHotel] }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">房间数量</view>
				<view v-if="hasHotel" class="lineRight">{{ eduHotelInfo.nowRoomCount }}</view>
				<view v-else class="lineRight"><input class="input" type="number" v-model="roomCount" placeholder-class="plaClass" placeholder="请输入房间数量" /></view>
			</view>
			<view class="line">
				<view class="lineLeft">链接</view>
				<view v-show="hasHotel" class="lineRight" style="overflow: auto;text-align: left;">
					{{ 'http://localhost:8080/pages/mine/team/edu/hotelAddRoom?examId=' + examId + '&eduHotelId=' + eduHotelId }}
				</view>
			</view>
		</view>
		<!-- <view class="roomBox clearfix">
			<view class="roomItem">1121</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
			<view class="roomItem">201</view>
		</view> -->
		<view class="buttonBox" v-show="!hasHotel" @click="submit">确定</view>
		<view class="bottomMenu" v-show="hasHotel"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			eduHotelId: '',
			hotelId: '', //选择的酒店id
			roomCount: '',
			hasHotel: false,
			hotelList: [],
			hotelNameList: [],
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
	computed: {
		eduHotelInfo() {
			return this.$store.state.edu.eduHotelInfo;
		},
		resSuccess() {
			return this.$store.state.edu.resSuccess;
		},
		navigateBack() {
			return this.$store.state.edu.navigateBack;
		}
	},
	watch: {
		resSuccess(newData, oldData) {
			let that = this;
			if (newData) {
				that.hasHotel = true;
				that.eduHotelId = that.hotelId;
				console.log(that.hasHotel);
				that.$store.commit('changeResSuccess');
			}
		},
		navigateBack(newData, oldData) {
			let that = this;
			if (newData) {
				uni.navigateBack({
					delta: 1
				});
			that.$store.commit('setNeedNavigateBack');
			}
		}
	},
	onLoad(options) {
		//是否有考试id
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			this.examId = options.examId;
		}
		//是否有酒店id
		if (options.eduHotelId != '' && options.eduHotelId != 'undefined' && options.eduHotelId != null) {
			this.eduHotelId = options.eduHotelId;
			this.hasHotel = true;
		} else {
			this.hasHotel = false;
		}
		let val = { examId: this.examId, eduHotelId: this.eduHotelId };
		this.$store.commit('req_getEduHotel', val); //获取酒店信息

		setTimeout(() => {
			//初始化hotelList
			this.hotelList = this.$store.state.edu.eduHotelInfo.hotelList;
			if (this.hotelList) {
				this.hotelNameList.push('选择酒店');
				this.hotelList.forEach(item => {
					this.hotelNameList.push(item.hotelName);
				});
			}
		}, 50);
	},
	methods: {
		//下方按钮事件
		buttonClick: function(e) {
			let that = this;
			if (e.index == 0) {
				uni.showModal({
					title: '提示',
					content: '确定删除吗？',
					confirmColor: '#dd524d',
					success: function(res) {
						if (res.confirm) {
							let val = { examId: that.examId, hotelId: that.eduHotelId };
							that.$store.commit('req_delEduHotel', val);
						} else if (res.cancel) {
						}
					}
				});
			}

			if (e.index == 1) {
				uni.showToast({
					icon: 'none',
					title: '请手动复制链接'
				});
			}
		},
		hotelChange: function(e) {
			let that = this;
			that.nowHotel = e.target.value;

			if (that.nowHotel > 0) {
				that.hotelId = that.hotelList[that.nowHotel - 1].hotelId;
			}
		},
		submit: function() {
			let that = this;
			if (that.nowHotel == 0) {
				uni.showToast({
					icon: 'none',
					title: '请选择酒店'
				});
			} else if (that.roomCount == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入房间数量'
				});
			} else {
				let val = { examId: that.examId, hotelId: that.hotelId, roomCount: that.roomCount };
				that.$store.commit('req_makeAddHotelLink', val);
			}
		}
	}
};
</script>

<style lang="scss">
.roomBox {
	.roomItem {
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
