<template>
	<view class="clock">
		<u-navbar :is-back="false"  height="60" bg-color="#fafafa">
			<view class="navbar-left" slot="left" @click="changePage">
				<u-icon name="arrow-left" ></u-icon>
				<span>Back</span>
			</view>
			<view slot="center" class="title-text">
				Clock
			</view>
		</u-navbar>
		
		<view class="clock-content-box">
			<view class="clock-content-part">
				<!--打卡累计时间-->
				<view class="top">
					<div>
						<p>{{clockTime.hour}}</p>
						<p class="desc">hours</p>
					</div>
					<div>
						<p class="symbol">{{clockTime.minutes}}</p>
						<p class="desc">Minutes</p>
					</div>
					<div>
						<p>{{clockTime.seconds}}</p>
						<p class="desc">Seconds</p>
					</div>
				</view>
				
				<!--打卡时间轴-->
				<view class="time-line">
					<u-time-line >
						
						<u-time-line-item bg-color='#ccdbea' v-for="item in todayClock.list" :key="item.id">
							<template v-slot:content>
								<view class="u-order-desc">{{clockTypeList.filter(ele=>ele.id===item.clockType)[0].remark}}: {{moment(item.clockTime).format('YYYY-MM-DD HH:mm:ss')}}</view>							
							</template>
						</u-time-line-item>
							
						
					</u-time-line>
					
				</view>
				
				<!--打卡按钮-->
				<view v-if="clockType!=='结束'" class="clock-content"  @click="getClockChange()">
					<span v-if="clockType==='签入'">Clock In</span>
					<span v-if="clockType==='暂停'">Resume</span>
					<span v-if="clockType==='签出' || clockType==='继续'">Clock Out</span>
					
					<u-popup mode="center" :show="clockTypeShow" :closeOnClickOverlay="false">
						<div class="popup-header">
							<p>Clock Out</p>
							<p><u-icon name="close" @click="clockTypeShow=false" color="#737373"></u-icon></p>
						</div>
						
						<div class="type-part-one" @click="changeShow(false,'暂停')">Suspend</div>
						
						<div class="type-part-one" @click="changeShow(false,'签出')">Out</div>
					</u-popup>
				</view>
				
				<!--补卡按钮-->
				<view class="clock-re">
					<span>Re-Clock</span>
				</view>
				
				<!--提示弹窗-->
				<u-popup mode="center" :show="toastShow">
					<div class="popup-header">
						<p v-if="toastType==='success'"><u-icon name="checkmark-circle-fill"  color="#38be6b"></u-icon></p>
						<p v-if="toastType==='warning'"><u-icon name="info-circle-fill"  color="#41b6e6"></u-icon></p>
						<p><u-icon name="close" @click="changeToastShow(false)" color="#737373"></u-icon></p>
					</div>
					
					<div class="toast-content">
						<p class="toast-title">{{toastTitle}}</p>
						<p class="toast-text" @click="changeToastShow(false)" v-if="toastContent && toastContent!==''">{{toastContent}}</p>
					</div>
				</u-popup>
				
				<!--签出二次确认弹窗-->
				<u-popup mode="center" :show="clockOutShow">
					<view class="out-confirm-container">
						<div class="popup-header">
							<p ><u-icon name="info-circle-fill"  color="#41b6e6"></u-icon></p>
							<p><u-icon name="close" @click="changeClockShow(false)" color="#737373"></u-icon></p>
						</div>
						
						<div class="toast-content">
							<p class="toast-title">Are you sure</p>
							<p class="toast-title" @click="changeClockShow(false)">you want to clock out?</p>
						</div>
						<div class="toast-button">
							<u-button type="primary" @click="changeClockShow(false)" style="border-radius: 40rpx;background-color: #d9f0fa;border-color: #d9f0fa;color:black"  text="Cancel"></u-button>
							<u-button type="primary" @click="changeClockShow(false,'confirm')" style="margin-left: 20rpx;border-radius: 40rpx;"  text="Confirm"></u-button>
						</div>			
					</view>
				</u-popup>
				
				<!--补签弹窗-->
				<!-- <u-popup mode="center" :show="">
					<div class="popup-header">
						<p >Re-Clock</p>
						<p><u-icon name="close" color="#737373"></u-icon></p>
					</div>
					
					<div class="re-clock-content">
						<u-form class="form">
							<u-form-item labelWidth="auto" label="" required >
								
							</u-form-item>
							<u-form-item labelWidth="auto" label="" @click="showAtdTypeId=true" required>
								
							
							<u-form-item labelWidth="auto" label="" required>
								<u-textarea  placeholder="Comments"></u-textarea>
							</u-form-item>
							<div>
								<u-button type="primary"  style="border-radius: 40rpx;background-color: #d9f0fa;border-color: #d9f0fa;color:black"  text="Cancel"></u-button>
								<u-button type="primary"  style="margin-left: 20rpx;border-radius: 40rpx;"  text="Confirm"></u-button>
							</div>
						</u-form>
					</div>
				</u-popup> -->
			</view>
		</view>
	</view>
</template>

<script>
	import { mapState } from 'vuex';
	import moment from 'moment'
	export default {
		data() {
			return {
				clockTypeShow: false,  //签出的弹窗选择暂停和签出
				clockTypeList: [],  //打卡类型列表
				todayClock: {},  //今日打卡记录
				clockType: '签入',  //打卡状态
				clockInfo: '',  //打卡类型信息
				latitude: 0,  //纬度
				longitude: 0,  //经度
				storeIndo: {},
				toastShow: false,  //提示弹框
				toastTitle: '', //提示标题
				toastContent: '', //提示内容
				toastType: '', //提示类型success成功warning警示
				clockTime: {
					hour: '00',
					minutes: '00',
					seconds: '00',
				},   //时间
				timer: null,
				clockOutShow: false, //签出二次确认弹框
			};
		},
		
		computed: {
			...mapState(['$userInfo','$timezoneOffset'])
		},
		
		beforeDestroy() {
		    if (this.timer) {
		      clearInterval(this.timer); // 在Vue实例销毁前，清除时间定时器
		    }
		},
		
		
		mounted() {
			//获取打卡类型列表和今日打卡
			this.getClockTypeList().then(()=>{
				this.getTodayClock();
			})
			
			// this.getStoreInfo();
		},

		methods: {
			moment,
			//切换页面
			changePage(){
				uni.navigateTo({
					url: '/pages/home/index',
					fail(err) {
						console.log('重定向失败：', err);
					}
				})
			},
			
			//获取打卡类型列表
			async getClockTypeList(){
				console.log(666,this.$userInfo,moment().format(""));
				let params = {
					"flag": 3
				}
				const res = await uni.$u.http.post('/api/attendance/type/queryList',params);
				this.clockTypeList = res;
			},
			
			//获取今日打卡记录
			async getTodayClock(){
				const res = await uni.$u.http.post('/api/clock/user/list');

				this.todayClock = res || {};
				let arr = res?.list || [];
				let list = arr.map(item=>item.clockType);

				if (!list.includes(this.clockTypeList.filter(item=>item.typeCode==='CLOCK_IN')[0].id)){
					this.clockType='签入'
				} else if (list.includes(this.clockTypeList.filter(item=>item.typeCode==='CLOCK_OUT')[0]?.id)){
					this.clockType = '结束';
					if(this.timer){
						clearInterval(this.timer)
					}
					this.changeClockTime()
				} else if (list.includes(this.clockTypeList.filter(item=>item.typeCode==='SUSPEND')[0]?.id) && !list.includes(this.clockTypeList.filter(item=>item.typeCode==='RESUME')[0]?.id)){
					this.clockType = '暂停';
					if(this.timer){
						clearInterval(this.timer)
					}
					this.changeClockTime()
				} else if (list.includes(this.clockTypeList.filter(item=>item.typeCode==='暂停')[0]?.id) && list.includes(this.clockTypeList.filter(item=>item.typeCode==='RESUME')[0]?.id) && !list.includes(this.clockTypeList.filter(item=>item.typeCode==='CLOCK_OUT')[0]?.id)){
					this.clockType = '继续';
					this.timer = setInterval(this.changeClockTime,1000)
				} else {
					this.clockType = '签出';
					this.timer = setInterval(this.changeClockTime,1000)
				}
			},
			
			//计算时间
			changeClockTime(){
				let startTime = '';
				// 结束时间(当前时间)
				let endTime = moment().format("YYYY-MM-DD HH:mm:ss")
				// 计算两个时间相差秒数(时间差单位可以是years,months,days,minutes,seconds)
				let timeDiff = '';
				if(this.clockType === '签出' || this.clockType==='结束'){
					startTime = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='签入')[0]?.id)[0]?.clockTime || '';
					
					timeDiff = moment(endTime).diff(moment(startTime), "seconds");

				}
				if(this.clockType === '暂停'){
					startTime = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='签入')[0]?.id)[0]?.clockTime || '';
					endTime = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='暂停')[0]?.id)[0]?.clockTime || '';
					timeDiff = moment(endTime).diff(moment(startTime), "seconds");
				}
				if(this.clockType === '继续'){
					let startA = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='签入')[0]?.id)[0]?.clockTime || '';
					let endA = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='暂停')[0]?.id)[0]?.clockTime || '';
					let endB = moment().format("YYYY-MM-DD HH:mm:ss");
					let timeDiffA = moment(endA).diff(moment(startA), "seconds");
					timeDiff = timeDiffA + moment(endB).diff(moment(endA), "seconds");
				}
				// if(this.clockType === '结束'){
				// 	let startA = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='签入')[0]?.id)[0]?.clockTime || '';
				// 	let endA = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='暂停')[0]?.id)[0]?.clockTime || '';
				// 	let startB = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='继续')[0]?.id)[0]?.clockTime || '';
				// 	let endB = this.todayClock.list.filter(item=>item.clockType==this.clockTypeList.filter(item=>item.typeName==='签出')[0]?.id)[0]?.clockTime || '';
				// 	if(endA && endA!==''){
				// 		let timeDiffA = moment(endA).diff(moment(startA), "seconds");
				// 		timeDiff = timeDiffA + moment(endB).diff(moment(startB), "seconds");
				// 	}else{
				// 		console.log(766)
				// 		timeDiff = moment(endB).diff(moment(startA), "seconds");
				// 	}
				// }
				this.clockTime.hour =Math.floor(timeDiff / 3600) >= 10 ? Math.floor(timeDiff / 3600) : "0" + Math.floor(timeDiff / 3600);
				timeDiff -= 3600 * this.clockTime.hour;
				this.clockTime.minutes = Math.floor(timeDiff / 60) >= 10 ? Math.floor(timeDiff / 60) : "0" + Math.floor(timeDiff / 60);
				timeDiff -= 60 * this.clockTime.minutes;
				this.clockTime.seconds = Math.round(timeDiff) >= 10 ? Math.round(timeDiff) : "0" + Math.round(timeDiff);
				
			},
			
			// //获取门店信息
			// async getStoreInfo(){
			// 	let params = {
			// 		orgId: this.$userInfo.orgId
			// 	};
			// 	const res = await uni.$u.http.post('/api/clock/clock/org/info',params);
			// 	console.log('store',res)
			// },
			
			//改变打卡选择弹窗显隐
			changeShow(value,type){
				this.clockTypeShow = value;

				if(type==='签出'){
					this.clockInfo = this.clockTypeList.filter(item=>item.typeCode === 'CLOCK_OUT')[0] || {};
					this.changeClockShow(true);
				}else{
					// 暂停
					this.clockInfo = this.clockTypeList.filter(item=>item.typeCode === 'CLOCK_IN_RESUME')[0] || {};
					// 获取手机是否有定位权限
					this.getLimits();
				}
				
			},
			
			//改变提示弹窗显隐
			changeToastShow(value){
				this.toastShow = value;
			},
			
			//改变签出弹窗的显隐
			changeClockShow(value,type){
				this.clockOutShow = value;
				if(type==='confirm'){
					//获取手机是否有定位权限
					this.getLimits();
				}
			},
			
			//点击打卡
			getClockChange(){
				if(this.clockType === '签入'){
					console.log(555)
					this.getClockSattus();
					this.clockInfo = this.clockTypeList.filter(item=>item.typeName === this.clockType)[0] || {};
					
					//获取手机是否有定位权限
					// this.getLimits();
				}
				if(this.clockType === '签出'){
					this.clockTypeShow = true
				}
				if(this.clockType === '暂停'){
					this.clockInfo = this.clockTypeList.filter(item=>item.typeName === '继续')[0] || {};
					
					//获取手机是否有定位权限
					this.getLimits();
				}
				if(this.clockType === '继续'){
					this.clockInfo = this.clockTypeList.filter(item=>item.typeName === '签出')[0] || {};
					this.changeClockShow(true);
				}
			},
			
		
			
			//获取手机是否有定位权限
			getLimits(){
				let that = this;
				uni.getSystemInfo({
					success(res) {
						let locationEnabled = res.locationEnabled; //判断手机定位服务是否开启
						let locationAuthorized = res.locationAuthorized; //判断定位服务是否允许微信授权
						console.log('locationEnabled', locationEnabled)
						console.log('locationAuthorized', locationAuthorized)
						if(locationEnabled){

							uni.authorize({
							    //授权请求窗口
							    scope: "scope.userLocation", //授权的类型
							    success: (res) => {

									//获取定位信息
									that.getLoactionInfo();
							    },
								fail: (err) => {
									console.log('err',err)
								}
							})	
						}else{
							uni.showToast({
							    title: "请打开手机定位权限",
							    icon: "none",
							});
						}
					}
				})
			},
			
			//获取定位信息的经纬度
			getLoactionInfo(){
				let that = this;
				uni.getLocation({
					type: 'gcj02',
					altitude: true,
					geocode: true,
					maximumAge: 3000,
					enableHighAccuracy: true,
					success: function (res) {
						console.log('location',res);
						that.latitude = res.latitude;
						that.longitude = res.longitude;
						let dis = that.getDistance(0,0,that.latitude,that.longitude)
						//如果打卡地点超出距离
						// if(dis < that.todayClock.errorDistance){
						// 	that.toastTitle = 'You are not in the clocking range!';
						// 	that.toastContent = 'Click heare to relocate';
						// 	that.toastType = 'warning';
						// 	that.changeToastShow(true);
						// 	return;
						// }
						
						//调用打卡接口
						that.getClockSattus().then(()=>{
							that.getTodayClock();
						})

					}
				})
			},
			
			//打卡
			async getClockSattus(){
				let params = {
					clockOrgId: this.$userInfo.orgId,
					clockTime: `${moment().format("YYYY-MM-DD")}T${moment().format("HH:mm:ss")}${this.$timezoneOffset}`,
					clockType: this.clockInfo.id,
					clockTypeId: 1,
					errorDistance: 0,
					latitude: this.latitude||1,
					longitude: this.longitude||2
				};
				const res = await uni.$u.http.post('/api/clock/saveOrUpdate',params);
				this.toastTitle = 'Clock in successfully!';
				this.toastContent = '';
				this.toastType = 'success'
				this.changeToastShow(true);
			},
			
			//获取距离
			getDistance(lat1, lng1, lat2, lng2){
				let radLat1 = lat1 * Math.PI / 180.0;
				let radLat2 = lat2 * Math.PI / 180.0;
				let a = radLat1 - radLat2;
				let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
				let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
				s = s * 6378.137;
				s = Math.round(s * 10000) ;
				console.log('s',s)
				return s 
			}
			
		}
	}
</script>



<style lang="scss" scoped>
	.title-text {
		font-weight: bold;
		font-size: 38rpx;
	}
	.out-confirm-container {
		width: 500rpx;
	}
	.clock {
		height: 100vh;
		text-align: center;
		margin: auto;
		overflow: hidden;
		background-color: #f2f2f2;
		.clock-content-box{
			box-sizing: border-box;
			padding: 180rpx 20rpx 40rpx 20rpx ;
			height: calc(100vh - 40rpx);
		}
		.clock-content-part{
			overflow: hidden;
			position: relative;
			box-sizing: border-box;
			// margin: 100rpx 20rpx 40rpx 20rpx ;
			// height: calc(100vh - 220rpx);
			height: 100%;
			background-color: white;
			border-radius: 14rpx;
		}
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
			padding: 80rpx 0 0 0;
			// background-color: palegoldenrod;
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
		
		.navbar-left{
			display: flex;
			align-items:center;
			font-size: 30rpx;
			color: red;
			::v-deep .u-icon__icon{
				font-size: 32rpx !important;
				margin-top: 4rpx;
				margin-right: 20rpx;
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
			border-radius: 50rpx;
			background-color: #41b6e6;
			color: white;
			text-align: center;
			line-height: 100rpx;
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
		.toast-content{
			box-sizing: border-box;
			padding: 40rpx 40rpx;
			.toast-title{
				font-size: 28rpx;
			}
			.toast-text{
				margin-top: 30rpx;
				font-size: 30rpx;
				color: #41b6e6;
			}
		}
		.toast-button{
			padding: 40rpx 40rpx;
			display: flex;
			align-items: center;
			justify-content: center;
		}
	}
</style>