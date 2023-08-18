<template>
	<view class="home">
		<u-navbar :is-back="false" title="" height="60" bg-color="#fafafa">
			<view slot="left">
				<image class="title-logo" src="../../static/login_logo.png"></image>
			</view>
			<view slot="center" class="title-text">
				{{$t('home.title')}}
			</view>
			<view slot="right">
				<image class="saomiao-logo" src="../../static/saomiao.png"></image>
			</view>
		</u-navbar>
		
		<view class="main">
			<view class="card" @click="cardClickHandler('clock')">
				<image class="label-img" src="../../static/home_clock.png"></image>
				<view class="card-title">
					{{$t('home.clockInOut')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('schedule')">
				<image class="label-img" src="../../static/home_schedule.png"></image>
				<view class="card-title">
					{{$t('home.mySchedule')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('leaveApplication')">
				<image class="label-img" src="../../static/home_leave.png"></image>
				<view class="card-title">
					{{$t('home.leaveApplication')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('otApplication')">
				<image class="label-img" src="../../static/home_ot.png"></image>
				<view class="card-title">
					{{$t('home.otApplication')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('reClock')">
				<image class="label-img" src="../../static/home_reclock.png"></image>
				<view class="card-title">
					{{$t('home.reClock')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('manual')">
				<image class="label-img" src="../../static/home_manual.png"></image>
				<view class="card-title">
					{{$t('home.manualClock1')}}
				</view>
				<view class="card-title">
					{{$t('home.manualClock2')}}
				</view>
			</view>
			
			<view class="card" @click="cardClickHandler('approval')">
				<image class="label-img" src="../../static/home_approval.png"></image>
				<view class="card-title">
					{{$t('home.myApproval')}}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex';
	export default {
		data() {
			return {
			};
		},
		
		mounted() {
			this.getTimezone();
		},
		computed: {
			...mapState(['$timezoneOffset']),
		},
		methods: {
			...mapMutations(['SET_TIMEZONE_LIST']),
			async getTimezone() {
				const result = await uni.$u.http.get('/api/timezone/list');
				this.SET_TIMEZONE_LIST(result);
				console.log('timezone', result);
				console.log('otimeffset', this.$timezoneOffset)
			},
			async cardClickHandler(type) {
				const params = {
					'X-Lang': 'en_US',
					'X-Time-Zone': 'Asia/Shanghai',
				};
				const result = await uni.$u.http.post('/api/user/queryDetail',params, {
                    header: {
                        'content-type': 'application/x-www-form-urlencoded'
                    },
				});
				console.log(789, result);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.title-logo {
		width: 70rpx;
		height: 70rpx;
	}
	.saomiao-logo {
		width: 50rpx;
		height: 50rpx;
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
		height: 280rpx;
		border-radius: 10rpx;
		box-shadow: 0rpx 0rpx 15rpx 5rpx #eeeeee;
		font-size: 28rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 30rpx 10rpx;
		margin: 40rpx 0;
		box-sizing: border-box;
	}
	.label-img {
		width: 120rpx;
		height: 120rpx;
		margin-bottom: 30rpx;
		flex-shrink: 0;
	}
</style>