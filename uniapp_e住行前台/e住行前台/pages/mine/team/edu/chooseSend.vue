<template>
	<view>
		<view style="background-color: #fff;padding-bottom: 10px;">
			<view class="container999">
			<checkbox-group @change="allChoose">
				<view class="line">
					<view class="lineLeft">
						<checkbox value="all" :class="{ checked: allChecked }" :checked="allChecked ? true : false"></checkbox>
					</view>
					<view class="lineRight">
						全选
					</view>
				</view>
			</checkbox-group>
				<checkbox-group @change="changeCheckbox">
					<view class="line" v-for="(item, index) in orderDistributionList" :key="index">
						<view class="lineLeft">
							<checkbox
								:value="item.id"
								:checked="checkedArr.includes(item.id)"
								:class="{ checked: checkedArr.includes(item.id) }"
							></checkbox>
						</view>
						<view class="lineRight">
							<text>{{ item.numbering }}</text>
							<text>{{ item.peopleNum }}</text>
						</view>
					</view>
				</checkbox-group>
			</view>
			<view class="sendButton" @click="confirm">确定</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			checkedArr: [], //复选框选中的值
			allChecked: false,
			orderDistributionList: [
				{
					id: '1',
					numbering: '1号车',
					carNumber: '云A 12345',
					driver: '张三',
					peopleNum: '40/40'
				},
				{
					id: '2',
					numbering: '2号车',
					carNumber: '云A 54321',
					driver: '李四',
					peopleNum: '40/40'
				},
				{
					id: '3',
					numbering: '3号车',
					carNumber: '云A 23123',
					driver: '王五',
					peopleNum: '0/40'
				}
			]
		};
	},
	methods: {
		// 多选复选框改变事件
		changeCheckbox(e) {
			this.checkedArr = e.detail.value;
			// 如果选择的数组中有值，并且长度等于列表的长度，就是全选
			if (this.checkedArr.length > 0 && this.checkedArr.length == this.orderDistributionList.length) {
				this.allChecked = true;
			} else {
				this.allChecked = false;
			}
			// console.log(this.checkedArr)
		},
		// 全选事件
		allChoose(e) {
			let chooseItem = e.detail.value;
			// 全选
			if (chooseItem[0] == 'all') {
				this.allChecked = true;
				for (let item of this.orderDistributionList) {
					let itemVal = String(item.id);
					if (!this.checkedArr.includes(itemVal)) {
						this.checkedArr.push(itemVal);
					}
				}
			} else {
				// 取消全选
				this.allChecked = false;
				this.checkedArr = [];
			}
		},
		confirm(){
			uni.navigateTo({
				url: 'editSend'
			});
		}
	}
};
</script>

<style lang="scss" scoped>
.sendButton {
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
.container999 {
	.title {
		height: 40px;
		line-height: 40px;
		padding-left: 4%;
		border-bottom: 1px solid #f5f5f5;
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
	color: #6b8082;
	position: relative;
	margin: 0 auto;
	padding-bottom: 60px;
}
</style>
