<template>
	<view>
		<uni-list style="text-align: left;">
			<uni-list-item
				v-if="companyId"
				style="font-weight: 600;"
				title="签约状态"
				@switchChange="stateChange"
				:switchChecked="companyData.state == true"
				showSwitch="true"
				:showArrow="false"
				thumb="/static/icon/logo.png"
			/>
			<view class="listBox">
				<view class="listItem">
					<view class="leftItem">公司名称</view>
					<input class="iptClass" type="text" placeholder="在此输入公司名称" placeholder-class="iptPla" v-model="companyData.companyName" @input="dataChange" />
				</view>
				<view class="listItem">
					<view class="leftItem">地址</view>
					<input class="iptClass" type="text" placeholder="在此输入地址" placeholder-class="iptPla" v-model="companyData.companyAdd" @input="dataChange" />
				</view>
				<view class="listItem">
					<view class="leftItem">联系人</view>
					<input class="iptClass" type="text" placeholder="在此输入联系人" placeholder-class="iptPla" v-model="companyData.linkman" @input="dataChange" />
				</view>
				<view class="listItem">
					<view class="leftItem">联系方式</view>
					<input class="iptClass" type="text" placeholder="在此输入联系方式" placeholder-class="iptPla" v-model="companyData.tel" @input="dataChange" />
				</view>
				<!-- <view class="listItem" @click="choosePic">
					<view class="leftItem">营业执照</view>
					<input class="iptClass" v-show="companyData.img == ''" disabled="true" type="text" placeholder="选择照片" placeholder-class="iptPla" />
					<image class="licenseClass" v-show="companyData.img != ''" :src="companyData.img" mode="aspectFit"></image>
				</view> -->
				<view class="listItem" v-if="companyId">
					<view class="leftItem">订房数</view>
					<input class="iptClass" type="text" placeholder="订房数" placeholder-class="iptPla" :value="companyData.orderCount" />
				</view>
				<view class="listItem" v-if="companyId">
					<view class="leftItem">链接</view>
					<input class="iptClass" type="text" placeholder="链接" placeholder-class="iptPla" :value="companyData.link" />
				</view>
			</view>
		</uni-list>
		<image v-if="companyId" class="qrClass" mode="widthFix" :src="companyData.qr"></image>
		<button class="addType" hover-class="addTypeHover" @click="comfirm">确 定</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			companyData: {
				companyName: '',
				companyAdd: '',
				linkman: '',
				tel: '',
				img: '',
				createTime: '',
				orderCount: '',
				link: '',
				state: 1,
				qr: ''
			} //创建公司数据
		};
	},
	computed: {
		companyId() {
			return this.$store.state.company.companyId;
		}
		// companyData: {
		// 	get() {
		// 		return this.$store.state.company.companyData;
		// 	},
		// 	set(val) {
		// 		this.$store.commit('setCompanyData', val);
		// 	}
		// },
	},
	onLoad(option) {
		if (option.id) {
			this.$store.commit('setCompanyId', option.id);
			this.$store.commit('req_initCompanyInfo');
			const companyData = this.$store.state.company.companyInfo;
			this.companyData = companyData;
		}
	},
	onUnload() {
		this.$store.commit('delCompanyId');
	},
	onShow() {},
	methods: {
		dataChange: function() {
			this.$store.commit('setCompanyData', this.companyData);
		},
		comfirm: function() {
			if (this.$store.state.company.companyId) {
				this.$store.dispatch('updateCompany');
			} else {
				this.$store.dispatch('createCompany');
			}
		},
		choosePic: function() {
			let that = this;
			uni.chooseImage({
				count: 1, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				success: function(res) {
					console.log(res);
					let img = res.tempFilePaths[0];
					// console.log(img)
					that.companyData.license = img;
					that.dataChange();
				}
			});
		},
		stateChange(e) {
			e.value ? (this.companyData.state = 1) : (this.companyData.state = 0);
			this.dataChange();
		}
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
	width: 64px;
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
	width: 400rpx;
	margin-top: 20px;
	margin-bottom: 55px;
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
.licenseClass {
	margin-left: 15px;
	margin-top: 3px;
	height: 34px;
	width: 34px;
}
</style>
