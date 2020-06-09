<template>
	<view class="order">
		<uni-section class="sectionClass" title="房间信息" type="line"></uni-section>
		<uni-list>
			<uni-list-item class="listItemClass" title="房型数量" :showArrow="false">
				<template v-slot:right="">
					2 × 智享大床房
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="入离日期" :showArrow="false">
				<template v-slot:right="">
					05-26 至 05-27（1 晚）
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="201" :showArrow="false">
				<template v-slot:right="">
					<view class="name bgGreen">张三</view>
					<view class="name bgYellow">李四</view>
					<view class="name">李四</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-section class="sectionClass" title="订单信息" type="line"></uni-section>
		<uni-list>
			<uni-list-item class="listItemClass" title="交易状态" :showArrow="false">
				<template v-slot:right="">
					<view class="bgGreen">进行中</view>
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="订单来源" :showArrow="false">
				<template v-slot:right="">
					美团
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="订单号" :showArrow="false">
				<template v-slot:right="">
					zx1232134214432
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="付款方式" :showArrow="false">
				<template v-slot:right="">
					美团
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="创建时间" :showArrow="false">
				<template v-slot:right="">
					2020-05-24 14:30:21
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="付款人" :showArrow="false">
				<template v-slot:right="">
					张三
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="联系方式" :showArrow="false">
				<template v-slot:right="">
					15087076546
				</template>
			</uni-list-item>
		</uni-list>
		<uni-section class="sectionClass" title="财务信息" type="line"></uni-section>
		<uni-list class="mgBottom">
			<uni-list-item class="listItemClass" title="订单总价" :showArrow="false">
				<template v-slot:right="">
					￥400
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="房费" :showArrow="false">
				<template v-slot:right="">
					￥200
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="押金" :showArrow="false">
				<template v-slot:right="">
					￥200
					<view class="bgRed">未退</view>
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="消费" :showArrow="false">
				<template v-slot:right="">
					￥--
				</template>
			</uni-list-item>
			<uni-list-item class="listItemClass" title="收入" :showArrow="false">
				<template v-slot:right="">
					$--
				</template>
			</uni-list-item>
		</uni-list>
		<view class="bottomMenu">
			<uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" />
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				orderId: '',
				options: [],
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
		methods: {
			buttonClick(e) {
				console.log(e)
				this.options[2].info++
			}
		},
		onLoad: function(option) {
			//获取传参
			this.orderId = option.orderId;
		}
	};
</script>

<style lang="scss">
	.order {
		text-align: left;
		padding-bottom: 20px;
	}

	.sectionClass {
		margin-top: 0;
	}
	
	.mgBottom{
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
