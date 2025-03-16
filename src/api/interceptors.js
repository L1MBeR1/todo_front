import axios from 'axios'

import { authManager } from '../services/auth-token'

import { errorCatch } from './error'

const options = {
	baseURL: import.meta.env.VITE_BACK_END_URL,
	headers: {
		'Content-Type': 'application/json'
	},
	withCredentials: true
}

const axiosClassic = axios.create(options)
const axiosWithAuth = axios.create(options)

axiosWithAuth.interceptors.request.use(
	async config => {
		const accessToken = await authManager.ensureValidToken()
		if (accessToken) {
			if (config && config.headers) {
				config.headers.Authorization = `Bearer ${accessToken}`
			}
		} else {
			console.log('No valid token available, clearing tokens')
			authManager.clearToken()
		}
		console.log(config)
		return config
	},
	error => {
		console.error('Request Error:', error)
		return Promise.reject(error)
	}
)

axiosWithAuth.interceptors.response.use(
	response => {
		console.log('Response:', {
			status: response.status,
			data: response.data,
			headers: response.headers
		})
		return response
	},
	async error => {
		const originalRequest = error.config

		console.error('Error Response:', {
			status: error?.response?.status,
			data: error?.response?.data,
			message: error.message
		})

		console.log(1)

		if (
			(error?.response?.status === 401 ||
				errorCatch(error) === 'jwt expired' ||
				errorCatch(error) === 'jwt must be provided') &&
			originalRequest &&
			!originalRequest._isRetry
		) {
			originalRequest._isRetry = true

			const newAccessToken = await authManager.ensureValidToken()

			if (newAccessToken) {
				console.log('Token refreshed successfully, retrying original request')
				originalRequest.headers.Authorization = `Bearer ${newAccessToken}`
				return axiosWithAuth.request(originalRequest)
			} else {
				console.log('Failed to refresh token, redirecting to login')
				authManager.clearToken()

				// if (typeof window !== 'undefined') {
				// 	window.location.href = '/login'
				// }

				throw error
			}
		}

		throw error
	}
)

export { axiosClassic, axiosWithAuth }
