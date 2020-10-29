<template>
	<view>
		<view class="container999">
			<uni-section class="titleClass" title="考试信息" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">名称</view>
				<view class="lineRight"><input class="input" v-model="form.examName" placeholder-class="plaClass" placeholder="请输入考试名称" /></view>
			</view>
			<view class="line">
				<view class="lineLeft">考试日期</view>
				<view class="lineRight">
					<picker mode="date" :value="form.examStartDate" @change="examStartDateChange">
						<view class="uni-input">{{ form.examStartDate }}</view>
					</picker>
					<picker mode="date" :value="form.examEndDate" @change="examEndDateChange">
						<view class="uni-input">{{ form.examEndDate }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">报名截止</view>
				<view class="lineRight">
					<picker mode="date" :value="form.deadline" @change="deadlineChange">
						<view class="uni-input">{{ form.deadline }}</view>
					</picker>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">网站链接</view>
				<view class="lineRight">
					<input class="input" v-model="form.examLink" placeholder-class="plaClass" placeholder="请输入考试网站链接" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">考试说明</view>
				<view class="lineRight">
					<textarea class="input" v-model="form.examDirections" placeholder-class="plaClass" placeholder="请输入考试网站说明" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">负责人</view>
				<view class="lineRight"><input class="input" v-model="form.principal" placeholder-class="plaClass" placeholder="请输入负责人" /></view>
			</view>
			<view class="line">
				<view class="lineLeft">联系方式</view>
				<view class="lineRight"><input class="input" v-model="form.contact" placeholder-class="plaClass" placeholder="请输入负责人联系方式" /></view>
			</view>
			<view class="line">
				<view class="lineLeft">人数</view>
				<view class="lineRight">
					<input class="input" type="number" v-model="form.peopleNum" placeholder-class="plaClass" placeholder="请输入参加人数" />
					<view class="tips">选填</view>
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">备注</view>
				<view class="lineRight">
					<textarea class="input" v-model="form.remarks" placeholder-class="plaClass" placeholder="请输入备注" />
					<view class="tips">选填</view>
				</view>
			</view>

			<uni-section class="titleClass" title="支付信息" type="line"></uni-section>
			<view class="line">
				<view class="lineLeft">支付方式</view>
				<view class="lineRight">
					<picker class="pickerClass" mode="selector" :range="payWay" :value="nowPayWay" @change="payWayChange">
						<view>{{ payWay[nowPayWay] }}</view>
					</picker>
				</view>
			</view>
			<view class="line" v-if="form.payWay == 1 || form.payWay == 3">
				<view class="lineLeft">服务类型</view>
				<view class="lineRight">
					<picker class="pickerClass" mode="selector" :range="serviceType" :value="nowServiceType" @change="serviceTypeChange">
						<view>{{ serviceType[nowServiceType] }}</view>
					</picker>
				</view>
			</view>
			<view class="line" v-if="nowServiceType != 3 && form.payWay != 0">
				<view class="lineLeft">入离时间</view>
				<view class="lineRight">
					<picker mode="date" :value="form.checkinDate" @change="checkinDateChange">
						<view class="uni-input">{{ form.checkinDate }}</view>
					</picker>
					<picker mode="date" :value="form.checkoutDate" @change="checkoutDateChange">
						<view class="uni-input">{{ form.checkoutDate }}</view>
					</picker>
				</view>
			</view>
			<view class="line" v-if="form.payWay == 1 || form.payWay == 3">
				<view class="lineLeft">支付金额</view>
				<view class="lineRight"><input class="input" type="digit" v-model="form.allFee" placeholder-class="plaClass" placeholder="请输入支付金额" /></view>
			</view>
			<view class="line" v-if="form.payWay == 2">
				<view class="lineLeft">房费</view>
				<view class="lineRight"><input class="input" type="digit" v-model="form.roomFee" placeholder-class="plaClass" placeholder="请输入金额" /></view>
			</view>
			<view class="line" v-if="form.payWay == 2">
				<view class="lineLeft">其他费用</view>
				<view class="lineRight"><input class="input" type="digit" v-model="form.otherFee" placeholder-class="plaClass" placeholder="请输入金额" /></view>
			</view>

			<block v-if="nowServiceType != 2 && form.payWay != 0">
				<uni-section class="titleClass" title="考点信息" type="line"></uni-section>
				<view class="line">
					<view class="lineLeft">考点数量</view>
					<view class="lineRight">
						<uni-number-box @change="examSiteNumChange" :value="examSiteNum" :min="1" />
						<!-- <input class="input" @change="examSiteNumChange" :value="examSiteNum" type="number" placeholder-class="plaClass" placeholder="请输入考点数量" /> -->
					</view>
				</view>

				<!-- 考点列表 -->
				<block v-for="(item, index) in Number(examSiteNum)" :key="index">
					<view class="line">
						<view class="lineLeft">考点{{ item }}</view>
						<view class="lineRight">
							<input
								class="input"
								@input="examSiteChange($event, 0, index)"
								:value="form.examSiteList[index].name"
								placeholder-class="plaClass"
								placeholder="请输入考点名称"
							/>
						</view>
					</view>
					<view class="line">
						<view class="lineLeft">经纬度</view>
						<view class="lineRight">
							<input
								class="input"
								@input="examSiteChange($event, 1, index)"
								:value="form.examSiteList[index].longitude"
								placeholder-class="plaClass"
								placeholder="请输入经度"
							/>
							<input
								class="input"
								@input="examSiteChange($event, 2, index)"
								:value="form.examSiteList[index].latitude"
								placeholder-class="plaClass"
								placeholder="请输入纬度"
							/>
							<view class="tips">选填</view>
						</view>
					</view>
				</block>
				<uni-section class="titleClass" title="起点信息" type="line"></uni-section>
				<view class="line">
					<view class="lineLeft">起点数量</view>
					<view class="lineRight">
						<uni-number-box @change="startingNumChange" :value="startingNum" :min="1" />
						<!-- <input class="input" @input="startingNumChange" type="number" v-model="startingNum" placeholder-class="plaClass" placeholder="请输入起点数量" /> -->
					</view>
				</view>

				<!-- 起点列表 -->
				<block>
					<view v-for="(item, index) in Number(startingNum)" :key="index">
						<view class="line">
							<view class="lineLeft">起点{{ item }}</view>
							<view class="lineRight">
								<input
									class="input"
									@input="startingChange($event, 0, index)"
									:value="form.startingList[index].name"
									placeholder-class="plaClass"
									placeholder="请输入起点名称"
								/>
							</view>
						</view>
						<view class="line">
							<view class="lineLeft">出发时间</view>
							<view class="lineRight">
								<picker mode="date" :value="form.startingList[index].startingDate" @change="startingChange($event, 1, index)">
									<view class="uni-input">{{ form.startingList[index].startingDate }}</view>
								</picker>
								<picker mode="time" :value="form.startingList[index].startingTime" @change="startingChange($event, 2, index)">
									<view class="uni-input">{{ form.startingList[index].startingTime }}</view>
								</picker>
							</view>
						</view>
						<view class="line">
							<view class="lineLeft">经纬度</view>
							<view class="lineRight">
								<input
									class="input"
									@input="startingChange($event, 3, index)"
									:value="form.startingList[index].longitude"
									placeholder-class="plaClass"
									placeholder="请输入经度"
								/>
								<input
									class="input"
									@input="startingChange($event, 4, index)"
									:value="form.startingList[index].latitude"
									placeholder-class="plaClass"
									placeholder="请输入纬度"
								/>
								<view class="tips">选填</view>
							</view>
						</view>
					</view>
				</block>
			</block>
			<view class="buttonBox" @click="submit">创建订单</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			nowPayWay: 0,
			payWay: ['选择支付方式', '统一支付', '学生支付', '已支付'],
			examSiteNum: 1,
			startingNum: 1,
			form: {
				examName: '', //考试名称
				examStartDate: '选择开始日期', //考试开始
				examEndDate: '选择结束日期', //考试结束
				deadline: '选择报名截止日期（当日24点）', //报名截止
				examLink: '', //报名链接
				examDirections: '', //考试说明
				examSiteList: [
					{
						name: '',
						longitude: '',
						latitude: ''
					}
				], //考点列表
				startingList: [
					{
						name: '',
						startingDate: '选择出发日期',
						startingTime: '选择出发时间',
						longitude: '',
						latitude: ''
					}
				], //起点列表
				checkinDate: '选择入住日期', //入住日期
				checkoutDate: '选择离店日期', //入住日期
				payWay: '', //支付方式
				serviceType: '', //服务类型
				principal: '', //负责人
				contact: '', //联系方式
				allFee: '', //需付金额
				roomFee: '', //房费
				otherFee: '', // 其他费用
				peopleNum: '', // 人数
				remarks: '' //备注
			},
			nowServiceType: 0, //服务类型下标
			serviceType: ['选择服务类型', '住宿及接送', '仅住宿', '仅接送'] //服务类型
		};
	},
	computed: {
		// createExam() {
		// 	return this.$store.state.edu.createExam;
		// },
	},
	onLoad() {
		// this.form = JSON.stringify(this.form)
		// JSON.parse(this.form)
	},
	methods: {
		//考点数量改变，改变数据结构
		examSiteNumChange: function(value) {
			let that = this;
			let item = {
				name: '',
				longitude: '',
				latitude: ''
			};
			if (that.examSiteNum < value) {
				that.examSiteNum = value;
				that.form.examSiteList.push(item);
			} else if (that.examSiteNum > value) {
				that.examSiteNum = value;
				that.form.examSiteList.pop();
			}
		},
		//输入考点信息
		examSiteChange: function(e, prop, index) {
			let val = e.detail.value;
			let list = JSON.parse(JSON.stringify(this.form.examSiteList));
			switch (prop) {
				case 0:
					list[index].name = val;
					break;
				case 1:
					list[index].longitude = val;
					break;
				case 2:
					list[index].latitude = val;
					break;
			}
			this.form.examSiteList = list;
		},
		//起点数量改变，改变数据结构
		startingNumChange: function(value) {
			let that = this;
			let item = {
				name: '',
				startingDate: '选择出发日期',
				startingTime: '选择出发时间',
				longitude: '',
				latitude: ''
			};
			if (that.startingNum < value) {
				that.startingNum = value;
				that.form.startingList.push(item);
			} else if (that.startingNum > value) {
				that.startingNum = value;
				that.form.startingList.pop();
			}
		},
		//输入起点信息
		startingChange: function(e, prop, index) {
			let val = e.detail.value;
			let list = JSON.parse(JSON.stringify(this.form.startingList));
			switch (prop) {
				case 0:
					list[index].name = val;
					break;
				case 1:
					list[index].startingDate = val;
					break;
				case 2:
					list[index].startingTime = val;
					break;
				case 3:
					list[index].longitude = val;
					break;
				case 4:
					list[index].latitude = val;
					break;
			}
			this.form.startingList = list;
		},
		//考试开始日期
		examStartDateChange: function(e) {
			this.form.examStartDate = e.target.value;
		},
		//考试结束日期
		examEndDateChange: function(e) {
			this.form.examEndDate = e.target.value;
		},
		//报名截止日期
		deadlineChange: function(e) {
			this.form.deadline = e.target.value;
		},
		//入住日期
		checkinDateChange: function(e) {
			this.form.checkinDate = e.target.value;
		},
		//离店日期
		checkoutDateChange: function(e) {
			this.form.checkoutDate = e.target.value;
		},
		// 支付方式
		payWayChange(e) {
			this.nowPayWay = e.detail.value;
			this.form.payWay = this.nowPayWay;
			this.form.allFee = '';
			this.form.roomFee = '';
			this.form.otherFee = '';
		},
		//
		serviceTypeChange(e) {
			this.nowServiceType = e.detail.value;
			this.form.serviceType = this.nowServiceType;
		},
		submit: function() {
			let that = this;
			if (that.formValidation()) {
				that.$store.dispatch('createExam', that.form);
			}
			// if (true) {
			// 	that.$store.dispatch('createExam', that.form);
			// }
		},
		//表单验证
		formValidation: function() {
			let that = this;
			let data = this.form;
			if (data.examName == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入考试名称'
				});
				return false;
			} else if (data.examStartDate == '选择开始日期') {
				uni.showToast({
					icon: 'none',
					title: '请选择开始日期'
				});
				return false;
			} else if (data.examEndDate == '选择结束日期') {
				uni.showToast({
					icon: 'none',
					title: '请选择结束日期'
				});
				return false;
			} else if (data.deadline == '选择报名截止日期（当日24点）') {
				uni.showToast({
					icon: 'none',
					title: '请选择报名截止日期'
				});
				return false;
			} else if (data.payWay == 0) {
				uni.showToast({
					icon: 'none',
					title: '请选择支付方式'
				});
				return false;
			} else if ((data.payWay == 1 || data.payWay == 3) && data.serviceType == 0) {
				uni.showToast({
					icon: 'none',
					title: '请选择服务类型'
				});
				return false;
			} else if (that.nowServiceType != 3 && data.payWay != 0) {
				if (data.checkinDate == '选择入住日期') {
					uni.showToast({
						icon: 'none',
						title: '请选择入住日期'
					});
					return false;
				} else if (data.checkoutDate == '选择离店日期') {
					uni.showToast({
						icon: 'none',
						title: '请选择离店日期'
					});
					return false;
				}
			} else if (data.principal == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入负责人'
				});
				return false;
			} else if (data.contact == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入联系方式'
				});
				return false;
			} else if ((data.payWay == 1 || data.payWay == 3) && data.allFee == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入支付金额'
				});
				return false;
			} else if (data.payWay == 2 && data.roomFee == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入房费'
				});
				return false;
			} else if (data.payWay == 2 && data.otherFee == '') {
				uni.showToast({
					icon: 'none',
					title: '请输入其他费用'
				});
				return false;
			} else if (that.nowServiceType == 2) {
				for (let i = 0; i < data.examSiteList.length; i++) {
					if (data.examSiteList[i].name == '') {
						uni.showToast({
							icon: 'none',
							title: '请填写考点名称'
						});
						return false;
					}
				}
				for (let i = 0; i < data.startingList.length; i++) {
					if (data.startingList[i].name == '' || data.startingList[i].startingDate == '选择出发日期' || data.startingList[i].startingTime == '选择出发时间') {
						uni.showToast({
							icon: 'none',
							title: '请完善起点信息'
						});
						return false;
					}
				}
			}
			return true;
		}
	}
};
</script>

<style lang="scss">
//创建订单表单
.plaClass {
	color: #cfcfcf;
	line-height: 50px;
}
.container999 {
	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 4%;
		border-bottom: 1px solid #f5f5f5;
	}
	.buttonBox {
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
	min-height: 75vh;
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
.titleClass {
	height: 40px;
}
</style>
