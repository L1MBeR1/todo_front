import { axiosClassic } from '../api/interceptors'

import { authManager } from './auth-token'

export const authService = {
	async login(data) {
		const response = await axiosClassic.post('/auth/login', {
			...data
		})

		console.log(response)
		if (response.data.accessToken) {
			authManager.setToken(response.data.accessToken)
		}

		return response
	},
	async register(data) {
		console.log(data)
		const response = await axiosClassic.post('/auth/register', {
			...data
		})
		console.log(response.data)
		if (response.data.accessToken) {
			authManager.setToken(response.data.accessToken)
		}

		return response
	},

	async getNewTokens() {
		console.log('refresh')
		const response = await axiosClassic.post('/auth/refresh')
		return response
	}
}
