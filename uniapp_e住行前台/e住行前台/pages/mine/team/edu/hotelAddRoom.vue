<template>
	<view>
		<view class="topTip">
			<text>{{ eduHotelRoom.hotelName }}</text>
			—还需选择
			<text>{{ eduHotelRoom.needRoom }}</text>
			间房
		</view>
		<picker class="pickerClass" mode="selector" :range="roomTypeNameList" :value="nowRoomType" @change="roomTypeChange">
			<view>{{ roomTypeNameList[nowRoomType] }}</view>
		</picker>
		<view class="roomBox clearfix">
			<block v-for="(room, index) in roomList" :key="index">
				<uni-fav
					:star="false"
					:content-text="{ contentDefault: room.roomName, contentFav: room.roomName }"
					bg-color-checked="#007aff"
					class="roomItem"
					:checked="room.check"
					@click="chooseRoom(index)"
				/>
			</block>
		</view>
		<view class="buttonBox" v-show="true" @click="submit">确 定</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			roomTypeList: [],
			roomTypeNameList: [],
			nowRoomType: 0,
			roomTypeId: '',
			roomList: []
		};
	},
	computed: {
		eduHotelRoom() {
			return this.$store.state.edu.eduHotelRoom;
		},
		needRefresh() {
			return this.$store.state.edu.needRefresh;
		}
	},
	watch: {
		eduHotelRoom(newData, oldData) {
			let that = this;
			that.initEduHotelRoom();
		},
		needRefresh(newData, oldData) {
			let that = this;
			if (newData) {
				let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomTypeId: this.roomTypeId };
				this.$store.commit('req_getEduHotelRoom', val);
				this.$store.commit('setNeedRefresh');
			}
		}
	},
	onLoad(options) {
		//是否有考试id
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			this.examId = options.examId;
			//是否有酒店id
			if (options.eduHotelId != '' && options.eduHotelId != 'undefined' && options.eduHotelId != null) {
				this.eduHotelId = options.eduHotelId;

				let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomTypeId: '' };
				this.$store.commit('req_getEduHotelRoom', val);
			}
		}
	},
	mounted() {
		document.querySelector('.uni-page-head-hd').style.display = 'none';
	},
	methods: {
		roomTypeChange: function(e) {
			this.nowRoomType = e.target.value;
			if (e.target.value == 0) {
				this.roomTypeId = '';
			} else {
				this.roomTypeId = this.roomTypeList[e.target.value - 1].roomTypeId;
			}
			let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomTypeId: this.roomTypeId };
			this.$store.commit('req_getEduHotelRoom', val);
		},
		initEduHotelRoom: function() {
			let that = this;
			let data = that.$store.state.edu.eduHotelRoom;
			//渲染roomTypeList
			that.roomTypeList = data.roomTypeList;
			//初始化房间类型列表
			if (that.roomTypeList) {
				that.roomTypeNameList = [];
				that.roomTypeNameList.push('选择房型');
				that.roomTypeList.forEach(item => {
					that.roomTypeNameList.push(item.roomTypeName);
				});
			}
			//初始化房间列表
			that.roomList = [];
			data.roomList.forEach(item => {
				item.check = false;
				that.roomList.push(item);
			});
			// console.log(that.roomList);
			//显示已选择的房间列表
			for (let i = 0; i < data.nowRoomList.length; i++) {
				for (let j = 0; j < that.roomList.length; j++) {
					if (that.roomList[j].roomId == data.nowRoomList[i]) {
						that.roomList[j].check = true;
					}
				}
			}
		},
		chooseRoom(index) {
			this.roomList[index].check = !this.roomList[index].check;
			this.$forceUpdate();
		},
		submit() {
			let list = [];
			for (let i = 0; i < this.roomList.length; i++) {
				if (this.roomList[i].check) {
					list.push(this.roomList[i].roomId);
				}
			}
			let val = { examId: this.examId, eduHotelId: this.eduHotelId, roomList: list };
			this.$store.commit('req_addEduHotelRoom', val);
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
