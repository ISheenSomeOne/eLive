<template>
	<view class="table-box">
		<view class="table-list-item table-title">
			<block v-for="(item, index) in titleList" :key="index">
				<view class="table-cont-item" :class="item.width == 'short' ? 'short' : item.width == 'long' ? 'long' : ' '">{{ item.cont }}</view>
			</block>
		</view>
		<!-- order -->
		<block v-if="listType == 'order'" v-for="(item, index) in tableList" :key="index">
			<view class="table-list-item" @click="toOrderInfo(item.orderId)">
				<uni-badge class="tuiYaTip" v-show="item.state == 62" text="退押金" size="small" type="error"></uni-badge>
				<view class="table-cont-item short">
					<text :class="item.originClass">{{ item.source }}</text>
				</view>
				<view class="table-cont-item">{{ item.OwnerName }}</view>
				<view class="table-cont-item long">
					<block v-for="(roomType, inde) in item.roomTypeInfo" :key="inde">{{ roomType.roomCount + '×' + roomType.roomTypeName }}</block>
				</view>
				<view class="table-cont-item short">{{ item.checkin }}</view>
				<view class="table-cont-item short">{{ item.checkout }}</view>
				<view class="table-cont-item short">{{ item.price }}</view>
			</view>
		</block>
		<!-- teamList -->
		<block v-if="listType == 'eduList'" v-for="(item, index) in tableList" :key="index">
			<view class="table-list-item1" @click="toEduOrderInfo(item.id)">
				<view class="table-cont-item2 long">{{ item.name }}</view>
				<view class="table-cont-item short">{{ item.principal }}</view>
				<view class="table-cont-item">{{ item.contact }}</view>
				<view class="table-cont-item">{{ item.time }}</view>
				<view class="table-cont-item short">{{ item.state }}</view>
			</view>
		</block>
		<!-- eduOrderDistributionCar -->
		<block v-if="listType == 'orderDistributionList'" v-for="(item, index) in tableList" :key="index">
			<view style="font-size: 14px;" class="table-list-item1" @click="toCarInfo(item.id)">
				<view class="table-cont-item">{{ item.numbering }}</view>
				<view class="table-cont-item">{{ item.carNumber }}</view>
				<view class="table-cont-item">{{ item.driver }}</view>
				<view @click.stop="toUserList(item.id)" class="linkClass table-cont-item">{{ item.peopleNum }}</view>
			</view>
		</block>
		<!-- eduDistributionItem -->
		<block v-if="listType == 'eduDistributionItem'" v-for="(item, index) in tableList" :key="index">
			<view class="table-list-item1" @longpress="del(item.memberId)" @click="toUserInfo(item.memberId)">
				<view class="table-cont-item short">{{ item.memberName }}</view>
				<view class="table-cont-item short">{{ item.sex }}</view>
				<view class="table-cont-item short">{{ item.car }}</view>
				<view class="table-cont-item">{{ item.startingName }}</view>
				<view class="table-cont-item long">{{ item.hotelRoom }}</view>
				<view class="table-cont-item">{{ item.examSite }}</view>
			</view>
		</block>
		<!-- eduAddUserList -->
		<block v-if="listType == 'eduAddUserList'" v-for="(item, index) in tableList" :key="index">
			<view class="table-list-item1">
				<view class="table-cont-item short"><checkbox name="chooseUser" value="cb" checked="true" /></view>
				<view class="table-cont-item short">{{ item.memberName }}</view>
				<view class="table-cont-item short">{{ item.sex }}</view>
				<view class="table-cont-item short">{{ item.car }}</view>
				<view class="table-cont-item">{{ item.startingName }}</view>
				<view class="table-cont-item long">{{ item.hotelRoom }}</view>
				<view class="table-cont-item">{{ item.examSite }}</view>
			</view>
		</block>
	</view>
</template>

<script>
export default {
	name: 'OrderTable',
	props: ['tableList', 'titleList', 'listType'],
	data() {
		return {
			// orderList: [{
			// 		id: 1,kkkkkkk
			// 		source: '美团',
			// 		originClass: 'meituan'
			// 	},
			// 	{
			// 		id: 2,
			// 		source: '携程',
			// 		originClass: 'xiecheng'
			// 	},
			// 	{
			// 		id: 3,
			// 		source: '微信',
			// 		originClass: 'weixin'
			// 	}
			// ]
		};
	},
	beforeUpdate() {
		// let info = uni.createSelectorQuery().select(".table-box");
		// 	info.boundingClientRect(function(data) { //data - 各种参数
		// 	console.log(data.height)
		// }).exec()
	},
	methods: {
		toOrderInfo(orderId) {
			uni.navigateTo({
				url: '/pages/order/orderInfo?orderId=' + orderId
			});
		},
		toEduOrderInfo(orderId) {
			uni.navigateTo({
				url: '/pages/mine/team/edu/eduOrderInfo?orderId=' + orderId
			});
		},
		toCarInfo(orderId) {
			uni.navigateTo({
				url: '/pages/mine/team/edu/carInfo?orderId=' + orderId
			});
		},
		toUserList(id) {
			uni.navigateTo({
				url: '/pages/mine/team/edu/eduUserList?id=' + id
			});
		},
		toUserInfo(memberId){
			uni.navigateTo({
				url: '/pages/mine/team/edu/eduUserInfo?memberId=' + memberId
			});
		},
		del(id){
			uni.showModal({
				title: '提示',
				content: '确定删除吗？',
				confirmColor: '#dd524d',
				success: function(res) {
					if (res.confirm) {
						console.log(111)
					} else if (res.cancel) {
					}
				}
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.linkClass {
	color: #007aff;
}
.table-box {
	font-size: 12px;
	margin-bottom: 10px;
}

.table-list-item {
	position: relative;
	display: flex;
	justify-content: space-between;
	text-align: center;
	height: 40px;
	line-height: 40px;
	border-bottom: 1px solid #f1f1f1;
	width: 730rpx;
	margin: 0 auto;
}
.table-list-item1 {
	position: relative;
	display: flex;
	justify-content: space-between;
	text-align: center;
	height: 50px;
	line-height: 50px;
	border-bottom: 1px solid #f1f1f1;
	width: 730rpx;
	margin: 0 auto;
}

.table-cont-item {
	width: 152rpx;
	overflow: hidden;
	white-space: nowrap;
	text-overflow: ellipsis;
}

.table-cont-item2 {
	width: 110rpx;
	line-height: 24px;
	overflow: hidden;
	text-overflow: ellipsis;
	display: -webkit-box;
	-webkit-line-clamp: 2;
	-webkit-box-orient: vertical;
}

.short {
	width: 85rpx;
}

.long {
	width: 250rpx;
}

.table-title {
	font-weight: bold;
}

.meituan {
	padding: 5px;
	background-color: #ffc300;
}

.xiecheng {
	padding: 5px;
	background-color: #3983e5;
	color: #fff;
}

.weixin {
	padding: 5px;
	background-color: #09bb07;
	color: #fff;
}

.tuiYaTip {
	position: absolute;
	top: -4px;
	right: -5px;
}
</style>
