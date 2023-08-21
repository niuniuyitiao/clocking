<template>
	<view class="container">
		<u-navbar border autoBack leftText="Back" :title="$t('application.leaveApplication')" :safeAreaInsetTop="false"
			:height="customBar+'px'">
			<view class="u-nav-slot" v-show="detail.workflowApproveStatus!=2" slot="right"
				@click="showCancelPopup=true">
				Cancel
			</view>
		</u-navbar>
		<view class="content" :style="{marginTop:customBar+'px'}">
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.applyDate')}}:
				</view>
				<view class="item-row">
					{{detail.applyDate}}
				</view>
			</view>
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.applyNumber')}}:
				</view>
				<view class="item-row">
					{{detail.leaveNo}}
				</view>
			</view>
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.leaveDate')}}:
				</view>
				<view class="item-row">
					{{$u.timeFormat(new Date(detail.startTimestamp).getTime())}}
					--
					{{$u.timeFormat(new Date(detail.endTimestamp).getTime())}}
				</view>
			</view>
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.LeaveType')}}:
				</view>
				<view class="item-row">
					{{detail.typeName}}
				</view>
			</view>
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.totalLeaveHours')}}:
				</view>
				<view class="item-row">
					{{detail.totalHours}}
				</view>
			</view>
			<view class="item-flex">
				<view class="item-title">
					{{$t('application.comments')}}:
				</view>
				<view class="item-row">
					{{detail.reason}}
				</view>
			</view>
			<view class="leave-details">
				<view class="title">
					{{$t('application.leaveDetails')}}
				</view>
				<view class="leave-table">
					<view class="table-head table-column">
						<view class="column-item">{{$t('application.date')}}</view>
						<view class="column-item">{{$t('application.startTime')}}</view>
						<view class="column-item">{{$t('application.endTime')}}</view>
						<view class="column-item">{{$t('application.leaveHours')}}</view>
					</view>
					<view class="table-column" v-for="(item,index) in detail.detailList" :key="index">
						<view class="column-item">
							{{$u.timeFormat(new Date(detail.workDateTimestamp).getTime())}}
						</view>
						<view class="column-item">{{item.startTime}}</view>
						<view class="column-item">{{item.endTime}}</view>
						<view class="column-item">{{item.totalHours}}</view>
					</view>
				</view>
			</view>
			<view class="flow-box">
				<view class="flow-title">
					{{$t('application.approvalHistory')}}
				</view>
				<view class="flow-row">
					<u-steps :current="3" direction="column" :dot="true" activeColor="#c8d7e6" inactiveColor="#004c97">
						<u-steps-item v-for="(item,index) in detail.approveList" :key="index"
							:title="$u.timeFormat(new Date(detail.workDateTimestamp).getTime(),'yyyy-mm-dd hh:MM')">
							<view class="slot-desc" slot="desc">
								<image v-show="index===0" src="../../static/images/play-circle.png" mode=""></image>
								<image v-show="index>0&&item.approveStatus===1" src="../../static/images/duigou.png"
									mode=""></image>
								<view>
									<view>
										{{item.boundaryNodeTitle?item.boundaryNodeTitle: 'Result:' + approveStatus(item.approveStatus)}}
									</view>
									<view v-show="index>0&&item.approveNote">
										Comment: {{item.approveNote}}
									</view>
								</view>
								<view class="step-title">
									{{item.stepTitle}}
								</view>

							</view>
						</u-steps-item>
					</u-steps>
				</view>
			</view>
		</view>

		<common-popup titleIcon="../../static/images/info.png" :show="showCancelPopup" @cancel="showCancelPopup=false"
			:isShowFooter="true" content="Are you sure to cancel this application?" @confirm="handleConfirm">
		</common-popup>
		<common-popup content="This application has been cancelled!" titleIcon="../../static/images/duigou.png"
			:show="showPopup" @cancel="handleBack">
		</common-popup>
	</view>
</template>

<script>
	import commonPopup from '../../components/common-popup/common-popup.vue'
	import { statusColumns } from '../../common/enum.js'
	export default {
		components: {
			commonPopup
		},
		data() {
			return {
				showPopup: false,
				customBar: this.customBar,
				detail: {},
				statusColumns,
				showCancelPopup: false,
			};
		},
		computed: {
			approveStatus() {
				return function(status) {
					return this.statusColumns.find(i => i.id === status)?.name
				}
			}
		},
		onLoad(options) {
			this.id = options.id
			this.getDeatil(this.id)
		},
		methods: {
			async getDeatil(id) {
				const result = await uni.$u.http.post(`/api/attendance/leave/queryDetailById/${id}`, {}, {
					header: {
						'content-type': 'application/x-www-form-urlencoded'
					},
				});
				this.detail = result

			},
			async handleConfirm() {
				const result = await uni.$u.http.post('/api/workflow/cancel', {
					billCode: this.detail.leaveNo,
				});
				if (result) {
					this.showCancelPopup = false
					this.showPopup = true
				}
			},
			handleBack() {
				uni.navigateBack()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 750rpx;
		height: 100%;

		.u-nav-slot {
			color: red;
		}

		.content {
			box-sizing: border-box;
			padding: 20rpx 40rpx;

			.item-flex {
				display: flex;
				align-items: center;
				padding: 20rpx 0;

				.item-title {
					font-size: 26rpx;
					color: #ccc;
					width: 35%;
					align-self: flex-start;
				}

				.item-row {

					color: #333;
					font-size: 26rpx;
					margin-left: 20rpx;
					flex: 1;
				}
			}

			.leave-details {
				margin-top: 40rpx;
				font-size: 20rpx;
				color: #333;

				.title {
					font-size: 28rpx;
					margin-bottom: 15rpx;
				}

				.leave-table {
					border: 1px solid #ccc;
					border-bottom: none;
					border-radius: 5rpx;

					.table-head {
						background: #fafafc;
					}

					.table-column {
						display: flex;
						align-items: center;

						.column-item {
							padding: 8rpx 10rpx;
							box-sizing: border-box;
							border-right: 1rpx solid #ccc;
							border-bottom: 1rpx solid #ccc;
							flex: 1;
							text-align: center;
						}
					}

				}
			}

			.flow-box {
				background: #f4f4f4;
				border-radius: 12rpx;
				min-height: 100rpx;
				width: 100%;
				margin-top: 20rpx;
				box-sizing: border-box;
				padding: 30rpx 16rpx;

				.flow-title {
					font-size: 26rpx;
					color: #333;
					font-weight: bold;
				}

				::v-deep .u-steps-item__wrapper {
					background: unset;
				}

				::v-deep .slot-desc {
					display: flex;

					font-size: 26rpx;
					color: #333;


					image {
						width: 32rpx;
						height: 32rpx;
						margin-right: 10rpx;
					}

					.step-title {
						align-self: flex-start;
						justify-self: flex-end;
						margin-top: -30rpx;
						flex: 1;
						text-align: right;
						color: #52c41a;
					}
				}
			}
		}


	}
</style>