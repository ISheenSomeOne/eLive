<template>
	<view>
		<view class="container999">
			<view class="line">
				<view class="lineLeft">编号</view>
				<view class="lineRight">
					<input class="input" v-model="form.numbering" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入车辆编号" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">车牌号</view>
				<view class="lineRight">
					<input class="input" v-model="form.carNumber" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入车牌号" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">司机</view>
				<view class="lineRight">
					<input class="input" v-model="form.driver" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入司机姓名" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">联系方式</view>
				<view class="lineRight">
					<input class="input" v-model="form.contact" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入联系方式" />
				</view>
			</view>
			<view class="line">
				<view class="lineLeft">核载人数</view>
				<view class="lineRight">
					<input class="input" v-model="form.peopleNum" data-name="examSiteLatitude" placeholder-class="plaClass" placeholder="请输入车辆核载人数" />
				</view>
			</view>
		</view>
		<view class="buttonBox" v-show="showAdd" @click="addCarInfo">创建订单</view>
		<view class="bottomMenu" v-show="!showAdd"><uni-goods-nav :fill="true" :options="options" :button-group="buttonGroup" @buttonClick="buttonClick" /></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			carId: '',
			showAdd: true,
			form: {
				numbering: '',
				carNumber: '',
				driver: '',
				contact: '',
				peopleNum: ''
			},
			options: [],
			buttonGroup: [
				{
					text: '删除车辆',
					backgroundColor: '#dd524d',
					color: '#fff'
				},
				{
					text: '确定修改',
					backgroundColor: '#4cd964',
					color: '#fff'
				}
			]
		};
	},
	computed:{
		// eduCarInfo() {
		// 	return this.$store.state.edu.eduCarInfo;
		// },
	},
	onLoad(options) {
		if(options.examId != '' && options.examId != undefined && options.examId != null){
			this.examId = options.examId
		}
		if(options.carId != '' && options.carId != undefined && options.carId != null){
			this.carId = options.cardId
			this.showAdd = false
			this.$store.commit('req_getCarInfo', this.carId);
			this.form = this.$store.state.edu.eduCarInfo
		}
	},
	methods:{
		//下方按钮事件
		buttonClick(e) {
			//点击删除车辆
			if (e.index == 0) {
				this.$store.commit('req_delEduCar', this.carId);
			}
			//点击确定修改
			if (e.index == 1) {
				this.$store.commit('req_updateCarInfo', this.form);
			}
		},
		//添加车辆
		addCarInfo() {
			let val = {examId: this.examId, form: this.form}
			this.$store.commit('req_addCarInfo', val);
		},
	}
};
</script>

<style lang="scss" scoped>
.bottomMenu {
	/* #ifndef APP-NVUE */
	display: flex;
	/* #endif */
	flex-direction: column;
	position: fixed;
	left: 0;
	right: 0;
	bottom: 10px;
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
</style>
