<template>
	<view class="home">
		<u-navbar :is-back="false" title="" height="60" bg-color="#fafafa">
			<view slot="left">
				<image class="title-logo" src="../../static/login_logo.png"></image>
			</view>
			<view slot="center" class="title-text">
				首页
			</view>
		</u-navbar>
		
		<view class="main">
			<view class="card" @click="cardClickHandler('clock')">
				<view class="card-title">
					{{$t('home.clockInOut')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('schedule')">
				<view class="card-title">
					{{$t('home.mySchedule')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('leaveApplication')">
				<view class="card-title">
					{{$t('home.leaveApplication')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('otApplication')">
				<view class="card-title">
					{{$t('home.otApplication')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('reClock')">
				<view class="card-title">
					{{$t('home.reClock')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('approval')">
				<view class="card-title">
					{{$t('home.myApproval')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
			};
		},
		
		mounted() {
		},
		
		methods: {
			async cardClickHandler(type) {
				// const params = {
				// 	'X-Lang': 'en_US',
				// 	'X-Time-Zone': 'Timezone',
				// };
				// const reuslt = await uni.$u.http.post('/api/user/queryDetail',params, {
    //                 header: {
    //                     'content-type': 'application/x-www-form-urlencoded'
    //                 },
				// });
				// console.log(789, result);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-logo {
		width: 70rpx;
		height: 70rpx;
	}
	.title-text {
		font-weight: bold;
		font-size: 36rpx;
	}
	.main {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
		padding: 30rpx 50rpx;
		padding-top: 180rpx;
	}
	.card {
		width: 300rpx;
		height: 200rpx;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 15rpx 5rpx #eeeeee;
		font-size: 28rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 0;
		margin: 40rpx 0;
	}
</style>