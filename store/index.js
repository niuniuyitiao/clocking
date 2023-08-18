import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

// Vuex.Store 构造器选项
const store = new Vuex.Store({
    // 为了不和页面或组件的data中的造成混淆，state中的变量前面建议加上$符号
    state: {
        // 用户信息
        $userInfo: {},
		$timezoneList: [],
		$timezoneOffset: '+08:00',
    },
	mutations: {
		SET_USER_INFO(state, data) {
			state.$userInfo = data;
		},
		SET_TIMEZONE_LIST(state, data) {
			state.$timezoneList = data;
			const userTimezone = state.$userInfo.timeZone;
			if (data && data.length) {
				for (let i=0; i++; i<data.length) {
					if (data[i].ianaTimezones.indexOf(userTimezone)>-1) {
						state.$timezoneOffset = data[i].offset;
						break;
					}
				}
			}
		},
	}
})

export default store
