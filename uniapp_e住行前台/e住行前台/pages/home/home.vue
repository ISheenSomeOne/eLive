<template>
	<view>
		<view class="topNavBar">
			<view class="navBarLeft">
				<picker mode="selector" value="index" :range="typepikerData" @change="typeChange">
					<view class="navBarLeft">
						{{ typepikerData[typeIndex] }}
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
					<uni-grid-item class="roomCtrl"><button plain="true" type="primary">开锁</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button disabled="true" type="primary">开房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><navigator url="../order/roomOrder"><button plain="true" type="warn">退押</button></navigator></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="warn">退房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="default" @click="openContinue">续房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="default" @click="openChange">换房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button plain="true" type="default" @click="openStatus">房态</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><navigator url="../order/roomOrder"><button plain="true" type="default">订单</button></navigator></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="primary">消费</button></uni-grid-item>
				</uni-grid>
				<view class="closeDrawer"><button type="warn" @click="closeRoomMenu('showLeft')">返回</button></view>
			</view>
		</uni-drawer>
		<uni-fab direction="vertical" :pattern="fabStyle" horizontal="right" :content="fabCont" vertical="bottom"></uni-fab>
		<view class="container">
			<uni-grid :column="gridColumn" :show-border="false" :highlight="false">
				<uni-grid-item>
					<view class="room kongxian" @click="showRoomMenu('showLeft')">
						<uni-tag class="tagYajin" size="small" text="押金" type="error"></uni-tag>
						<text>301</text>
					</view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room yuliu"><text title="301232132132131">123123</text></view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room zaizhu"><text>301</text></view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room chaoshi"><text>301</text></view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room dasao"><text title="301232132132131">3011</text></view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room weixiu"><text>301</text></view>
				</uni-grid-item>
				<uni-grid-item>
					<view class="room baoliu"><text>301</text></view>
				</uni-grid-item>
			</uni-grid>
		</view>
		<!-- 续房浮框 -->
		<uni-popup ref="popupContinue" type="center">
			<view class="popup-content">
				<view class="cantinueItem">
					<text class="fl">续住天数</text>
					<slider class="cantinueSlider fl" min="0" max="15" backgroundColor="#DDDDDD" block-color="#007AFF" value="1" show-value="true" @change="continueDays" />
				</view>
				<view class="cantinueItem">
					<text class="fl">补交房费</text>
					<input class="fl cantinueInput" type="digit" placeholder="默认为0" placeholder-style="text-align:left;font-size:14px" value="" />
					<text class="fl">元</text>
				</view>
				<button class="cantinueBtn" type="primary">确定</button>
			</view>
		</uni-popup>
		<!-- 换房浮框 -->
		<uni-popup ref="popupChange" type="center">
			<view class="popup-content">
				<view class="changeItem">
					<text class="fl">房型</text>
					<picker class="fl ml" mode="selector" :range="changeTypeList" @change="changeTypeChange">
						<view>{{changeTypeList[changeTypeIndex]}}</view>
					</picker>
				</view>
				<view class="changeItem">
					<text class="fl">房间</text>
					<picker class="fl ml" mode="selector" :range="changeRoomList" @change="changeRoomChange">
						<view>{{changeRoomList[changeRoomIndex]}}</view>
					</picker>
				</view>
				<view class="changeItem">
					<text class="fl">房费</text>
					<input class="changeInput fl ml" type="digit" placeholder="默认为0" placeholder-style="text-align:left;font-size:14px" value="" />
					<text class="fl">元</text>
				</view>
				<button class="cantinueBtn" type="primary">确定</button>
			</view>
		</uni-popup>
		<!-- 房态浮框 -->
		<uni-popup ref="popupStatus" type="bottom">
			<view class="popup-bottom">
				<button class="StatusBtn kongxian" hover-class="kongxianHover">空闲</button>
				<button class="StatusBtn baoliu" hover-class="baoliuHover">保留</button>
				<button class="StatusBtn weixiu" hover-class="weixiuHover">维修</button>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export default {
	data() {
		return {
			changeTypeList: ['选择房型', '智享打大床房', '豪华双床房', '豪华大床房'],
			changeTypeIndex:0,
			changeRoomList: ['选择房间', '301', '302', '303'],
			changeRoomIndex:0,
			gridColumn: 3,
			typepikerData: ['选择房型', '智享打大床房', '豪华双床房', '豪华大床房'],
			typeIndex: 0,
			floorpikerData: ['选择楼层', '1楼', '2楼', '3楼'],
			floorIndex: 0,
			showEmpty: false,
			isShowRoomMenu: false,
			fabStyle: {
				color: '#7A7E83',
				backgroundColor: '#fff',
				selectedColor: '#007AFF',
				buttonColor: '#007AFF'
			},
			fabCont: [
				{
					iconPath: '/static/icon/kongxian.svg',
					selectedIconPath: '/static/icon/kongxian.svg',
					text: '空闲30',
					active: false
				},
				{
					iconPath: '/static/icon/yuliu.svg',
					selectedIconPath: '/static/icon/yuliu.svg',
					text: '预留',
					active: false
				},
				{
					iconPath: '/static/icon/zaizhu.svg',
					selectedIconPath: '/static/icon/zaizhu.svg',
					text: '在住',
					active: false
				},
				{
					iconPath: '/static/icon/chaoshi.svg',
					selectedIconPath: '/static/icon/chaoshi.svg',
					text: '超时',
					active: false
				},
				{
					iconPath: '/static/icon/dasao.svg',
					selectedIconPath: '/static/icon/dasao.svg',
					text: '打扫',
					active: false
				},
				{
					iconPath: '/static/icon/weixiu.svg',
					selectedIconPath: '/static/icon/weixiu.svg',
					text: '维修',
					active: false
				},
				{
					iconPath: '/static/icon/baoliu.svg',
					selectedIconPath: '/static/icon/baoliu.svg',
					text: '保留',
					active: false
				}
			]
		};
	},
	methods: {
		typeChange: function(e) {
			this.typeIndex = e.detail.value;
		},
		floorChange: function(e) {
			this.floorIndex = e.detail.value;
		},
		emptyChange: function(e) {
			this.showEmpty = e.target.value;
		},
		showRoomMenu: function(e) {
			this.$refs[e].open();
		},
		closeRoomMenu: function(e) {
			this.$refs[e].close();
		},
		changeRoomMenu: function(e) {
			this.isShowRoomMenu = e;
		},
		openContinue: function() {
			this.closeRoomMenu('showLeft');
			this.$refs.popupContinue.open();
		},
		continueDays: function(e) {
			console.log('value 发生变化：' + e.detail.value);
		},
		openChange:function() {
			this.closeRoomMenu('showLeft');
			this.$refs.popupChange.open();
		},
		changeTypeChange: function(e) {
			this.changeTypeIndex = e.detail.value;
		},
		changeRoomChange: function(e) {
			this.changeRoomIndex = e.detail.value;
		},
		openStatus:function() {
			this.closeRoomMenu('showLeft');
			this.$refs.popupStatus.open();
		},
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
	min-height: 120rpx;
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
.ml{
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
.cantinueBtn{
	margin-top: 15px;
	width: 500rpx;
}
.changeItem{
	font-size: 14px;
	height: 80px;
	line-height: 80px;
	width: 500rpx;
	margin: 0 auto;
}
.changeInput{
	height: 80px;
	line-height: 80px;
	width: 70px;
	text-align: left;
}
.popup-bottom{
	width: 690rpx;
	background-color: #fff;
	padding: 15px 15px 70px 15px;
	border-radius: 10px;
}
.StatusBtn{
	margin-top: 10px;
	width: 600rpx;
}
.kongxianHover{
	background-color: #3eb352;
}
.baoliuHover{
	background-color: #5a646f;
}
.weixiuHover{
	background-color: #cb9242;
}
</style>
