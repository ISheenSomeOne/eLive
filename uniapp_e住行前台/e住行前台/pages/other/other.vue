<template>
	<view>
		<view class="example-body">
			<uni-card
				:isShadow="true"
				title="酒店名称"
				subTitle="姓名"
				mode="title"
				thumbnail="/static/icon/logo.png"
				extra="权限名称"
				note="true"
				@click="clickCard"
			>
				<view>
					<view class="image-box"><image class="image" mode="aspectFill" src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg" /></view>
					<view class="content-box"><text class="content-box-text">标题卡片带有一个双标题头部，右侧为额外描述信息 ，内容可自定义实现</text></view>
				</view>
				<template slot="footer">
					<view class="footer-box">
						<view @click.stop="footerClick('喜欢')"><text class="footer-box__item">喜欢</text></view>
						<view @click.stop="footerClick('评论')"><text class="footer-box__item">评论</text></view>
						<view @click.stop="footerClick('分享')"><text class="footer-box__item">分享</text></view>
					</view>
				</template>
			</uni-card>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {};
	},
	methods: {}
};
</script>

<style></style>
