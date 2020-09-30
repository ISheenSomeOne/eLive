<template>
	<view class="eduList">
		<view class="swiper-item">
			<order-table :listType="'eduList'" :titleList="titleList" :tableList="eduList"></order-table>
			<button v-show="true" class="more-btn" @click="getMore" size="mini" type="default">查看更多···</button>
		</view>
		<navigator url="createExam">
		<button class="addType" hover-class="addTypeHover">创建订单</button>
		</navigator>
	</view>
</template>

<script>
export default {
	data() {
		return {
			titleList:[
				{'cont':'名 称','width': 'long' },
				{'cont':'负责人','width': 'short' },
				{'cont':'电 话','width': 'normal' },
				{'cont':'考试时间','width': 'normal' },
				{'cont':'状态','width': 'short' },
			]
		};
	},
	computed:{
		eduList() {
			return this.$store.state.edu.eduList;
		},
	},
	onLoad() {
			that.$store.commit('resetEduList')
			that.$store.commit('req_getEduList')
	},
	methods:{
		getMore(){
			that.$store.commit('req_getEduList')
		}
	}
};
</script>

<style lang="scss">
	.eduList{
		padding-bottom: 50px;
	}
	.addType{
		transition: all 0.1s;
		background-color: $uni-color-success;
		color: #FFFFFF;
		width: 650rpx;
		font-size: 16px;
			position: fixed;
			left: 0;
			right: 0;
			bottom: 10px;
	}
	.addTypeHover{
		background-color: #3eb352;
	}
	.more-btn{
		width: 500rpx;
	}
</style>
