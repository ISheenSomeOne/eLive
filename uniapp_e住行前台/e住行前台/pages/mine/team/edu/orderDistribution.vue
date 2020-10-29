<template>
	<view style="height: 100%;">
		<view class="uni-tab-bar">
			<scroll-view scroll-x="true" class="uni-swiper-tab">
				<view class="swiper-list-box">
					<block v-for="(tabBar, index) in tabBars" :key="index">
						<view class="swiper-tab-list" :class="{ active: tabIndex == index }" @tap="toggleTab(index)">
							{{ tabBar.name }}
							<view class="swiper-tab-line"></view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>
		<!--内容区-->
		<view class="uni-tab-bar">
			<swiper :current="tabIndex" @change="tabChange" :style="{ height: swiperHeight + 'px' }">
				<swiper-item>
					<view class="swiper-item">
						<view class="topInfo">
							<view class="leftInfo">已分配 {{ eduDistributionInfo.allocated }}</view>
							<view class="rightInfo">未分配 {{ eduDistributionInfo.unassigned }}</view>
						</view>
						<order-table :listType="'orderDistributionList'" :titleList="titleList" :tableList="eduDistributionInfo.carList" :examId="examId"></order-table>
						<view class="buttonBox" @click="addCar">添加车辆</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="topInfo">
							<view class="leftInfo">已分配 {{ eduDistributionInfo.allocated }}</view>
							<view class="rightInfo">未分配 {{ eduDistributionInfo.unassigned }}</view>
						</view>
						<view class="container999">
							<block v-for="(hotelInfo, index) in eduDistributionInfo.hotelList" :key="index">
								<view @click="toHotelInfo(hotelInfo.hotelId)"><uni-section class="titleClass" :title="hotelInfo.hotelName" type="line"></uni-section></view>
								<block v-for="(roomInfo, index) in hotelInfo.roomList" :key="index">
									<view class="line">
										<view class="lineLeft">{{ roomInfo.roomName }}</view>
										<view class="lineRight" @click="toUserList(roomInfo.roomId)">{{ roomInfo.userNameList }}</view>
									</view>
								</block>
							</block>
							<view class="buttonBox" @click="toHotelInfo()">添加酒店房间</view>
						</view>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="topInfo">
							<view class="leftInfo">已分配 {{ eduDistributionInfo.allocated }}</view>
							<view class="rightInfo">未分配 {{ eduDistributionInfo.unassigned }}</view>
						</view>
						<block v-for="(startingList, index) in eduDistributionInfo.startingList" :key="index">
							<view class="addItem" @click="toUserList(index)">{{ startingList.name }}</view>
						</block>
					</view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="topInfo">
							<view class="leftInfo">已分配 {{ eduDistributionInfo.allocated }}</view>
							<view class="rightInfo">未分配 {{ eduDistributionInfo.unassigned }}</view>
						</view>
						<block v-for="(examSiteList, index) in eduDistributionInfo.examSiteList" :key="index">
							<view class="addItem" @click="toUserList(index)">{{ examSiteList.name }}</view>
						</block>
					</view>
				</swiper-item>
			</swiper>
			<view class="buttonBoxAdd" v-show="!showMenu1" @click="openChooseSend">发送提醒</view>
			<view class="bottomMenu" v-show="showMenu1"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
		</view>
	</view>
</template>

<script>
const valid = require('../../../../util/valid.js'); //校验规则文件
const util = require('../../../../util/util.js'); //防重点击函数
export default {
	data() {
		return {
			examId: '',
			buttonGroup: [
				{
					text: '自动分配',
					backgroundColor: '#007aff',
					color: '#fff'
				},
				{
					text: '发送提醒',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			],
			options: [],
			tabIndex: 0, //选中标签栏的序列
			contentList: ['待入住', '入住中', '全部', '创建订单'],
			titleList: [{ cont: '编号', width: 'normal' }, { cont: '车牌号', width: 'normal' }, { cont: '司机', width: 'normal' }, { cont: '人数/容量', width: 'normal' }],
			orderDistributionList: [
				{
					numbering: '1号车',
					carNumber: '云A 12345',
					driver: '张三',
					peopleNum: '40/40'
				},
				{
					numbering: '2号车',
					carNumber: '云A 54321',
					driver: '李四',
					peopleNum: '40/40'
				},
				{
					numbering: '3号车',
					carNumber: '云A 23123',
					driver: '王五',
					peopleNum: '0/40'
				}
			],
			tabBars: [
				{
					name: '车辆',
					id: '0'
				},
				{
					name: '酒店房间',
					id: '1'
				},
				{
					name: '出发点',
					id: '2'
				},
				{
					name: '考点',
					id: '3'
				}
			],
			origin: ['选择来源', '美团', '携程', '飞猪', '去哪', '艺龙', '其他'],
			payWay: ['选择方式', '已支付', '到店支付'],
			nowOrigin: 0,
			nowPayWay: 0,
			swiperHeight: '',
			customItem: '全部', //地址picker的全部功能
			form: {},
			showMenu1: true
		};
	},
	computed: {
		needResetEduDistributionHeight() {
			return this.$store.state.edu.needResetEduDistributionHeight;
		},
		eduDistributionInfo() {
			return this.$store.state.edu.eduDistributionInfo;
		}
	},
	watch: {
		needRefresh(newData, oldData) {
			let that = this;
			if (newData) {
				that.nowOrigin = 0;
				that.nowPayWay = 0;
				that.form = {};
			this.$store.commit('setNeedRefresh');
			}
		},
		needResetEduDistributionHeight(newData, oldData) {
			let that = this;
			if (newData) {
				that.setSwiperHeight();
				this.$store.commit('resetEduDistributionHeightFalse');
			}
		},
		swiperHeight(newData, oldData) {
			let that = this;
			if (newData) {
				// console.log(newData);
			}
		}
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
			let val = { examId: that.examId, type: 0 };
			that.$store.commit('req_getEduDistribution', val);
		}
	},
	onShow() {
		let that = this;
		let val = { examId: that.examId, type: that.tabIndex };
		that.$store.commit('req_getEduDistribution', val);
	},
	methods: {
		//下方按钮事件
		buttonClick(e) {
			//点击自动分配
			if (e.index == 0) {
				this.$store.commit('req_autoDistribution', this.examId);
			}

			//点击发送提醒
			if (e.index == 1) {
				this.openChooseSend();
			}
		},
		//打开选择群组界面
		openChooseSend() {
			let that = this;
			//延后开发选择群组开发
			uni.navigateTo({
				url: '/pages/mine/team/edu/editSend?examId=' + that.examId
			});

			// uni.navigateTo({
			// 	url: '/pages/mine/team/edu/chooseSend'
			// });
		},
		toHotelInfo(hotelId) {
			console.log(123);
			uni.navigateTo({
				url: 'eduHotel?eduHotelId=' + hotelId + '&examId=' + this.examId
			});
		},
		roomInfo(roomId) {
			uni.navigateTo({
				url: 'eduHotel?eduRoomId=' + roomId
			});
		},
		addCar() {
			// console.log(this.examId);
			uni.navigateTo({
				url: '/pages/mine/team/edu/carInfo?examId=' + this.examId
			});
		},
		toUserList(id) {
			let that = this;
			let roomId = '';
			let startingId = '';
			let examSiteId = '';
			if (that.tabIndex == 1) {
				roomId = id;
			} else if (that.tabIndex == 2) {
				startingId = id;
			} else if (that.tabIndex == 3) {
				examSiteId = id;
			}
			uni.navigateTo({
				url: '/pages/mine/team/edu/eduUserList?roomId=' + roomId + '&startingId=' + startingId + '&examSiteId=' + examSiteId + '&examId=' + that.examId
			});
		},
		toggleTab(index) {
			this.tabIndex = index;
		},
		//滑动切换swiper
		tabChange(e) {
			// console.log(e.detail.current);
			const tabIndex = e.detail.current;
			this.tabChangeFunc(tabIndex);

			let val = { examId: this.examId, type: this.tabIndex };
			this.$store.commit('req_getEduDistribution', val);
		},
		//页面切换调用
		tabChangeFunc(tabIndex) {
			this.tabIndex = tabIndex;
			if (tabIndex == 0 || tabIndex == 1) {
				this.showMenu1 = true;
			} else {
				this.showMenu1 = false;
			}
		},
		//动态swiper高度
		setSwiperHeight() {
			let that = this;
			let height = '';
			let setHeight = setInterval(() => {
				// let info = uni.createSelectorQuery().in(that).select('.swiper-item');
				// info.boundingClientRect(function(data) {
				// 	//data - 各种参数
				// 	height = data.height;
				// }).exec();
				height = document.getElementsByClassName('swiper-item')[that.tabIndex].offsetHeight;
				if (height != '' && height != 'undefind') {
					// console.log(height);
					that.swiperHeight = height;
					clearInterval(setHeight);
				}
			}, 5);
			setTimeout(() => {
				clearInterval(setHeight);
			}, 2000);
		},
		//打开日历
		open() {
			this.$refs.calendar.open();
		},
		dateChange(e) {
			// console.log(e);
		},
		dateConfirm(e) {
			this.$store.commit('createOrderDateChange', e);
		},
		//input change
		originChange(e) {
			this.nowOrigin = e.target.value;
			this.$store.commit('originChange', this.origin[this.nowOrigin]);
		},
		roomTypeChange(e) {
			this.$store.commit('roomTypeChange', e.target.value);
		},
		roomCountChange(e) {
			this.$store.commit('roomCountChange', e.target.value);
		},
		payWayChange(e) {
			this.nowPayWay = e.target.value;
			this.$store.commit('payWayChange', this.payWay[this.nowPayWay]);
		},
		formChange(e) {
			let name = e.currentTarget.dataset.name;
			let tempVal = e.target.value || e.detail.value;
			if (this.form[name] === 'undefined') {
				// console.log('首次添加属性名')
				this.$set(this.form, name, tempVal);
			} else {
				// 若存在则直接赋值
				this.form[name] = tempVal;
			}
			this.$store.commit('formDataChange', this.form);
		},
		// 验证方法
		toVaild(tempList) {
			// valid(value,type)为引入的校验方法,49行可见
			return tempList.every((item, index) => {
				let isVal = this.form[item.paramName];
				if (!isVal || !valid(isVal, item.rules)) {
					uni.showModal({
						title: '错误',
						content: `${item.failPass}`,
						showCancel: false
					});
					return false;
				}
				return true;
			});
		},
		// 提交
		submit: util.throttle(function(e) {
			let that = this;
			// console.log('提交');
			let tempList = [
				{
					paramName: 'name', //data-name和form中的参数名
					failPass: '请输入正确的姓名', //失败的提示
					rules: 'name' //校验的规则名称
				},
				{
					paramName: 'price', //data-name和form中的参数名
					failPass: '请输入房间单价', //失败的提示
					rules: 'currency' //校验的规则名称
				}
				// {
				// 	paramName:'phone', //data-name和form中的参数名
				// 	failPass:'请输入正确的手机号', //失败的提示
				// 	rules:'phone', //校验的规则名称
				// },{
				// 	paramName:'id', //data-name和form中的参数名
				// 	failPass:'请输入正确的身份证', //失败的提示
				// 	rules:'cardid', //valid中的规则名称
				// },
			];
			if (this.toVaild(tempList)) {
				this.$store.dispatch('createOrder');
			}
		}, 1000), //防重点击,1s内只可点击一次
		//获取更多order信息
		getMore: util.throttle(function(e) {
			//查看更多
			this.$store.dispatch('initOrderListInfo', this.tabIndex);
		}, 1000) //防重点击,1s内只可点击一次
	}
};
</script>

<style lang="scss" scoped>
// .popupBox {
// 	width: 100% !important;
// 	min-height: 30vh !important;
// 	max-height: 60vh !important;
// 	overflow: scroll;
// 	border-top-left-radius: 12px;
// 	border-top-right-radius: 12px;
// 	padding-bottom: 10px !important;
// }
.addItem {
	height: 40px;
	line-height: 40px;
	width: 670rpx;
	border-bottom: 1px solid #f5f5f5;
	font-size: 14px;
	margin: 0 auto;
}
.titleClass {
	font-weight: bold;
}
.buttonBox {
	width: 91%;
	margin: 10px auto;
	height: 40px;
	border-radius: 100px;
	color: white;
	display: flex;
	align-items: center;
	justify-content: center;
	background-color: #4cd964;
	font-size: 16px;
}
.buttonBoxAdd {
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
.topInfo {
	display: flex;
	justify-content: space-between;
	padding: 0 10px;
}
.leftInfo {
	background-color: rgb(160, 234, 193);
	border-radius: 2px;
	padding: 2px 6px;
	font-size: 13px;
	height: 25px;
	line-height: 25px;
	color: #333;
	font-weight: bold;
}
.rightInfo {
	background-color: #dd524d;
	border-radius: 2px;
	padding: 2px 6px;
	font-size: 13px;
	height: 25px;
	line-height: 25px;
	color: #fff;
	font-weight: bold;
}
.swiper-item {
	min-height: 80vh;
	margin-top: 10px;
	padding-bottom: 70px;
}
.swiper-list-box {
	display: flex;
	justify-content: space-around;
	padding: 5px;
	height: 34px;
	line-height: 34px;
}
.swiper-tab-list {
	color: #ffffff;
	width: 177rpx;
	font-size: 14px;
}
.createOrder {
	background-color: #4cd964;
	border-radius: 5px;
}
.uni-tab-bar .active {
	color: #fff;
	font-weight: bold;
}

.active .swiper-tab-line {
	border-bottom: 3px solid #fff;
	width: 80rpx;
	margin: auto;
	border-radius: 10px;
}
.uni-swiper-tab {
	background-color: $uni-color-primary;
}
//创建订单表单
.plaClass {
	color: #dbdbdb;
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
	// min-height: 75vh;
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}
.pickerClass {
	width: 100%;
	text-align: left;
}
.more-btn {
	width: 500rpx;
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
</style>
