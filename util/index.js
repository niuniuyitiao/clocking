export const getToken = () => {
	const token = uni.getStorageSync('accessToken');
	return token || '';
}

export const getRefreshToken = () => {
	const refreshToken = uni.getStorageSync('refreshToken');
	return refreshToken || '';
}