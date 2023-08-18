/**
 * 响应拦截
 * @param {Object} http 
 */
module.exports = (vm) => {
    uni.$u.http.interceptors.response.use((response) => { /* 对响应成功做点什么 可使用async await 做异步操作*/
        const data = response.data
        // 自定义参数
        const custom = response.config?.custom
		console.log(8899, data.code)
        if (data.code !== 200) { // 服务端返回的状态码不等于200，则reject()
            // 如果没有显式定义custom的toast参数为false的话，默认对报错进行toast弹出提示
            if (custom.toast !== false) {
                uni.$u.toast(data.message)
            }
            // 如果需要catch返回，则进行reject
            if (custom?.catch) {
				console.log(789999);
                return Promise.reject(data)
            } else {
                // 否则返回一个pending中的promise
                return new Promise(() => { })
            }
        }
        return data.data || {}
    }, (response) => { /*  对响应错误做点什么 （statusCode !== 200）*/
	console.log(77, response)
		if (response.statusCode === 401 ||( response.data&&response.data.code===401)) {
			// token过期 使用refreshToken刷新token
			console.log(uni.getStorageSync('refreshToken'))
		}
        return Promise.reject(response)
    })
}