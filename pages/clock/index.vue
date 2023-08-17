<template>
	<view class="clock">
		
		<!--打卡时间轴-->
		<view class="top">
			<div>
				<p>00</p>
				<p class="desc">hours</p>
			</div>
			<div>
				<p class="symbol">00</p>
				<p class="desc">Minutes</p>
			</div>
			<div>
				<p>00</p>
				<p class="desc">Seconds</p>
			</div>
		</view>
		
		<!--打卡时间轴-->
		<view class="time-line">
			<u-time-line >
					
				<u-time-line-item bg-color='#ccdbea'>
					<template v-slot:content>
						<view class="u-order-desc">Clock in: 2023-07-19 12:25:41</view>							
					</template>
				</u-time-line-item>
					
				<u-time-line-item bg-color='#ccdbea'>
					<template v-slot:content>							
						<view class="u-order-desc">Clock in: 2023-07-19 12:25:41</view>							
					</template>
				</u-time-line-item>
			</u-time-line>
			
		</view>
		
		<!--打卡按钮-->
		<view class="clock-content"  @click="getClockChange()">
			<span>Clock In</span>
			
			<u-popup mode="center" :show="clockTypeShow" :closeOnClickOverlay="false">
				<div class="popup-header">
					<p>Clock Out</p>
					<p><u-icon name="close" @click="changeShow(false)" color="#737373"></u-icon></p>
				</div>
				
				<div class="type-part-one">Suspend</div>
				
				<div class="type-part-one">Out</div>
			</u-popup>
		</view>
		
		<!--补卡按钮-->
		<view class="clock-re">
			<span>Re-Clock</span>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				clockTypeShow: false,
			};
		},

		methods: {
			//改变
			changeShow(value){
				this.clockTypeShow = value;
			},
			
			//点击打卡
			getClockChange(){
				console.log(6666);
				this.clockTypeShow = true;
			}
		}
	}
</script>



<style lang="scss" scoped>
	.clock {
		height: 100vh;
		text-align: center;
		margin: auto;
		position: relative;
		.top {
			display: flex;
			align-items: center;
			justify-content: center;
			width: 100%;
			height: 190rpx;
			text-align: center;
			vertical-align: middle;
			font-size: 120rpx;
			font-weight: 500;
			padding: 60rpx 0 0 0;
			background-color: palegoldenrod;
			color: #004c97;
			
			.desc {
				font-size: 35rpx;
				font-weight: bold;
			}

			.symbol {
				margin-left: 32rpx;
				margin-right: 32rpx;
				display: inline-block;
				width: 240rpx;
				position: relative;
			}
			.symbol::before {
				position: absolute;
				top: -10rpx;
				left: -8rpx;
				content: ':';
			}
			.symbol::after {
				position: absolute;
				top: -10rpx;
				right: -8rpx;
				content: ':';
			}
		}
		
		.time-line {
			width: 100%;
			box-sizing: border-box;
			height: 400rpx;
			padding: 48rpx 40rpx 20rpx 80rpx;
			// background-color: #b3b3b3;
			
			.u-order-desc:not(:last-child) {
				text-align: left;
				color: #b3b3b3;
				font-size: 32rpx;
			}
			.u-order-desc:last-child {
				text-align: left;
				background-color: #004c97;
				font-size: 32rpx;
			}
			
			::v-deep .u-time-axis-item:not(:last-child) {
				.u-dot{
					background-color: #ccdbea;
				}
			}
			
			::v-deep .u-time-axis-item:last-child {
				.u-dot {
					background-color: #004c97;
				}
			}
		}
	
		.clock-content {
			position: absolute;
			left: calc(50% - 150rpx);
			bottom: calc(40% - 150px);
			display: block;
			margin: auto;
			width: 300rpx;
			height: 300rpx;
			border-radius: 50%;
			background-color: #004c97;
			text-align: center;
			line-height: 300rpx;
			color: white;
			
			::v-deep .u-popup__content{
				width: 70%;
			}
			
			.popup-header {
				box-sizing: border-box;
				padding: 0 20rpx;
				height: 80rpx;
				display: flex;
				align-items: center;
				justify-content: space-between;
				border-bottom: 1px solid #fafafa;
				box-shadow: 0 4rpx 4rpx #fafafa;
				color: #262626;
			}
			::v-deep .u-icon__icon{
				font-size: 50rpx !important;
			}
			
			.type-part-one{
				margin: 20rpx auto 10rpx;
				display: block;
				width: 60%;
				// width: 200rpx;
				height: 80rpx;
				line-height: 80rpx;
				text-align: center;
				color: #3c3d3f;
				// background-color: #d9f0fa;
				border-radius: 40rpx;
				content: 'Suspend';
			}
			.type-part-one:hover{
				background-color: #d9f0fa;
			}
		}
		
		.clock-re {
			position: absolute;
			left: calc(50% - 150rpx);
			bottom: 80rpx;
			display: block;
			margin: auto;
			width: 300rpx;
			height: 100rpx;
			background-color: #41b6e6;
			color: white;
			text-align: center;
			line-height: 100rpx;
		}
	}
</style>