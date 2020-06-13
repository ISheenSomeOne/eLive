<template>
	<view class="roomSetting">
		<uni-list style="text-align: left;padding-bottom: 60px;">
			<uni-list-item
				style="font-weight: 600;"
				title="301"
				@switchChange="usingRoom"
				:switchChecked="isUsing"
				showSwitch="true"
				:showArrow="false"
				thumb="/static/icon/logo.png"
			/>
			<view class="listBox">
				<view class="listItem">
					<view class="leftItem">房间号</view>
					<input class="iptClass" type="text" placeholder="如: 301" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">地详细址</view>
					<input class="iptClass" type="text" placeholder="如: xx区xx路xx大厦" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">所在楼层</view>
					<input class="iptClass" type="number" placeholder="如: 13" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">卫生间</view>
					<picker mode="multiSelector" :range="bathroom" @change="bathroomChange">
						<view class="multiSelectorPikerBox">
							<view>{{ bathroom[0][nowBathroomType] }}</view>
							<view>{{ bathroom[1][nowBathroomWash] }}</view>
							<view>{{ bathroom[2][nowBathroomBathe] }}</view>
						</view>
					</picker>
				</view>
				<view class="listItem">
					<view class="leftItem">热水时长</view>
					<input class="iptClass" type="text" placeholder="如: 24" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">WIFI</view>
					<input class="iptClass" type="text" placeholder="如: 您的WiFi名称" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">密码</view>
					<input class="iptClass" type="text" placeholder="如: 您的WiFi密码" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">床型</view>
					<input class="iptClass" type="text" placeholder="如: 1.5米,2米,2米圆床" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">所属房型</view>
					<picker mode="multiSelector" :range="belongRoomType" @change="belongRoomTypeChange">
						<view class="multiSelectorPikerBox">
							<view>{{ belongRoomType[0][nowBelongRoomType] }}</view>
						</view>
					</picker>
				</view>
			</view>
		</uni-list>
		<uni-section class="sectionClass" title="房间信息" type="line"></uni-section>
		<uni-fav :checked="checkList[4]" :content-text="contentText[0]" class="favBtn" @click="favClick(4)" />
		<view class="bottomMenu"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			belongRoomType: ['选择房型','智享大床房','豪华大床房','豪华双床房'],
			nowBelongRoomType: 0,
			checkList: [false, true, false, false],
			contentText: [
				{
					contentDefault: '追番',
					contentFav: '已追番'
				}
			],
			bathroom: [['选择卫生间类型', '无独立卫浴', '公共', '独蹲', '独坐'], ['洗漱用品', '有洗漱用品', '没有洗漱用品'], ['洗澡类型', '淋浴', '浴缸']],
			nowBathroomType: 0,
			nowBathroomWash: 0,
			nowBathroomBathe: 0,
			isUsing: true,
			options: [
				{
					icon: 'trash',
					text: '删除'
				}
			],
			buttonGroup: [
				{
					text: '修改房型信息',
					backgroundColor: '#ffa200',
					color: '#fff'
				},
				{
					text: '新增房间',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			]
		};
	},
	methods: {
		usingRoom(e) {
			this.isUsing = e.value;
		},
		belongRoomTypeChange(e){
			
		},
		bathroomChange(e) {
			this.nowBathroomType = e.target.value[0];
			this.nowBathroomWash = e.target.value[1];
			this.nowBathroomBathe = e.target.value[2];
		},
		favClick(index) {
			this.checkList[index] = !this.checkList[index];
			this.$forceUpdate();
		}
	}
};
</script>

<style lang="scss" scoped>
	.roomSetting{
		text-align: left;
	}
.sectionClass {
	margin-top: 0;
}
.listBox {
	padding: 15px;
}

.listItem {
	display: flex;
	justify-content: left;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #eeeeee;
}
.leftItem {
	font-size: 14px;
	font-weight: 600;
	width: 60px;
}
.rightItem {
}
.iptClass {
	margin-left: 15px;
	font-size: 14px;
	height: 40px;
	line-height: 40px;
	width: 70%;
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
.multiSelectorPikerBox {
	display: flex;
	justify-content: space-between;
	font-size: 14px;
	margin-left: 15px;
}
.multiSelectorPikerBox view {
	margin-right: 5px;
}
</style>
