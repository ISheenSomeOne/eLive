<template>
	<view>
		<view class="example-body">
			<uni-card style="text-align: left;" :isShadow="true" title="智享未来酒店" subTitle="李俊林" mode="title" thumbnail="/static/icon/logo.png"
			 extra="店长" note="true" @click="clickCard">
				<view>
					<view class="content-box"><text class="content-box-text">昆明汇都酒店是一家商务型酒店，位于昆明市昌宏路，酒店交通便利，房间干净舒适</text></view>
				</view>
				<template slot="footer">
					<view class="footer-box">
						<view @click.stop="footerClick(0)"><text class="footer-box__item">4.8分</text></view>
						<view @click.stop="footerClick(1)"><text class="footer-box__item">入住: 13:00以后</text></view>
						<view @click.stop="footerClick(2)"><text class="footer-box__item">离店: 13:00之前</text></view>
					</view>
				</template>
			</uni-card>
		</view>
		<uni-list style="text-align: left;">
			<uni-list-item title="员工管理" :show-extra-icon="true" :extra-icon="{color: '#007aff',size: '22',type: 'contact-filled'}" />
			<navigator url="room/roomRoomType"><uni-list-item title="房型房间" :show-extra-icon="true" :extra-icon="{color: '#4cd964',size: '22',type: 'home-filled'}" /></navigator>
			<uni-list-item title="活动管理" :show-extra-icon="true" :extra-icon="{color: '#54d2ff',size: '22',type: 'paperplane-filled'}" />
			<uni-list-item title="会议管理" :show-extra-icon="true" :extra-icon="{color: '#999999',size: '22',type: 'chat-filled'}" />
			<uni-list-item title="团队管理" :show-extra-icon="true" :extra-icon="{color: '#343a40',size: '22',type: 'chatboxes-filled'}" />
			<uni-list-item title="门锁管理" :show-extra-icon="true" :extra-icon="{color: '#dd524d',size: '22',type: 'locked-filled'}" />
			<uni-list-item title="商品管理" :show-extra-icon="true" :extra-icon="{color: '#f0ad4e',size: '22',type: 'cart-filled'}" />
			<!-- <uni-list-item :disabled="true" :show-extra-icon="true" :extra-icon="extraIcon2" :show-switch="true" :switch-checked="true"
			 title="禁用状态" @switchChange="switchChange" /> -->
		</uni-list>
		<button class="logout" @click="logout" type="warn">退出登录</button>
	</view>
</template>

<script>
	export default {
		data() {
			return {};
		},
		methods: {
			logout() {
				this.$store.dispatch('logout')
			},
			clickCard() {
				uni.showToast({
					title: '功能正在开发中 · · ·',
					icon: 'none'
				})
			},
			footerClick(e) {
				console.log(e)
				uni.showToast({
					title: e,
					icon: 'none'
				})
			}
		}
	};
</script>

<style scoped>
	.titleBox {
		text-align: left;
	}

	.example-body {
		/* #ifndef APP-NVUE */
		display: block;
		/* #endif */
		padding: 1px 0;
	}

	/* .content-box {
			padding-top: 20rpx;
		} */

	.content-box-text {
		font-size: 14px;
		line-height: 22px;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box;
		-webkit-line-clamp: 2;
		-webkit-box-orient: vertical;
		text-indent: 2em;
	}

	.footer-box {
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: space-between;
		flex-direction: row;

	}

	.footer-box__item {
		align-items: center;
		padding: 2px 0;
		font-size: 14px;
		color: #666;
	}
	.logout{
		width: 90%;
		font-size: 16px;
		margin-top: 20px;
		margin-bottom: 10px;
	}
</style>
