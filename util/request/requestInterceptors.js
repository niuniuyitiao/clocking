import { getToken } from "./../index.js";

module.exports = (vm) => {
    uni.$u.http.interceptors.request.use((config) => { // 可使用async await 做异步操作
        // 初始化请求拦截器时，会执行此方法，此时data为undefined，赋予默认{}
		// 可以在此通过vm引用vuex中的变量，具体值在vm.$store.state中
        config.data = config.data || {};
		config.header.Authorization = 'Bearer '+(getToken() || '');
		config.header['X-Lang'] = vm.$store.state.$userInfo.language||'';
		config.header['X-Time-Zone'] = vm.$store.state.$userInfo.timeZone||'';
		console.log(777888, config)
        return config;
    }, (config) => {
		// 可使用async await 做异步操作
		Promise.reject(config);
	});
}
