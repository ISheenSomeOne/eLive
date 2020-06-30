<script>
export default {
	onLaunch: function() {
		// console.log('App Launch');
	},
	onShow: function() {
		this.$store.commit('initUserInfo');
	},
	onHide: function() {
		// console.log('App Hide');
	}
};
</script>

<style>
/* 解决头条小程序组件内引入字体不生效的问题 */
/* #ifdef MP-TOUTIAO */
@font-face {
	font-family: uniicons;
	src: url('/static/uni.ttf');
}
/* #endif */

html {
	/* max-width: 1300px; */
	text-align: center;
	margin: 0 auto;
}
.clearfix::before,
.clearfix::after {
	content: '';
	display: table;
}
.clearfix::after {
	clear: both;
}
.clearfix {
	*zoom: 1;
}
.uni-swiper{
	min-height: 80vh;
}
</style>
