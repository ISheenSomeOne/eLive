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
					<uni-grid-item class="roomCtrl"><button plain="true" type="warn">退押</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="warn">退房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button plain="true" type="default">房态</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="default">续房</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button plain="true" type="default">订单</button></uni-grid-item>
					<uni-grid-item class="roomCtrl"><button type="primary">消费</button></uni-grid-item>
				</uni-grid>
				<view class="closeDrawer"><button type="warn" @click="closeRoomMenu('showLeft')">返回</button></view>
			</view>
		</uni-drawer>
		<uni-fab direction="vertical" :pattern="fabStyle" horizontal="right" :content="fabCont" vertical="bottom" @fabClick="showColor"></uni-fab>
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
	</view>
</template>

<script>
export default {
	data() {
		return {
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
		} else {
			this.gridColumn = 8;
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

.topNavBar{
	position: relative;
	top: 0;
	height: 44px;
	line-height: 44px;
	width: 100%;
	background-color: $uni-color-primary;
	color: #FFF;
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

.roomCtrl{
	margin: 10px 0;
}

.roomCtrl button{
	width: 85%;
}

.closeDrawer{
	margin-top: 20px;
}

.kongxian {
	background-color: $uni-color-success;
	color: #FFF;
}

.yuliu {
	background-color: $uni-color-yuliu;
	color: #FFF;
}

.zaizhu {
	background-color: $uni-color-primary;
	color: #FFF;
}

.chaoshi {
	background-color: $uni-color-error;
	color: #FFF;
}

.dasao {
	background-color: $uni-color-dasao;
	color: #FFF;
}

.weixiu {
	background-color: $uni-color-warning;
	color: #FFF;
}

.baoliu {
	background-color: $uni-color-baoliu;
	color: #FFF;
}
</style>
