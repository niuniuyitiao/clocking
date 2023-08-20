<template>
	<view class="container">
		<u-navbar border autoBack leftText="Back" title="LeaveApplication" :safeAreaInsetTop="false"
			:height="customBar+'px'"></u-navbar>
		<view class="search-wrap" :style="{marginTop:customBar+'px'}">
			<u-search v-model="applyNo" placeholder="Apply Number" shape="square" :showAction="false"
				@clear="getApplicationList" @search="getApplicationList"></u-search>
			<image @click="showFilter=true" class="filter-icon" src="../../static/images/notification_filter.png"
				mode=""></image>
		</view>
		<view class="content-list">
			<view class="content-item" v-for="(item,index) in applicationList" :key="index"
				@click="handleDeatail(item.id)">
				<view class="item-flex">
					<view class="item-title">
						{{item.leaveNo}}
					</view>
					<view class="item-status">
						{{workflowApproveStatus(item.workflowApproveStatus)}}
					</view>
				</view>
				<view class="item-flex">
					<view class="item-text">
						Apply Date: {{item.applyDate}}
						<!--  {{$u.timeFormat(new Date(item.createTime).getTime(), 'yyyy-mm-dd hh:MM')}} -->
					</view>
					<view class="item-text">
						{{item.typeName}}
					</view>
				</view>
			</view>
			<u-loadmore :status="loadMoreStatus" />
		</view>
		<u-popup :show="showFilter" mode="right" @close="closeFilter">
			<view class="filter-content">
				<u-form labelPosition="left" labelWidth="auto">
					<u-form-item label="Apply Date" @click="showCalendar=true">
						<u-input :value="applyDateShow" disabled placeholder="Start Date → End Date">
							<template slot="suffix">
								<image class="calendar-icon" src="../../static/images/calendar_notselect.png" mode="">
								</image>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item labelWidth="auto" label="Leave Type" @click="showAtdTypeId=true">
						<u-input :value="atdTypeId.typeName" placeholder="Please select" disabled>
							<template slot="suffix">
								<u-icon name="arrow-down" color="#ccc" size="24"></u-icon>
							</template>
						</u-input>
					</u-form-item>
					<u-form-item labelWidth="auto" label="Status" @click="showStatus=true">
						<u-input :value="status.name" placeholder="Please select" disabled>
							<template slot="suffix">
								<u-icon name="arrow-down" color="#ccc" size="24"></u-icon>
							</template>
						</u-input>
					</u-form-item>
				</u-form>
				<view class="footer">
					<u-button :plain="true" :hairline="false" text="Reset" @click="handleReset"></u-button>
					<u-button :plain="true" :hairline="false" text="Confirm" @click="handleSubmit"></u-button>
				</view>
				<u-calendar :allowSameDay="true" mode="range" @close="showCalendar=false" :closeOnClickOverlay="true"
					:show="showCalendar" @confirm="confirmCalendar"></u-calendar>
				<u-picker :show="showAtdTypeId" :columns="[atdTypeIdColumns]" keyName="typeName"
					@close="showAtdTypeId=false" @confirm="confirmAtdTypeId"></u-picker>
				<u-picker :show="showStatus" :columns="[statusColumns]" keyName="name" @close="showStatus=false"
					@confirm="confirmStatus"></u-picker>
			</view>

		</u-popup>
		<u-button class="new-btn" @click="handleCreate">
			New
		</u-button>
	</view>
</template>

<script>
	import { statusColumns } from '../../common/enum.js'
	export default {
		data() {
			return {
				loadMoreStatus: 'loadmore',
				customBar: this.customBar,
				total: 0,
				pageNum: 1,
				showFilter: false,
				showCalendar: false,
				applyNo: '',
				atdTypeId: {
					id: '',
					typeName: ''
				}, //请假类型
				showAtdTypeId: false,
				atdTypeIdColumns: [],
				status: {
					id: '',
					name: ''
				},
				statusColumns,
				showStatus: false,
				applicationList: [],
				applyDate: null
			};
		},
		computed: {
			applyDateShow() {
				if (!this.applyDate) return ''
				return this.applyDate.startTime + '-' + this.applyDate.endTime
			},
			workflowApproveStatus() {
				return function(status) {
					return this.statusColumns.find(i => i.id === status)?.name
				}
			}
		},
		onShow() {
			this.applicationList=[];
			this.getApplicationList()
			this.getAtdTypeIdColumns()
		},
		onReachBottom() {
			console.log('触底了')
			if (this.applicationList.length < this.total) {
				this.pageNum++
				this.getApplicationList()
			} else {
				this.loadMoreStatus = "nomore"
			}
		},
		methods: {
			async getApplicationList() {
				this.loadMoreStatus = "loading"
				const params = {
					applyDate: {
						endTime: "",
						startTime: ""
					},
					applyNo: this.applyNo,
					atdTypeId: this.atdTypeId.id,
					// orderList": [{
					// 	asc: true,
					// 	name: ""
					// }],
					orgIdList: [],
					pageNum: this.pageNum,
					pageSize: 10,
					status: this.status.id,
					storeCode: "",
					userAccount: ""
				}
				const {
					total,
					list
				} = await uni.$u.http.post('/api/attendance/leave/admin/list', params);
				console.log(list, 'list')
				this.applicationList = [...this.applicationList, ...list]
				if (total > this.applicationList.length) {
					this.loadMoreStatus = "loadmore"
				} else {
					this.loadMoreStatus = "nomore"
				}

				this.total = total
			},
			async getAtdTypeIdColumns() {
				const result = await uni.$u.http.post('/api/attendance/type/queryList', { flag: 1 });
				this.atdTypeIdColumns = result
			},
			confirmAtdTypeId(e) {
				this.atdTypeId = e.value[0]
				this.showAtdTypeId = false
			},
			confirmStatus(e) {
				this.status = e.value[0]
				this.showStatus = false
			},
			closeFilter() {
				this.showFilter = false
			},
			confirmCalendar(e) {
				this.applyDate = {
					startTime: e[0],
					endTime: e[e.length - 1]
				}
				this.showCalendar = false
			},
			handleReset() {
				this.applyDate = null
				this.atdTypeId = {
					typeName: '',
					id: ''
				}
				this.status = {
					name: '',
					id: ''
				}
			},
			handleSubmit() {
				this.getApplicationList()
			},
			handleCreate() {
				uni.navigateTo({
					url: '/pages/leave-application/create'
				})
			},
			handleDeatail(id) {
				uni.navigateTo({
					url: `/pages/leave-application/detail?id=${id}`
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		height: 100%;
		background-color: #fff;

		.new-btn {
			position: fixed;
			right: 50rpx;
			bottom: 150rpx;
			border-radius: 50%;
			background: #fff;
			font-size: 28rpx;
			width: 120rpx;
			height: 120rpx;
			color: dodgerblue;
			text-align: center;
			line-height: 120rpx;
			box-shadow: 0 2rpx 8rpx 1rpx #333;
		}

		.search-wrap {
			width: 100%;
			height: 120rpx;
			padding: 0 40rpx;
			box-sizing: border-box;
			display: flex;
			background-color: #fff;

			.filter-icon {
				width: 50rpx;
				height: 50rpx;
				align-self: center;
				margin-left: 10rpx;
			}
		}

		.content-list {
			border-top: 8rpx solid #ccc;
			padding:0 0 40rpx 40rpx;
		}

		.content-item {
			border-bottom: 1rpx solid #ccc;
			padding-bottom: 20rpx;

			.item-flex {
				display: flex;
				justify-content: space-between;
				font-size: 24rpx;
				color: #333;
				font-weight: normal;
				margin: 20rpx 40rpx 0 0;

				.item-title {
					font-size: 28rpx;
					font-weight: bold;
				}

				.item-text {
					color: #ccc;
				}
			}

		}

		.filter-content {
			width: 600rpx;
			padding: 200rpx 10rpx 0;


			::v-deep .u-form-item__body__left__content__label {
				font-size: 24rpx !important;
			}

			::v-deep .u-input__content__field-wrapper__field {
				font-size: 24rpx !important;
			}

			::v-deep .calendar-icon {
				width: 50rpx;
				height: 50rpx;
			}

			.footer {
				width: 600rpx;
				position: fixed;
				bottom: 100rpx;
				right: 10rpx;
				box-sizing: border-box;
				display: flex;
				border-radius: 50rpx;
				border: 1px solid #000;
				overflow: hidden;
				background-image: linear-gradient(to right, #FFF 50%, #005aa0 50%);

				::v-deep .u-button {
					border: none;
					background: transparent;


					&:nth-child(1) {
						color: #005aa0;
					}

					&:nth-child(2) {
						color: #fff;
					}
				}
			}
		}
	}
</style>