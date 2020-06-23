<template>
	<view style="height: 100%;">
		<view class="uni-tab-bar">
			<scroll-view scroll-x="true" class="uni-swiper-tab">
				<view class="swiper-list-box">
					<block v-for="(tabBar, index) in tabBars" :key="index">
						<view class="swiper-tab-list" :class="{ active: tabIndex == index, createOrder: index==3}" @tap="toggleTab(index)">
							{{ tabBar.name }}
							<view class="swiper-tab-line"></view>
						</view>
					</block>
				</view>
			</scroll-view>
		</view>

		<!--内容区-->
		<view class="uni-tab-bar">
			<swiper :current="tabIndex" @change="tabChange" :style="{ height: swiperHeight + 'px' }">
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item"><order-table></order-table></view>
				</swiper-item>
				<swiper-item>
					<view class="swiper-item">
						<view class="container999">
							<view class="title">创建订单</view>
							<view class='line'>
							  <view class='lineLeft'>入离时间</view>
							  <view class="lineRight">
								   <view @click="open">{{dateInfo}}</view>
								      <uni-calendar
								      ref="calendar"
								      :insert="false"
								      :lunar="true"
								      :range="true"
								      @confirm="dateConfirm"
								       />
								   </view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>来源</view>
							  <view class="lineRight">  
								<picker class="pickerClass" mode="selector" :range="origin" :value="nowOrigin" @change="originChange">
									<view>{{origin[nowOrigin]}}</view>
								</picker>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>姓名</view>
							  <view class="lineRight">  
								<!-- data-name为自定义参数名称,同时也会以此为参数名存入data的form中-->
								<input class="input" @input="inputChange" :value="form.name" data-name="name" placeholder-class="plaClass" placeholder='请输入姓名'></input>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>手机号</view>
								<view class="lineRight">  
									<input class="input" type="number" @input="inputChange" :value="form.phone" data-name="phone" placeholder-class="plaClass" placeholder='请输入手机号'></input>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>房型</view>
								<view class="lineRight">  
									<picker class="pickerClass" mode="selector" :range="roomType" :value="nowRoomType" @change="roomTypeChange">
										<view>{{roomType[nowRoomType]}}</view>
									</picker>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>间数</view>
								<view class="lineRight">
									<picker class="pickerClass" mode="selector" :range="roomCount" :value="nowRoomCount" @change="roomCountChange">
										<view>{{roomCount[nowRoomCount]}}</view>
									</picker>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>支付方式</view>
								<view class="lineRight">
									<picker class="pickerClass" mode="selector" :range="payWay" :value="nowPayWay" @change="payWayChange">
										<view>{{payWay[nowPayWay]}}</view>
									</picker>
								</view>
							</view>
							<view class='line'>
							  <view class='lineLeft'>备注</view>
								<view class="lineRight">  
									<input class="input" @input="inputChange" :value="form.remarks" data-name="remarks" placeholder-class="plaClass" placeholder='备注'></input>
									<view class="tips">选填</view>
								</view>
							</view>
							<view class="buttonBox" @click="submit">
								提交
							</view>
						</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
	</view>
</template>

<script>
	const valid = require('../../util/valid.js'); //校验规则文件
	const util = require('../../util/util.js');  //防重点击函数
export default {
	data() {
		return {
			dateInfo: '选择日期',
			tabIndex: 0, //选中标签栏的序列
			contentList: ['待入住', '入住中', '全部', '创建订单'],
			tabBars: [
				{
					name: '待入住',
					id: '1'
				},
				{
					name: '入住中',
					id: '2'
				},
				{
					name: '全部',
					id: '3'
				},
				{
					name: '创建订单',
					id: '4'
				}
			],
			origin:['选择来源','美团','携程','飞猪','去哪'],
			roomType:['选择房型','豪华大床房','智享大床房','豪华双床房'],
			roomCount: ['选择数量','1','2','3','4'],
			payWay: ['选择方式','已支付','到店支付'],
			nowOrigin: 0,
			nowRoomType: 0,
			nowRoomCount: 0,
			nowPayWay: 0,
			swiperHeight: '',
			customItem: '全部', //地址picker的全部功能
			form:{
				region: ['广东省', '广州市', '海珠区'] //默认参数
			}
		};
	},
	mounted(){
		this.setSwiperHeight();
	},
	methods: {
		toggleTab(index) {
			this.tabIndex = index;
		},
		//滑动切换swiper
		tabChange(e) {
			const tabIndex = e.detail.current;
			this.tabIndex = tabIndex;
			this.setSwiperHeight();
		},
		//动态swiper高度
		setSwiperHeight() {
			let query = uni.createSelectorQuery().in(this);
			query.selectAll('.swiper-item').boundingClientRect();
			query.exec(res => {
				this.swiperHeight = res[0][this.tabIndex].height;
			});
		},
		//打开日历
		open(){
		            this.$refs.calendar.open();
		        },
		        dateChange(e) {
		            console.log(e);
		        },
				dateConfirm(e){
		            console.log(e);
				},
				//input change
				originChange(e){
					this.nowOrigin = e.target.value
				},
				roomTypeChange(e){
					this.nowRoomType = e.target.value
				},
				roomCountChange(e){
					this.nowRoomCount = e.target.value
				},
		change(e){
			let name = e.currentTarget.dataset.name;
			let tempVal = e.target.value || e.detail.value;
			if(this.form[name] === undefined){
				console.log('首次添加属性名')
				this.$set(this.form,name,tempVal)
			}else{
				// 若存在则直接赋值
				this.form[name] = tempVal
			}
		},
		// 验证方法
		toVaild(tempList){
			// valid(value,type)为引入的校验方法,49行可见
			return tempList.every((item,index)=>{
				let isVal = this.form[item.paramName]
				if(!isVal || !valid(isVal,item.rules)){
					uni.showModal({
					  title: '错误',
					  content: `${item.failPass}`,
					  showCancel:false
					})
					return false;
				}
				return true;
			})
		},
		// 提交
		submit: util.throttle(function(e) {
			console.log('提交')
			let tempList = [{
				paramName:'name', //data-name和form中的参数名
				failPass:'请输入正确的姓名', //失败的提示
				rules:'name', //校验的规则名称
			},{
				paramName:'phone', //data-name和form中的参数名
				failPass:'请输入正确的手机号', //失败的提示
				rules:'phone', //校验的规则名称
			},{
				paramName:'id', //data-name和form中的参数名
				failPass:'请输入正确的身份证', //失败的提示
				rules:'cardid', //valid中的规则名称
			}]
			if(this.toVaild(tempList)){
				uni.showToast({
					title:'通过'
				})
			}
		}, 1000), //防重点击,1s内只可点击一次
	}
};
</script>

<style lang="scss" scoped>
.swiper-list-box {
	display: flex;
	justify-content: space-around;
	padding: 5px;
	height: 34px;
	line-height: 34px;
}
.swiper-tab-list {
	color: #ffffff;
	width: 177rpx;
	font-size: 14px;
}
.createOrder{
	background-color: #4cd964;
	border-radius: 100px;
}
.uni-tab-bar .active {
	color: #fff;
	font-weight: bold;
}

.active .swiper-tab-line {
	border-bottom: 3px solid #fff;
	width: 80rpx;
	margin: auto;
	border-radius: 10px;
}
.uni-swiper-tab {
	background-color: $uni-color-primary;
}
//创建订单表单
.plaClass{
		color: #dbdbdb;
	}
	.container999{
		.title{
			height: 40px;
			line-height: 40px;
			padding-left: 4%;
			border-bottom: 1px solid #f5f5f5;
		}
		.buttonBox{
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
		.tri{
			width:0;
			height:0;
			border-left:8rpx solid transparent;
			border-right:8rpx solid transparent;
			right: 30rpx !important;
			border-top:16rpx solid #545151;
		}
		.line{
		  margin-top: 15px;
		  height: 50px;
		  width: 92%;
		  margin: 0 auto;
		  border-bottom: 1px solid #f5f5f5;
		  display: flex;
		  .lineRight{
			  .tips{
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
			.lineLeft{
			  display: flex;
			  width: 20%;
			  align-items: center;
			  height: 100%;
			  font-weight: bold;
			  color: #333;
			}
			.input{
				padding-right: 20rpx;
				height: 100%;
				width: 70%;
				text-align: left;
				font-size: 14px;
				color: #545151;
			}
			.picker{
			 height: 100%;
			 justify-content: flex-start;
			  display: flex;
			  align-content: center;
			  width: 500rpx;
			}
			picker{
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
