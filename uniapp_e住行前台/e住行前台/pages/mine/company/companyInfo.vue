<template>
	<view>
		<uni-list style="text-align: left;">
			<!-- <uni-list-item
				style="font-weight: 600;"
				title="301"
				@switchChange="usingRoom"
				:switchChecked="isUsing"
				showSwitch="true"
				:showArrow="false"
				thumb="/static/icon/logo.png"
			/> -->
			<view class="listBox">
				<view class="listItem">
					<view class="leftItem">公司名称</view>
					<input class="iptClass" type="text" placeholder="在此输入公司名称" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">地址</view>
					<input class="iptClass" type="text" placeholder="在此输入地址" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">联系人</view>
					<input class="iptClass" type="text" placeholder="在此输入联系人" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem">
					<view class="leftItem">电话</view>
					<input class="iptClass" type="number" placeholder="在此输入联系电话" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem" v-if="companyId">
					<view class="leftItem">签约时间</view>
					<input class="iptClass" type="text" placeholder="签约时间" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem" v-if="companyId">
					<view class="leftItem">订房数</view>
					<input class="iptClass" type="text" placeholder="订房数" placeholder-class="iptPla" value="" />
				</view>
				<view class="listItem" v-if="companyId">
					<view class="leftItem">状态</view>
				</view>
				<view class="listItem" v-if="companyId">
					<view class="leftItem">链接</view>
					<input class="iptClass" type="text" placeholder="链接" placeholder-class="iptPla" value="" />
				</view>
			</view>
		</uni-list>
		<image class="qrClass" mode="widthFix" src="https://img-cdn-qiniu.dcloud.net.cn/uniapp/images/shuijiao.jpg" @error="imageError"></image>
		<button class="addType" hover-class="addTypeHover">确 定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyId: '' //公司Id
		};
	},
	onLoad(option) {
		let that = this;
		if (option.id) {
			that.companyId = option.id;
		}
		console.log(that.companyId);
	}
};
</script>

<style lang="scss">
.companyInfo {
	background-color: #f4f4f4;
}
.title {
	font-weight: bold;
	font-size: 16px;
	line-height: 30px;
	text-align: left;
}
.uni-input {
	background-color: #fff;
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
.qrClass {
	width: 500rpx;
	margin-top: 20px;
}
.addType {
	transition: all 0.1s;
	background-color: $uni-color-success;
	color: #ffffff;
	width: 650rpx;
	font-size: 16px;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 10px;
}
</style>
