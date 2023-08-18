<template>
	<u-popup :show="show" mode="center" @close="$emit('cancel')" round="30">
		<view class="common-popup">
			<view class="popup-header">
				<image :src="titleIcon" mode=""></image>
				<u-icon @click="$emit('cancel')" name="close" size="28" class="close-icon"></u-icon>
			</view>
			<view class="popup-content">
				{{content}}
			</view>
			<view class="popup-footer" v-show="isShowFooter">
				<u-button text="Cancel" @click="$emit('cancel')" color="#d9f0fa" shape="circle"></u-button>
				<u-button text="Confirm" @click="$emit('confirm')" color="#41b6e6" shape="circle"></u-button>
			</view>
		</view>
	</u-popup>
</template>

<script>
	export default {
		name: "common-popup",
		props: {
			show: {
				type: Boolean,
				default: false
			},
			titleIcon: {
				type: String,
				default: ''
			},
			content: {
				type: String,
				default: ''
			},
			isShowFooter: {
				type: Boolean,
				default: false
			}
		},
		data() {
			return {

			};
		},

	}
</script>

<style lang="scss" scoped>
	.common-popup {
		width: 600rpx;
		min-height: 300rpx;
		background: #fff;
		border-radius: 20rpx;

		.popup-header {
			display: flex;
			align-items: center;
			justify-content: space-between;
			box-sizing: border-box;
			padding: 20rpx;

			border-bottom: 1rpx solid #ccc;

			image {
				width: 48rpx;
				height: 48rpx;
			}

			.close-icon {
				background: #e8e8e8;
			}

		}

		.popup-content {
			padding: 50rpx;
			box-sizing: border-box;
			word-break: break-all;
			text-align: center;
			font-size: 26rpx;
			color: #333;
		}

		.popup-footer {
			padding: 20rpx;
			box-sizing: border-box;
			display: flex;
			justify-content: space-around;

			::v-deep .u-button {
				&:nth-child(1) {
					color: #333 !important;
				}
			}
		}
	}
</style>