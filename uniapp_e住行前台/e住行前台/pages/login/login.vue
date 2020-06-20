<template>
	<view class="login">
		<view class="content">
			<!-- 头部logo -->
			<view class="header"><image src="/static/icon/logo.png"></image></view>
			<!-- 主体表单 -->
			<view class="main">
				<wInput v-model="username" type="text" maxlength="11" placeholder="用户名/电话"></wInput>
				<wInput v-model="password" type="password" maxlength="20" placeholder="密码"></wInput>
			</view>
			<wButton text="登 录" :rotate="isRotate" @click.native="startLogin()" class="wbutton"></wButton>

			<!-- 其他登录 -->
			<view class="other_login cuIcon">
				<view class="login_icon"><view class="cuIcon-weixin" @tap="login_weixin"></view></view>
				<!-- <view class="login_icon">
					<view class="cuIcon-weibo" @tap="login_weibo"></view>
				</view>
				<view class="login_icon">
					<view class="cuIcon-github" @tap="login_github"></view>
				</view> -->
			</view>

			<!-- 底部信息 -->
			<view class="footer">
				<navigator url="forget" open-type="navigate">找回密码</navigator>
				<text>|</text>
				<navigator url="register" open-type="navigate">短信登录</navigator>
			</view>
		</view>
	</view>
</template>

<script>
var _this;
import wInput from '../../components/watch-login/watch-input.vue'; //input
import wButton from '../../components/watch-login/watch-button.vue'; //button

export default {
	data() {
		return {};
	},
	components: {
		wInput,
		wButton
	},
	mounted() {
		_this = this;
		//this.isLogin();
	},
	computed: {
		username: {
			get() {
				return this.$store.state.login.username;
			},
			set(val) {
				this.$store.commit('setPhoneData', val);
			}
		},
		password: {
			get() {
				return this.$store.state.login.password;
			},
			set(val) {
				this.$store.commit('setPassData', val);
			}
		},
		isRotate() {
			return this.$store.state.login.isRotate;
		}
	},
	methods: {
		isLogin() {
			//判断缓存中是否登录过，直接登录
			// try {
			// 	const value = uni.getStorageSync('setUserData');
			// 	if (value) {
			// 		//有登录信息
			// 		console.log("已登录用户：",value);
			// 		_this.$store.dispatch("setUserData",value); //存入状态
			// 		uni.reLaunch({
			// 			url: '../../../pages/index',
			// 		});
			// 	}
			// } catch (e) {
			// 	// error
			// }
		},
		startLogin() {
			this.$store.dispatch("startLogin")
		},
		login_weixin() {
			//微信登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '功能正在开发中'
			});
		},
		login_weibo() {
			//微博登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '...'
			});
		},
		login_github() {
			//github登录
			uni.showToast({
				icon: 'none',
				position: 'bottom',
				title: '...'
			});
		}
	}
};
</script>

<style>
@import url('../../components/watch-login/css/icon.css');
@import url('./css/main.css');
</style>
