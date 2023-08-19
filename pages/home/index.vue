<template>
	<view class="home">
		<!-- 标题 -->
		<u-navbar :is-back="false" title="" height="60" bg-color="#fafafa">
			<view slot="left">
				<image class="title-logo" src="../../static/login_logo.png" @click="leftShowHandler"></image>
			</view>
			<view slot="center" class="title-text">
				{{$t('home.title')}}
			</view>
			<view slot="right">
				<image class="saomiao-logo" src="../../static/saomiao.png"></image>
			</view>
		</u-navbar>

		<!-- 主页内容 -->
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
		
		<!-- 左侧弹出层 -->
		<u-popup :show="leftShow" closeable mode="left" @close="close('left')">
			<view class="left-show-container">
				<view class="logo-container">
					<image class="logo" src="../../static/login_logo.png"></image>
				</view>
				<view class="username" v-if="$userInfo.username">{{$userInfo.username}}</view>
				<view class="setting-card" @click="settingHandler('person')">
					<view class="setting-card-left">
						<image class="setting-label" src="../../static/setting_person.png"></image>
						<span>个人信息</span>
					</view>
					<image class="setting-arrow" src="../../static/setting_arrow.png"></image>
				</view>
				<view class="setting-card" @click="settingHandler('language')">
					<view class="setting-card-left">
						<image class="setting-label" src="../../static/setting_language.png"></image>
						<span>语言设置</span>
					</view>
					<image class="setting-arrow" src="../../static/setting_arrow.png"></image>
				</view>
				<view class="setting-card" @click="settingHandler('history')">
					<view class="setting-card-left">
						<image class="setting-label" src="../../static/setting_history.png"></image>
						<span>历史版本</span>
					</view>
					<image class="setting-arrow" src="../../static/setting_arrow.png"></image>
				</view>
				<view class="setting-card" @click="settingHandler('password')">
					<view class="setting-card-left">
						<image class="setting-label" src="../../static/setting_password.png"></image>
						<span>修改密码</span>
					</view>
					<image class="setting-arrow" src="../../static/setting_arrow.png"></image>
				</view>
				<view class="login-out">
					<span @click="loginOut">退出登陆</span>
				</view>
			</view>
		</u-popup>
		
		<!-- 多语言选择 -->
		<u-popup :show="languageModal" closeable mode="center" @close="close('language')" :zIndex="10080" :round="10" @open="open">
			<view class="lan-container">
				<span :class="$userInfo.language==='en_US'?'lan-select':''" @click="setLan('en_US')">English</span>
				<span :class="$userInfo.language==='zh_CN'?'lan-select':''" @click="setLan('zh_CN')">中文简体</span>
				<span :class="$userInfo.language==='zh_TW'?'lan-select':''" @click="setLan('zh_TW')">中文繁体</span>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import { mapMutations, mapState } from 'vuex';
	export default {
		data() {
			return {
				leftShow: false,
				languageModal: false,
			};
		},

		mounted() {
			this.getTimezone();
			this.$nextTick(()=>{
				this.$i18n.locale = this.$userInfo.language || 'en_US';
			})
		},
		computed: {
			...mapState(['$timezoneOffset', '$userInfo']),
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
				if (type === 'leaveApplication'||type === 'clock') {
					const urlMap = {
						'leaveApplication': '/pages/leave-application/leave-application',
						'clock': '/pages/clock/index',
					}
					const url = urlMap[type]
					console.log(url, 'url--')
					uni.navigateTo({
						url,
					})	
				} else {
					uni.showToast({
						title: '功能待开放',
						icon: 'none'
					});
				}
			},
			
			async setLan(type) {
				if (this.$userInfo.language === 'type') {
					return;
				}

				this.$i18n.locale = type;
				this.languageModal = false;
				uni.showToast({
					title: '切换语言成功',
					icon: 'none'
				});
			},
			
			settingHandler(type) {
				switch (type) {
					case 'person':
					uni.showToast({
						title: '功能待开放',
						icon: 'none'
					});
					break;
					case 'language':
					this.languageModal=true;
					break;
					case 'history':
					uni.showToast({
						title: '功能待开放',
						icon: 'none'
					});
					break;
					case 'password':
					uni.showToast({
						title: '功能待开放',
						icon: 'none'
					});
					break;
				}
			},
			
			leftShowHandler() { this.leftShow = true; },
			open() {
				const popup = document.getElementsByClassName('u-popup');
				let popupOver = popup[1].firstElementChild;
				if (popupOver && popupOver.style) {
					popupOver.style.zIndex = 10078;
				}
			},
			close(type) {
				if (type === 'left') {
					this.leftShow = false;
				} else {
					this.languageModal = false;
				}
			},
			loginOut() {
				uni.setStorageSync('accessToken', '');
				uni.setStorageSync('refreshToken', '');
				uni.redirectTo({
					url: '/pages/login/index',
					fail(err) {
						uni.showToast({
							title: '登出失败，请稍候再试',
							icon: 'none'
						});
					}
				});
			},
		}
	}
</script>

<style lang="scss" scoped>
	.lan-container {
		display: flex;
		border-radius: 20rpx;
		justify-content: center;
		align-items: center;
		flex-direction: column;
		width: 500rpx;
		height: 500rpx;
		background: white;
		span {
			border-radius: 30rpx;
			width: 240rpx;
			padding: 15rpx 0;
			text-align: center;
			margin: 30rpx 0;
		}
		.lan-select {
			background: #d2e2f9;
		}
	}
	.left-show-container {
		background: #f2f2f2;
		width: 600rpx;
		height: 100%;
		box-sizing: border-box;
		padding: 40rpx;
		position: relative;
	}
	.login-out {
		position: fixed;
		display: flex;
		justify-content: center;
		bottom: 65rpx;
		left: 0;
		width: 600rpx;
		span {
			background: #f11;
			border-radius: 35rpx;
			padding: 20rpx 170rpx;
			color: #ffffff;
			text-align: center;
			font-size: 34rpx;
		}
	}
	.logo-container {
		display: flex;
		justify-content: center;
		padding: 230rpx 0 60rpx 0;
		.logo {
			width: 160rpx;
			height: 160rpx;
		}
	}
	.username {
		text-align: center;
		margin-bottom: 40rpx;
	}
	.setting-card {
		display: flex;
		align-items: center;
		justify-content: space-between;
		border-radius: 20rpx;
		padding: 26rpx 20rpx;
		background: white;
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 50rpx;
		.setting-card-left {
			display: flex;
			align-items: center;
			.setting-label {
				width: 55rpx;
				height: 55rpx;
				margin-right: 20rpx;
			}
			span {
				flex-shrink: 0;
			}
		}
		.setting-arrow {
			width: 20rpx;
			height: 36rpx;
		}
	}
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