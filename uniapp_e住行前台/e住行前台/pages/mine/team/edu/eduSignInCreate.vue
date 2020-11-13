<template>
	<view class="eduSignInCreate">
		<uni-section class="titleClass" title="选择出发地" type="line"></uni-section>
		<radio-group class="place" @change="startChange">
			<label class="radio">
				<radio value="1" checked="true" />
				出发点
			</label>
			<label class="radio">
				<radio value="2" />
				酒店
			</label>
			<label class="radio">
				<radio value="3" />
				考点
			</label>
		</radio-group>
		<uni-section class="titleClass" title="选择目的地" type="line"></uni-section>
		<radio-group class="place" @change="endChange">
			<label class="radio">
				<radio value="1" checked="true" />
				出发点
			</label>
			<label class="radio">
				<radio value="2" />
				酒店
			</label>
			<label class="radio">
				<radio value="3" />
				考点
			</label>
		</radio-group>
		<view class="buttonBox" @click="submit">创建签到</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			examId: '',
			startingPoint: 1, //出发点
			targetLocation: 1 //目的地
		};
	},
	computed: {
		navigateBack() {
			return this.$store.state.edu.navigateBack;
		}
	},
	watch: {
		navigateBack(newData, oldData) {
			let that = this;
			if (newData) {
				this.$store.commit('setNeedNavigateBack');
				uni.navigateBack({
					delta: 1
				});
			}
		},
	},
	onLoad(options) {
		let that = this;
		if (options.examId != '' && options.examId != 'undefined' && options.examId != null) {
			that.examId = options.examId;
		}
	},
	methods: {
		startChange(e) {
			this.startingPoint = e.target.value;
		},
		endChange(e) {
			this.targetLocation = e.target.value;
		},
		submit() {
			let that = this;
			if (that.startingPoint == that.targetLocation) {
				uni.showToast({
					icon: 'none',
					title: '出发地和目的地不能相同',
					duration: 2500
				});
			} else {
				uni.showModal({
					title: '提示',
					content: '确定创建签到吗',
					success: function(res) {
						if (res.confirm) {
							let val = { examId: that.examId, startingPoint: that.startingPoint, targetLocation: that.targetLocation };
							that.$store.commit('req_addNewCheckin', val);
						} else if (res.cancel) {
						}
					}
				});
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.place {
	height: 50px;
	line-height: 50px;
	margin: 10px 0;
	width: 100%;
	display: flex;
	justify-content: space-around;
}
.placeItem {
	height: 33px;
	line-height: 33px;
	width: 180rpx;
	font-size: 13px;
	border-radius: 4px;
	border: #777 solid 1px;
	color: #777;
}
.active {
	border: $uni-color-primary solid 1px;
	background-color: $uni-color-primary;
	color: #fff;
}
.titleClass {
	margin-top: 0;
	text-align: left;
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
	bottom: 20px;
	left: 0;
	right: 0;
	background-color: #4cd964;
}
</style>
