<template>
	<view class="container">
		<u-navbar border autoBack leftText="Back" :title="$t('application.leaveApplication')" :safeAreaInsetTop="false"
			:height="customBar+'px'"></u-navbar>
		<u-form class="form" :style="{marginTop:customBar+'px'}">
			<u-form-item labelWidth="auto" :label="$t('application.leaveDate')+':'" required @click="showCalendar=true">
				<u-input :value="applyDateShow" disabled placeholder="Start Date → End Date">
					<template slot="suffix">
						<image class="calendar-icon" src="../../static/images/calendar_notselect.png" mode="">
						</image>
					</template>
				</u-input>
			</u-form-item>
			<u-form-item labelWidth="auto" :label="$t('application.LeaveType')+':'" @click="showAtdTypeId=true"
				required>
				<u-input :value="form.atdTypeId.typeName" placeholder="Please select" disabled>
					<template slot="suffix">
						<u-icon name="arrow-down" color="#ccc" size="24"></u-icon>
					</template>
				</u-input>
			</u-form-item>
			<u-form-item labelWidth="auto" :label="$t('application.totalLeaveHours')+':'" required>
				<u-input :value="form.totalHours" disabled></u-input>
			</u-form-item>
			<u-form-item labelWidth="auto" :label="$t('application.comments')+':'" required>
				<u-textarea v-model="form.reason" placeholder="Comments" :confirmType="null"></u-textarea>
			</u-form-item>
			<u-button @click="handleSubmit">Submit</u-button>
		</u-form>
		<view class="leave-details">
			<view class="title">
				{{$t('application.leaveDetails')}}
			</view>
			<view class="leave-table">
				<view class="table-head table-column">
					<view class="column-item">{{$t('application.date')}}</view>
					<view class="column-item">
						<view class="column-item-border border-none">
							<view>{{$t('application.startTime')}}</view>
							<view>{{$t('application.endTime')}}</view>
						</view>
					</view>
					<view class="column-item">{{$t('application.leaveHours')}}</view>
				</view>
				<view class="table-column" v-for="(item,index) in leaveDetailsList" :key="index">
					<view class="column-item">
						{{item.workDateTimestamp}}
					</view>
					<view class="column-item">
						<view class="column-item-border">
							<view class="start-time" @click="handleShowDatetime(index,'startTime')">
								{{item.startTime}}
								<text v-show="!item.startTime">{{$t('application.startTime')}}</text>
							</view>
							—
							<view class="start-time" @click="handleShowDatetime(index,'endTime')">
								{{item.endTime}}
								<text v-show="!item.endTime">{{$t('application.endTime')}}</text>
							</view>
						</view>
					</view>
					<view class="column-item">
						<view class="column-item-border">
							{{item.totalHours}}
							<text v-show="!item.totalHours">{{$t('application.leaveHours')}}</text>
						</view>
					</view>
				</view>

			</view>
		</view>
		<u-calendar :allowSameDay="true" mode="range" @close="showCalendar=false" :closeOnClickOverlay="true"
			:show="showCalendar" @confirm="confirmCalendar"></u-calendar>
		<u-picker :show="showAtdTypeId" :columns="[atdTypeIdColumns]" keyName="typeName" @close="showAtdTypeId=false"
			@confirm="confirmAtdTypeId"></u-picker>
		<u-datetime-picker :minHour="minHour" :minMinute="minMinute" mode="time" :show="showDatetime" v-model="dateTime"
			@confirm="confirmDatetime" @cancel="showDatetime=false"></u-datetime-picker>
		<common-popup content="Submit successful!" titleIcon="../../static/images/duigou.png" :show="showPopup"
			@cancel="handleBack">
		</common-popup>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				showPopup: false,
				customBar: this.customBar,
				showCalendar: false,
				showAtdTypeId: false,
				showDatetime: false,
				atdTypeIdColumns: [],
				dateTime: '',
				form: {
					applyDate: {
						startDate: '',
						startDateStartTime: '',
						startDateEndTime: '',
						startDateLeaveHours: '',
						endDate: '',
						EndDateStartTime: '',
						EndDateEndTime: '',
						endDateLeaveHours: ''
					},
					atdTypeId: {
						id: '',
						typeName: ''
					},
					totalHours: '',
					reason: ''
				},
				leaveDetailsList: [
					/* {
						workDateTimestamp:'',
						startTime:'',
						endTime:'',
						totalHours
					} */
				],
				minHour: 0,
				minMinute: 0,
			}
		},
		computed: {
			applyDateShow() {
				if (!this.form.applyDate.startDate) return ''
				return this.form.applyDate.startDate + '-' + this.form.applyDate.endDate
			}
		},
		onLoad() {
			this.getAtdTypeIdColumns()
		},
		methods: {
			async getAtdTypeIdColumns() {
				const result = await uni.$u.http.post('/api/attendance/type/queryList', { flag: 1 });
				this.atdTypeIdColumns = result
				console.log(this.atdTypeIdColumns, 'atdTypeIdColumns')
			},
			confirmCalendar(e) {
				this.form.applyDate.startDate = e[0]
				this.form.applyDate.endDate = e[e.length - 1]
				this.showCalendar = false
				console.log(e, '---')
				let arr = []
				e.forEach(item => {
					if ((arr.length && (arr[0].workDateTimestamp != item)) || !arr.length) {
						arr.push({
							workDateTimestamp: item,
							startTime: '',
							endTime: '',
							totalHours: ''
						})
					}
				})
				this.leaveDetailsList = arr
			},
			confirmAtdTypeId(e) {
				this.form.atdTypeId = e.value[0]
				this.showAtdTypeId = false
			},
			handleBack() {
				uni.navigateBack()
			},
			handleShowDatetime(index, key) {
				this.currentTableIndex = index
				this.currentTableKey = key
				if (index === 0) {
					const date = new Date()
					this.minHour = date.getHours()
					this.minMinute = date.getMinutes()
				} else {
					this.minHour = 0
					this.minMinute = 0
				}
				this.showDatetime = true
			},
			compareTime(startTime, endTime) {
				const startHour = startTime.split(':')[0]
				const startMinutes = startTime.split(':')[1]
				const endHour = endTime.split(':')[0]
				const endMinutes = endTime.split(':')[1]

				let totalMinutes1 = Number(startHour) * 60 + Number(startMinutes);
				let totalMinutes2 = Number(endHour) * 60 + Number(endMinutes);
				const result = totalMinutes2 - totalMinutes1
				if (result < 0) {
					return -1;
				} else {
					return Number((result / 60).toFixed(2));
				}
			},
			confirmDatetime(e) {
				console.log(e, 'E--')
				const currentTableKey = this.currentTableKey
				const startTime = currentTableKey === 'startTime' ? e.value : this.leaveDetailsList[this.currentTableIndex]
					.startTime
				const endTime = currentTableKey === 'endTime' ? e.value : this.leaveDetailsList[this.currentTableIndex]
					.endTime
				if (startTime && endTime) {
					const result = this.compareTime(startTime, endTime);
					if (result === -1) {
						return uni.$u.toast('结束时间不能小于开始时间')
					}
					this.$set(this.leaveDetailsList[this.currentTableIndex], 'totalHours', result)
				}
				this.$set(this.leaveDetailsList[this.currentTableIndex], this.currentTableKey, e.value)
				const totalHours = this.leaveDetailsList.reduce((i, n) => {
					return i + n.totalHours
				}, 0)
				this.form.totalHours = totalHours
				this.showDatetime = false
			},
			getTimezoneOffset() {
				const date = new Date();
				return Math.abs(date.getTimezoneOffset() / 60);
			},


			async handleSubmit() {
				console.log(this.form, 'this.form---', !this.form.applyDate.startDate)
				if (!this.form.applyDate.startDate || !this.form.applyDate.endDate) return uni.$u.toast('请选择日期')
				if (!this.form.atdTypeId.id) return uni.$u.toast('请选择请假类型')
				if (!this.form.reason) return uni.$u.toast('请填写请假原因')
				let flag = true
				const length = this.leaveDetailsList.length
				const arr = this.leaveDetailsList
				console.log(this.leaveDetailsList, 'this.leaveDetailsList--')
				for (let i = 0; i < length; i++) {
					console.log(arr[i])
					if (!arr[i].startTime || !arr[i].endTime) {
						flag = false
						break;
					}
				}
				console.log(flag, 'flag--')
				if (!flag) return uni.$u.toast('请选择详细时间')
				const timezoneOffset = this.getTimezoneOffset()
				const detailList = this.leaveDetailsList.map(i => {
					const date = new Date(i.workDateTimestamp)
					i.workDateTimestamp = date.setHours(date.getHours() + timezoneOffset);
					return i
				})
				const startTimestamp = new Date(this.form.applyDate.startDate + ' ' + arr[0].startTime +
					':00')
				const endTimestamp = new Date(this.form.applyDate.endDate + ' ' + arr[length - 1]
					.endTime + ':00')
				startTimestamp.setHours(startTimestamp.getHours() + timezoneOffset);
				endTimestamp.setHours(endTimestamp.getHours() + timezoneOffset);
				console.log(startTimestamp, endTimestamp)
				const params = {
					atdTypeId: this.form.atdTypeId.id,
					detailList,
					reason: this.form.reason,
					totalHours: this.form.totalHours,
					startTimestamp,
					endTimestamp,
				}
				console.log(params, 'params---')

				const result = await uni.$u.http.post('/api/attendance/leave/saveOrUpdate', params);
				console.log(result, 'result--')
				if (result && result.id) {
					this.showPopup = true
				} else {
					uni.$u.toast('提交失败')
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		width: 750rpx;
		height: 100%;

		.form {
			padding: 0 40rpx;
			box-sizing: border-box;

			::v-deep .calendar-icon {
				width: 50rpx;
				height: 50rpx;
			}

			.u-button {
				position: fixed;
				bottom: 0;
				left: 0;
				background: #005aa0;
				width: 100%;
				height: 100rpx;
				color: #fff;
				font-size: 30rpx;
				text-align: center;
				line-height: 100rpx;
			}
		}

		.leave-details {
			margin-top: 40rpx;
			padding: 0 40rpx 150rpx;
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
						padding: 3rpx 10rpx;
						box-sizing: border-box;
						display: flex;
						align-items: center;

						border-right: 1rpx solid #ccc;
						border-bottom: 1rpx solid #ccc;
						min-height: 60rpx;
						min-width: 26%;

						&:nth-last-child(1) {
							border-right: none;
						}

						&:nth-child(2) {
							flex: 1;
						}

						text {
							color: #ccc;
						}

						.column-item-border {
							display: flex;
							justify-content: space-between;
							padding: 2rpx 4rpx;
							box-sizing: border-box;
							width: 100%;
							height: 100%;
							border: 1px solid #ccc;
						}

						.border-none {
							border: none;
						}
					}
				}
			}
		}
	}
</style>