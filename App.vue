<script>
	import Vue from 'vue'
	export default {
		onLaunch: function() {
			uni.getSystemInfo({
				success: function(e) {
					Vue.prototype.statusBar = e.statusBarHeight
					console.log(e.statusBarHeight)
					// #ifndef MP
					if (e.platform == 'android') {
						Vue.prototype.customBar = e.statusBarHeight + 50
					} else {
						Vue.prototype.customBar = e.statusBarHeight + 45
					}
					// #endif
				}
			})
		},
		onShow: function() {

		},
		onHide: function() {

		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/uni_modules/uview-ui/index.scss";

	uni-page-body,
	html,
	body {
		height: 100%;
	}
</style>