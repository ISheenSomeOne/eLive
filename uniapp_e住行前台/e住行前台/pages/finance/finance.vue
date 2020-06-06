<template>
	<view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			open(){
			            this.$refs.calendar.open();
			        },
			        confirm(e) {
			            console.log(e);
			        }
		}
	}
</script>

<style>

</style>
