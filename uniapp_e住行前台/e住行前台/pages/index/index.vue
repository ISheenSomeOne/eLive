<template>
	<view>
		<uni-nav-bar backgroundColor="#007aff" color="#FFFFFF" title="酒店名称">
			<view slot="left">
				<picker mode="selector" value="index" :range="typepikerData" @change="typeChange">
					<view class="navBarLeft">
						{{ typepikerData[typeIndex] }}
						<uni-icons type="arrowdown" color="#FFF"></uni-icons>
					</view>
				</picker>
			</view>
			<view slot="right" class="navBarRight">
				<switch style="transform:scale(0.6)" :checked="showEmpty" color="#4CD964" @change="emptyChange" />
				<text>空</text>
			</view>
		</uni-nav-bar>
		<uni-drawer ref="showLeft" mode="left" :width="280" @change="changeRoomMenu($event)">
			<view style="padding:30rpx;">
				<view class="">
					123
				</view>
				<view class="close">
					<button type="default" @click="closeRoomMenu('showLeft')">关闭抽屉</button>
				</view>
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
					text: '空闲',
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

.navBarLeft {
	font-size: 14px;
	max-width: 90px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.navBarRight {
	font-size: 14px;
	max-width: 90px;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.tagYajin {
	position: absolute;
	top: 0;
	right: 0;
	font-weight: normal;
}

.kongxian {
	background-color: $uni-color-success;
}

.yuliu {
	background-color: #54d2ff;
}

.zaizhu {
	background-color: $uni-color-primary;
}

.chaoshi {
	background-color: $uni-color-error;
}

.dasao {
	background-color: #999999;
}

.weixiu {
	background-color: $uni-color-warning;
}

.baoliu {
	background-color: #343a40;
}
</style>
