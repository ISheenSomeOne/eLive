<template>
	<view class="order">
		<block v-for="(roomTypeList, index) in orderDetailInfo.roomTypeList" :key="index">
			<uni-section class="sectionClass" title="房间信息" type="line"></uni-section>
			<uni-list>
				<uni-list-item class="listItemClass" title="房型数量" :showArrow="false">
					<template v-slot:right="">
						{{roomTypeList.roomTypeCount +' × '+ roomTypeList.roomTypeName}}
					</template>
				</uni-list-item>
				<uni-list-item class="listItemClass" title="入离日期" :showArrow="false">
					<template v-slot:right="">
						{{roomTypeList.checkin +' 至 '+ roomTypeList.checkout +'（'+ roomTypeList.night +'晚）'}}
					</template>
				</uni-list-item>
				<uni-list-item class="listItemClass" title="房费" :showArrow="false">
					<template v-slot:right="">
						￥{{roomTypeList.roomTypeCountPrice}}
					</template>
				</uni-list-item>
				<uni-list-item v-if="roomTypeList.roomList.length == 0" class="listItemClass" title="房间号" :showArrow="false">
					<template v-slot:right="">
						房间未选
					</template>
				</uni-list-item>
				<block else v-for="(roomList, inde) in roomTypeList.roomList" :key="inde">
					<uni-list-item class="listItemClass" :title="roomList.roomNum" :showArrow="false">
						<template v-slot:right="">
							<block v-for="(userList, ind) in roomList.userList" :key="ind">
								<view :class="'name'+ userList.state?'bgGreen':'bgYellow'">{{userList.username}}</view>
							</block>
						</template>
					</uni-list-item>
				</block>
			</uni-list>
		</block>
		<uni-section class="sectionClass" title="订单信息" type="line"></uni-section>
		<uni-list>
			<uni-list-item class="listItemClass" title="交易状态" :showArrow="false">
				<template v-slot:right="">
					<view :class="orderDetailInfo.stateClass">{{orderDetailInfo.stateName}}</view>
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="订单来源" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.source}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="订单号" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.orderNum}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="付款方式" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.payWay}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="创建时间" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.createTime}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="下单人" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.orderPeople}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="付款人" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.payPeople}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="联系方式" :showArrow="false">
				<template v-slot:right="">
					{{orderDetailInfo.phone}}
				</template>
			</uni-list-item>
		</uni-list>
		<uni-section class="sectionClass" title="财务信息" type="line"></uni-section>
		<uni-list class="mgBottom">
			<uni-list-item class="listItemClass" title="订单总价" :showArrow="false">
				<template v-slot:right="">
					￥{{orderDetailInfo.TotalPrice}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="房费" :showArrow="false">
				<template v-slot:right="">
					￥{{orderDetailInfo.roomPrice}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="押金" :showArrow="false">
				<template v-slot:right="">
					￥{{orderDetailInfo.deposit}}
					<view v-if="orderDetailInfo.state == 62" class="bgRed" @click="confirmDialog(orderDetailInfo.refundApplicationId)">未退</view>
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="消费" :showArrow="false">
				<template v-slot:right="">
					￥{{orderDetailInfo.consumption}}
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" style="color: #ffa200;font-size: 16px;" title="收入" :showArrow="false">
				<template v-slot:right="">
					￥{{orderDetailInfo.income}}
				</template>
			</uni-list-item>
		</uni-list>
		<view class="bottomMenu">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" />
		</view>
		<!-- 退押信息 -->
		<uni-popup ref="dialogInput" type="dialog">
			<uni-popup-dialog mode="input" title="输入内容" :value="orderDetailInfo.deposit" placeholder="请输入退款金额" @confirm="refund"></uni-popup-dialog>
		</uni-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				options: [],
				refundApplicationId: '',
				buttonGroup: [{
						text: '修改订单',
						backgroundColor: '#ffa200',
						color: '#fff'
					},
					{
						text: '取消订单',
						backgroundColor: '#ff0000',
						color: '#fff'
					}
				]
			};
		},
		computed: {
			orderDetailInfo() {
				return this.$store.state.order.orderDetailInfo
			},
		},
		methods: {
			buttonClick(e) {
				console.log(e)
				this.options[2].info++
			},
			//点击退押金
			confirmDialog(id) {
				this.refundApplicationId = id
				this.$refs.dialogInput.open()
			},
			//输入金额后点击确定
			refund(done, val) {
				let that = this
				uni.showModal({
					title: '提示',
					content: '确定退押金吗？',
					success: function(res) {
						if (res.confirm) {
							if (val == '' || val == undefined) {
								uni.showToast({
									title: '请填写金额',
									duration: 2000,
									icon: 'none'
								});
							} else if (!isNaN(val)) {
								uni.showToast({
									title: '只能输入数字和小数点',
									duration: 2000,
									icon: 'none'
								});
							} else if (val < 0) {
								uni.showToast({
									title: '请输入正确的金额',
									duration: 2000,
									icon: 'none'
								});
							} else if (val > that.$store.state.order.orderDetailInfo.deposit) {
								uni.showToast({
									title: '不能超过押金数额',
									duration: 2000,
									icon: 'none'
								});
							} else {
								let params = {
									'id': that.refundApplicationId,
									'refundPrice': val
								}
								that.$store.dispatch("refund", params)
								done()
							}
						} else if (res.cancel) {
							done()
						}
					}
				});
			}
		},
		onLoad: function(option) {
			//获取传参，赋值id
			this.$store.dispatch('initOrderDetailInfo', option.orderId)
		}
	};
</script>

<style lang="scss" scoped>
	.order {
		text-align: left;
		padding-bottom: 20px;
	}

	.sectionClass {
		margin-top: 0;
	}

	.mgBottom {
		margin-bottom: 40px;
	}

	.listItemClass {
		font-size: 14px;
		color: #545151;
	}

	.name {
		color: #ffffff;
		background-color: #999999;
		padding: 2px 4px;
		margin-left: 5px;
	}

	.bgGreen {
		padding: 2px 4px;
		color: #ffffff;
		background-color: #4cd964;
	}

	.bgYellow {
		padding: 2px 4px;
		color: #ffffff;
		background-color: #f0ad4e;
	}

	.bgRed {
		padding: 2px 4px;
		color: #ffffff;
		background-color: #dd524d;
		margin-left: 5px;
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
</style>
