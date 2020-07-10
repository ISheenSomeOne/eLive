<template>
	<view>
		<view class="topNavBar">
			<view class="navBarLeft">
				<picker mode="selector" value="index" :range="typePikerNameData" @change="typeChange">
					<view class="navBarLeft">
						{{ typePikerNameData[typePikerIndex] }}
						<uni-icons type="arrowdown" color="#FFF"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="navBarLeft">
				<picker mode="selector" value="index" :range="floorpikerData" @change="floorChange">
					<view class="navBarLeft">
						{{ floorpikerData[floorIndex] }}
						<uni-icons type="arrowdown" color="#FFF"></uni-icons>
					</view>
				</picker>
			</view>
			<view class="navBarRight">
				<text>显示空房</text>
				<switch style="transform:scale(0.6)" :checked="showEmpty" color="#4CD964" @change="emptyChange" />
			</view>
		</view>
		<uni-drawer ref="showLeft" mode="left" :width="280" @change="changeRoomMenu($event)">
			<view style="padding:30rpx;">
				<uni-grid :square="false" :column="2" :show-border="false" :highlight="false">
					<uni-grid-item class="roomCtrl"><button plain="true" class="kongxianPlain" hover-class="kongxianPlainHover" @click="openRoom">开锁</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button class="kongxian" hover-class="kongxianHover" @click="createOrder">开房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl">
						<navigator url="../order/roomOrder"><button plain="true" type="warn">退押</button></navigator>
					</uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="warn" @click="checkout">退房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button plain="true" class="weixiuPlain" hover-class="weixiuPlainHover" @click="openContinue">续房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button class="weixiu" hover-class="weixiuHover" @click="openChange">换房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button plain="true" type="default" @click="openStatus">房态</button></uni-grid-item>
					<uni-grid-item class="roomCtrl">
						<navigator url="../order/roomOrder"><button class="baoliu" hover-class="baoliuHover" type="default">订单</button></navigator>
					</uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="primary">消费</button></uni-grid-item>
				</uni-grid>
				<view class="closeDrawer"><button type="warn" @click="closeRoomMenu('showLeft')">返回</button></view>
			</view>
		</uni-drawer>
		<uni-fab direction="vertical" :pattern="fabStyle" horizontal="right" :content="fabCont" vertical="bottom"></uni-fab>
		<view class="container">
			<uni-grid :column="gridColumn" :show-border="false" :highlight="false">
				<uni-grid-item v-for="(room, index) in roomList" :key="index">
					<view :class="'room ' + room.state" @click="showRoomMenu(room)">
						<uni-tag v-if="room.refundApplicationCount" class="tagYajin" size="small" text="押金" type="error"></uni-tag>
						<text>{{ room.door }}</text>
					</view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<!-- 续房浮框 -->
		<uni-popup ref="popupContinue" type="center">
			<view class="popup-content">
				<view class="cantinueItem">
					<text class="fl">续住天数</text>
					<slider
						class="cantinueSlider fl"
						min="0"
						max="15"
						backgroundColor="#DDDDDD"
						block-color="#007AFF"
						:value="addedDays"
						show-value="true"
						@change="continueDays"
					/>
				</view>
				<view class="cantinueItem">
					<text class="fl">补交房费</text>
					<input class="fl cantinueInput" type="digit" placeholder="默认为0" placeholder-style="text-align:left;font-size:14px" :value="continuePrice" />
					<text class="fl">元</text>
				</view>
				<button class="cantinueBtn" @click="confirmContinue" type="primary">续房</button>
			</view>
		</uni-popup>
		<!-- 换房浮框 -->
		<uni-popup ref="popupChange" type="center">
			<view class="popup-content">
				<!-- <view class="changeItem">
					<text class="fl">房型</text>
					<picker class="fl ml" mode="selector" :range="changeTypeList" @change="changeTypeChange">
						<view>{{ changeTypeList[changeTypeIndex] }}</view>
					</picker>
				</view> -->
				<view class="changeItem">
					<text class="fl">房间</text>
					<picker class="fl ml" mode="selector" :range="changeRoomName" @change="changeRoomChange">
						<view>{{ changeRoomName[changeRoomIndex] }}</view>
					</picker>
				</view>
				<!-- <view class="changeItem">
					<text class="fl">房费</text>
					<input class="changeInput fl ml" type="digit" placeholder="默认为0" placeholder-style="text-align:left;font-size:14px" value="" />
					<text class="fl">元</text>
				</view> -->
				<button class="cantinueBtn" @click="confirmChange" type="primary">换房</button>
			</view>
		</uni-popup>
		<!-- 房态浮框 -->
		<uni-popup ref="popupStatus" type="bottom">
			<view class="popup-bottom">
				<button class="StatusBtn kongxian" @click="changeRoomState(4)" hover-class="kongxianHover">空闲</button>
				<button class="StatusBtn baoliu" @click="changeRoomState(5)" hover-class="baoliuHover">保留</button>
				<button class="StatusBtn weixiu" @click="changeRoomState(3)" hover-class="weixiuHover">维修</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			changeTypeList: [],
			changeTypeIndex: 0,
			gridColumn: 3,
			isShowRoomMenu: false,
			fabStyle: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			}
		};
	},
	created: function() {
		this.$store.dispatch('initRoomStatus');
		this.$store.dispatch('initRoomType');
		this.$store.commit('initHomeFloor');
		// console.log(this.$store.state.home.roomList)
	},
	onShow() {
		this.$store.dispatch('initRoomStatus')
	},
	computed: {
		roomList() {
			return this.$store.state.home.roomList;
		},
		fabCont() {
			return this.$store.state.home.fabCont;
		},
		typePikerNameData() {
			return this.$store.state.home.typePikerNameData;
		},
		typePikerIndex() {
			return this.$store.state.home.typePikerIndex;
		},
		floorpikerData() {
			return this.$store.state.home.floorpikerData;
		},
		floorIndex() {
			return this.$store.state.home.floorIndex;
		},
		showEmpty() {
			return this.$store.state.home.showEmpty;
		},
		addedDays() {
			return this.$store.state.order.addedDays;
		},
		continuePrice: {
			get() {
				return this.$store.state.order.continuePrice;
			},
			set(val) {
				this.$store.commit('setContinuePrice', val);
			}
		},
		changeRoomName() {
			return this.$store.state.home.changeRoomName;
		},
		changeRoomIndex() {
			return this.$store.state.home.changeRoomIndex;
		},
		changeFlag() {
			return this.$store.state.home.changeFlag;
		}
	},
	watch: {
		changeFlag(newData, oldData) {
			let that = this;
			if (newData) {
				that.$refs.popupChange.close();
				that.$refs['showLeft'].open();
			}
			this.$store.commit('setChangeFlag');
		}
	},
	methods: {
		createOrder: function() {
			uni.showToast({
				title: '功能正在开发中',
				duration: 2000,
				icon: 'none'
			});
		},
		typeChange: function(e) {
			this.$store.commit('homeRoomTypeChange', e.detail.value);
		},
		floorChange: function(e) {
			this.$store.commit('homeFloorChange', e.detail.value);
		},
		emptyChange: function(e) {
			this.$store.commit('emptyChange', e.detail.value);
		},
		showRoomMenu: function(e) {
			this.$store.commit('chooseRoomId', e);
			this.$refs['showLeft'].open();
		},
		changeRoomState: function(e) {
			this.$store.dispatch('changeRoomState', e);
			this.closeRoomMenu('popupStatus');
		},
		closeRoomMenu: function(e) {
			this.$refs[e].close();
		},
		changeRoomMenu: function(e) {
			this.isShowRoomMenu = e;
		},
		openContinue: function() {
			let state = this.$store.state.home.nowRoom.state;
			let sanke = this.$store.state.home.nowRoom.haveYouBeenAssignedARoom
			//只有在住可以续房
			if (state == 'zaizhu' || (state == 'kongxian' && sanke == false)) {
				this.closeRoomMenu('showLeft');
				this.$refs.popupContinue.open();
				this.$store.commit('req_continueDays');
			} else {
				uni.showToast({
					title: '当前房间不可续房',
					duration: 2000,
					icon: 'none'
				});
			}
		},
		continueDays: function(e) {
			if (this.$store.state.order.addedDays == e.detail.value) {
			} else {
				this.$store.commit('continueDays', e.detail.value);
			}
		},
		openChange: function() {
			let state = this.$store.state.home.nowRoom.state;
			let sanke = this.$store.state.home.nowRoom.haveYouBeenAssignedARoom
			//只有在住可以换房
			if (state == 'zaizhu' || (state == 'kongxian' && sanke == false)) {
				this.closeRoomMenu('showLeft');
				this.$store.dispatch('initChangeRoom');
				this.$refs.popupChange.open();
			} else {
				uni.showToast({
					title: '当前房间不可换房',
					duration: 2000,
					icon: 'none'
				});
			}
		},
		changeTypeChange: function(e) {
			this.changeTypeIndex = e.detail.value;
		},
		changeRoomChange: function(e) {
			this.$store.commit('setChangeRoomIndex', e.detail.value);
			// this.changeRoomIndex = e.detail.value;
		},
		openStatus: function() {
			let state = this.$store.state.home.nowRoom.state;
			this.closeRoomMenu('showLeft');
			//只有空闲，打扫，维修，保留可以更改房态
			if (state == 'kongxian' || state == 'dasao' || state == 'weixiu' || state == 'baoliu') {
				this.$refs.popupStatus.open();
			} else {
				uni.showToast({
					title: '当前状态不可更改！',
					duration: 2000,
					icon: 'none'
				});
			}
		},
		openRoom: function() {
			let that = this
			uni.showModal({
				title: '提示',
				content: '确定开门吗？',
				success: function(res) {
					if (res.confirm) {
						that.$store.dispatch('openRoom');
					} else if (res.cancel) {
					}
				}
			});
		},
		//点击续房
		confirmContinue: function() {
			this.$store.dispatch('confirmContinue');
			this.$refs.popupContinue.close();
			this.$refs['showLeft'].open();
		},
		//点击换房
		confirmChange: function() {
			this.$store.dispatch('confirmChange');
		},
		//点击退房
		checkout: function() {
			this.$store.dispatch('checkout');
		}
	},
	onNavigationBarButtonTap(e) {
		if (this.isShowRoomMenu) {
			this.$refs.isShowRoomMenu.close();
		} else {
			this.$refs.isShowRoomMenu.open();
		}
	},
	mounted() {
		if (window.innerWidth < 500) {
			this.gridColumn = 3;
		} else if (window.innerWidth < 600) {
			this.gridColumn = 4;
		} else if (window.innerWidth < 800) {
			this.gridColumn = 5;
		} else if (window.innerWidth < 1000) {
			this.gridColumn = 6;
		} else if (window.innerWidth < 1300) {
			this.gridColumn = 7;
		} else if (window.innerWidth < 1500) {
			this.gridColumn = 8;
		} else if (window.innerWidth < 1700) {
			this.gridColumn = 9;
		} else {
			this.gridColumn = 10;
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	padding: 20px;
	font-size: 14px;
	line-height: 24px;
}

.room {
	position: relative;
	text-align: center;
	// min-height: 60rpx;
	height: 90%;
	width: 90%;
	background-color: #007aff;
	margin: 5%;
	color: #ffffff;
	display: flex;
	flex-direction: column;
	justify-content: center;
	font-weight: bold;
	border-radius: 3px;
	cursor: pointer;
}

.room:hover {
	box-shadow: 0 0 5px 2px rgba(0, 0, 0, 0.2);
	transition: all 0.2s;
}

.room text {
	overflow: hidden;
	text-overflow: ellipsis;
	white-space: nowrap;
}

.topNavBar {
	position: relative;
	top: 0;
	height: 44px;
	line-height: 44px;
	width: 100%;
	background-color: $uni-color-primary;
	color: #fff;
}

.navBarLeft {
	float: left;
	margin-left: 10px;
	font-size: 14px;
	max-width: 110px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.navBarRight {
	float: right;
	margin-right: 5px;
	font-size: 14px;
}

.tagYajin {
	position: absolute;
	top: 0;
	right: 0;
	font-weight: normal;
}

.roomCtrl {
	margin: 10px 0;
}

.roomCtrl button {
	width: 85%;
}

.closeDrawer {
	margin-top: 20px;
}

.kongxian {
	transition: all 0.1s;
	background-color: $uni-color-success;
	color: #fff;
}

.yuliu {
	background-color: $uni-color-yuliu;
	color: #fff;
}

.zaizhu {
	background-color: $uni-color-primary;
	color: #fff;
}

.chaoshi {
	background-color: $uni-color-error;
	color: #fff;
}

.dasao {
	background-color: $uni-color-dasao;
	color: #fff;
}

.weixiu {
	transition: all 0.1s;
	background-color: $uni-color-warning;
	color: #fff;
}

.baoliu {
	transition: all 0.1s;
	background-color: $uni-color-baoliu;
	color: #fff;
}
.popup-content {
	width: 620rpx;
	background-color: #fff;
	padding: 20px 15px 35px 15px;
	border-radius: 10px;
}
.cantinueItem {
	position: relative;
	font-size: 14px;
	height: 80px;
	line-height: 80px;
}
.fl {
	float: left;
	margin-left: 5px;
}
.ml {
	margin-left: 20px;
}
.cantinueSlider {
	margin: 0 0 0 20px;
	width: 400rpx;
}

.cantinueInput {
	margin: 0 0 0 20px;
	width: 70px;
	height: 80px;
	line-height: 80px;
}
.cantinueBtn {
	margin-top: 15px;
	width: 500rpx;
}
.changeItem {
	font-size: 14px;
	height: 80px;
	line-height: 80px;
	width: 500rpx;
	margin: 0 auto;
}
.changeInput {
	height: 80px;
	line-height: 80px;
	width: 70px;
	text-align: left;
}
.popup-bottom {
	max-width: 700rpx;
	background-color: #fff;
	padding: 15px 15px 70px 15px;
	border-radius: 10px;
}
.StatusBtn {
	margin-top: 10px;
	width: 600rpx;
}
.kongxianHover {
	background-color: #3eb352;
}
.baoliuHover {
	background-color: #5a646f;
}
.weixiuHover {
	background-color: #cb9242;
}
.kongxianPlain {
	transition: all 0.1s;
	background-color: #ffffff;
	color: $uni-color-success;
	border: $uni-color-success 1px solid;
}
.weixiuPlain {
	transition: all 0.1s;
	background-color: #ffffff;
	color: $uni-color-warning;
	border: $uni-color-warning 1px solid;
}
.kongxianPlain {
	transition: all 0.1s;
	background-color: #ffffff;
	color: $uni-color-success;
	border: $uni-color-success 1px solid;
}
.kongxianPlainHover {
	color: #ffffff;
	background-color: $uni-color-success;
}
.weixiuPlainHover {
	color: #ffffff;
	background-color: $uni-color-warning;
}
</style>
