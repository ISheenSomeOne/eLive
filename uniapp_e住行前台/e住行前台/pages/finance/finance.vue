<template>
	<view>
		<uni-calendar ref="calendar" :btm="true" :insert="false" :lunar="true" :range="true" @confirm="dateConfirm" />
		<view class="topBox">
			<view class="calendar-button" @click="openCalendar">{{financeDate.before}} 至 {{financeDate.after}}</view>
			<picker class="pickerClass" mode="selector" :range="datePiker" :value="datePikerIndex" @change="financeDateChange">
				<view>
					{{ datePiker[datePikerIndex] }}
					<uni-icons class="dateIcon" color="#777" type="arrowdown"></uni-icons>
				</view>
			</picker>
		</view>
		<view class="mainBox">
			<view class="mainTop">
				<view class="mainTopBox">
					<view class="mainTopTitle">
						实际营收
					</view>
					<view style="text-align: left;" class="mainTopCont">
						{{orderData.otherData.total}}
					</view>
				</view>
				<view class="mainTopBox">
					<view class="mainTopTitle">
						平均房价
					</view>
					<view style="text-align: right;" class="mainTopCont">
						{{hejiData.totalAverageHousingPrice}}
					</view>
				</view>
			</view>
			<view class="mainBottom">
				<view class="mainBottomBox">
					<view class="mainTopTitle">
						入住率
					</view>
					<view class="mainBottomCont">
						{{hejiData.totalOccupancy}}
					</view>
				</view>
				<view class="mainBottomBox">
					<view class="mainTopTitle">
						开房数
					</view>
					<view class="mainBottomCont">
						{{hejiData.totalRoomOccupancy}}
					</view>
				</view>
				<view class="mainBottomBox">
					<view class="mainTopTitle">
						房间总数
					</view>
					<view class="mainBottomCont">
						{{hejiData.totalNumberRooms}}
					</view>
				</view>
			</view>
		</view>
		<view class="tableBox">
			<view class="tableTitle">
				<view class="tableItem" style="width: 150rpx;">
					营业日期
				</view>
				<view class="tableItem">
					开房数
				</view>
				<view class="tableItem" style="width: 120rpx;">
					房间总数
				</view>
				<view class="tableItem">
					入住率
				</view>
				<view class="tableItem">
					营收
				</view>
				<view class="tableItem" style="width: 120rpx;">
					平均房价
				</view>
			</view>
			<block v-for="(item, index) in listData" :key="index">
				<view class="tableList">
					<view class="tableItem" style="width: 150rpx;">
						{{dateData[index]}}
					</view>
					<view class="tableItem">
						{{item.dayIntoHousing}}
					</view>
					<view class="tableItem" style="width: 120rpx;">
						{{hejiData.dayRoomNumber}}
					</view>
					<view class="tableItem">
						{{item.dayOccupancyRate}}
					</view>
					<view class="tableItem">
						{{item.dailyRate}}
					</view>
					<view class="tableItem" style="width: 120rpx;">
						{{item.averageRent}}
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			datePiker: ['实时', '昨天', '过去一周', '过去一月', '过去一年', '自定义'] //日期选择
		};
	},
	onLoad() {
		this.$store.commit('financeInit')
	},
	computed: {
		datePikerIndex() {
			return this.$store.state.finance.datePikerIndex;
		},
		hejiData() {
			return this.$store.state.finance.hejiData;
		},
		listData() {
			return this.$store.state.finance.listData;
		},
		dateData() {
			return this.$store.state.finance.dateData;
		},
		financeDate() {
			return this.$store.state.finance.financeDate;
		},
		orderData() {
			return this.$store.state.finance.orderData;
		},
	},
	methods: {
		//改变查看财务日期
		financeDateChange(e) {
			this.$store.commit('financeDateChange', e.target.value);
		},
		//打开日历
		openCalendar(e) {
			this.$refs.calendar.open();
		},
		//提交日期改变
		dateConfirm(e) {
			this.$store.commit('financeDateConfirm', e);
		}
	}
};
</script>

<style lang="scss" scoped>
.topBox {
	position: relative;
	height: 35px;
	line-height: 35px;
	font-size: 14px;
	padding: 8px 10px;
	display: flex;
	justify-content: space-between;
}
.calendar-button {
	box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
	color: #777;
	width: 65%;
	text-align: center;
	border-radius: 5px;
}
.pickerClass {
	box-shadow: 0px 0px 5px 1px rgba(0, 0, 0, 0.1);
	color: #777;
	border-radius: 5px;
	width: 30%;
}
.dateIcon {
	position: absolute;
	right: 15px;
}
.mainBox{
	margin: 0 10px;
	padding: 10px 30rpx;
	background-color: #007AFF;
	color: #fff;
	border-radius: 10px;
	display: flex;
	flex-direction: column;
	justify-content: space-around;
	text-align: center;
	font-size: 12px;
}
.mainTop{
	display: flex;
	justify-content: space-between;
	
}
.mainTopBox{
	
}
.mainTopTitle{
	
}
.mainTopCont{
	font-size: 24px;
	font-weight: bold;
	height: 35px;
	line-height: 35px;
}
.mainBottom{
	display: flex;
	justify-content: space-between;
	margin-top: 15px;
}
.mainBottomBox{
	
}
.mainBottomCont{
	font-size: 18px;
	font-weight: bold;
	height: 28px;
	line-height: 28px;
}
.tableBox{
	margin: 10px;
	color: #333;
	border-radius: 10px;
}
.tableTitle{
	display: flex;
	justify-content: space-between;
	font-size: 13px;
	font-weight: bold;
	height: 30px;
	line-height: 30px;
	background-color: #eee;
	border-top-right-radius: 5px;
	border-top-left-radius: 5px;
}
.tableList{
	display: flex;
	justify-content: space-between;
	font-size: 25rpx;
	height: 55rpx;
	line-height: 55rpx;
	border-bottom: 1px solid #f8f8f8;
}
.tableItem{
	width: 100rpx;
}
.tableItemLong{
	width: 200rpx;
}
</style>
