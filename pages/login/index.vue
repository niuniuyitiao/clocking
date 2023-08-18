<template>
	<view class="login-main">
		<view class="login-logo">
			<image class="logo" src="../../static/login_logo.png"></image>
		</view>

		<view class="login-title">REPLAY</view>

		<view class="login-row">
			<u-icon name="account-fill"></u-icon>
			<u-input v-model="userName" type="text" border="false" placeholder="账户" />
		</view>
		<view class="login-row">
			<u-icon name="lock-fill"></u-icon>
			<u-input v-model="password" :type="inputType" border="false" placeholder="密码" />
			<u-icon class="eye-icon" @tap="changeIcon" :name="suffixIcon"></u-icon>
		</view>

		<view class="login-btn" @click="loginHandler">
			登陆
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				suffixIcon: 'eye-off',
				inputType: 'password',
				userName: '100002',
				password: 'R123456Test',
				timer: null,
			};
		},

		mounted() {},

		methods: {
			//改变密码的可视状态
			changeIcon() {
				this.suffixIcon = this.suffixIcon === 'eye-off' ? 'eye-fill' : 'eye-off'
				this.inputType = this.inputType === 'password' ? 'text' : 'password';
				this.$forceUpdate();
			},
			async loginHandler() {
				const params = {
					loginType: 2,
					password: this.password,
					username: this.userName
				};
				const reuslt = await uni.$u.http.post('/api/auth/login', params, {
					dataType: 'json'
				});
				uni.setStorageSync('accessToken', reuslt.accessToken);
				uni.setStorageSync('refreshToken', reuslt.refreshToken);
				console.log(44, reuslt);
				uni.redirectTo({
					url: '/pages/home/index',
					fail(err) {
						console.log('重定向失败：', err);
					}
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.login-main {
		background: #fafafa;
		height: 100%;
	}

	.login-logo {
		height: 35%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	.logo {
		width: 120rpx;
		height: 120rpx;
		margin-top: 150rpx;
	}

	.login-title {
		padding: 20rpx 60rpx;
		color: #005aa0;
		font-size: 42rpx;
		font-weight: bold;
	}

	.login-row {
		display: flex;
		align-items: center;
		padding: 10rpx 20rpx;
		background: white;
		margin: 30rpx 60rpx;
		border-radius: 10rpx;
	}

	.login-btn {
		margin: 50px 40px;
		height: 100rpx;
		background: #005aa0;
		border-radius: 50px;
		color: white;
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 28rpx;
	}
</style>