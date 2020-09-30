<template>
	<view>
		<view style="margin-bottom: 60px;"><order-table :listType="'eduAddUserList'" :titleList="titleList" :tableList="eduAddUserList"></order-table></view>
		<view class="buttonBoxAdd" @click="comfirm">确定</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			titleList: [
				{ cont: '选择', width: 'short' },
				{ cont: '姓名', width: 'short' },
				{ cont: '性别', width: 'short' },
				{ cont: '车辆', width: 'short' },
				{ cont: '出发点', width: 'normal' },
				{ cont: '酒店房间', width: 'long' },
				{ cont: '考点', width: 'normal' }
			],
			eduAddUserList: [
				{
					memberId: '123',
					memberName: '张三',
					sex: '男',
					car: '1号车',
					startingName: 'xxxxx学校',
					hotelRoom: '春田惠谷酒店-201',
					examSite: 'xxxxx学校'
				},
				{
					memberId: '123',
					memberName: '张三',
					sex: '男',
					car: '1号车',
					startingName: 'xxxxx学校',
					hotelRoom: '春田惠谷酒店-201',
					examSite: 'xxxxx学校'
				},
				{
					memberId: '123',
					memberName: '张三',
					sex: '男',
					car: '1号车',
					startingName: 'xxxxx学校',
					hotelRoom: '春田惠谷酒店-201',
					examSite: 'xxxxx学校'
				}
			]
		};
	}
};
</script>

<style lang="scss" scoped>
.buttonBoxAdd {
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
</style>
