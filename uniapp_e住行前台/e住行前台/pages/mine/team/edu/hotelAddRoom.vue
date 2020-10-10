<template>
	<view>
		<view class="topTip">
			<text>{{ EduHotelRoom.hotelName }}</text>
			—还需选择
			<text>{{ EduHotelRoom.needRoom }}</text>
			间房
		</view>
		<picker class="pickerClass" mode="selector" :range="roomTypeNameList" :value="nowRoomType" @change="roomTypeChange">
			<view>{{ roomTypeNameList[nowRoomType] }}</view>
		</picker>
		<view class="roomBox clearfix">
			<block v-for="(room, index) in roomList" :key="index">
				<uni-fav :content-text="room.roomName" class="roomItem" :checked="room.check" @click="chooseRoom(index)" />
			</block>
			
		</view>
		<view class="buttonBox" v-show="true" @click="submit">创建订单</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			roomTypeList: [],
			roomTypeNameList: [],
			nowRoomType: 0,
			roomList: []
		};
	},
	computed: {
		EduHotelRoom() {
			return this.$store.state.edu.EduHotelRoom;
		}
	},
	onLoad(options) {
		//是否有考试id
		if (options.examId != '' && options.examId != undefined && options.examId != null) {
			this.examId = options.examId;
			//是否有酒店id
			if (options.eduHotelId != '' && options.eduHotelId != undefined && options.eduHotelId != null) {
				this.eduHotelId = options.eduHotelId;

				let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomTypeId: '' };
				this.$store.commit('req_getEduHotelRoom', val);

				this.initEduHotelRoom();
			}
		}
	},
	methods: {
		roomTypeChange: function(e) {
			this.nowRoomType = e.target.value;

			let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomTypeId: this.nowRoomType };
			this.$store.commit('req_getEduHotelRoom', val);

			this.initEduHotelRoom();
		},
		initEduHotelRoom: function() {
			let data = this.$store.state.edu.EduHotelRoom;
			//渲染roomTypeList
			this.roomTypeList = data.roomTypeList;
			//初始化房间类型列表
			if (this.roomTypeList) {
				this.roomTypeNameList = [];
				this.roomTypeNameList.push('选择房型');
				this.roomTypeList.forEach(item => {
					this.roomTypeNameList.push(item.roomTypeName);
				});
			}
			//初始化房间列表
			this.roomList = [];
			data.roomList.forEach(item => {
				item.check = false;
				this.roomList.push(item);
			});
			//显示已选择的房间列表
			for (let i = 0; i < data.nowRoomList.length; i++) {
				for (let j = 0; j < this.roomList.length; j++) {
					if (this.roomList[j].roomId == data.nowRoomList[i]) {
						this.roomList[j].check = true;
					}
				}
			}
		},
		chooseRoom(index) {
			this.roomList[index].check = !this.roomList[index].check;
		}
	}
};
</script>

<style lang="scss" scoped>
.pickerClass {
	height: 40px;
	line-height: 40px;
	font-size: 14px;
	width: 710rpx;
	margin: 10px auto 0 auto;
	background-color: #eee;
	border-radius: 2px;
}
.topTip {
	height: 40px;
	line-height: 40px;
	width: 710rpx;
	font-size: 14px;
	background-color: #4cd964;
	border-radius: 2px;
	color: #fff;
	margin: 20rpx auto 0 auto;
}
.topTip text {
	font-size: 16px;
	font-weight: bold;
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
</style>
