import Vue from 'vue'
import App from './App'

// vuex
import store from './store'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'

import messages from './locale/index'
console.log(88888888, uni.getStorageSync('language'))
let i18nConfig = {
  locale: uni.getStorageSync('language')||'en_US',
  messages
}
import VueI18n from 'vue-i18n'
Vue.use(VueI18n)
const i18n = new VueI18n(i18nConfig)

Vue.prototype.$store = store

Vue.config.productionTip = false

App.mpType = 'app'
Vue.use(uView)

// #ifdef MP

// #endif

const app = new Vue({
	 i18n,
    store,
    ...App
})
i18n.vm.$watch('locale', function(val) {
    app.globalData.locale = val;
});
// 引入请求封装
require('./util/request/index')(app)

app.$mount()
