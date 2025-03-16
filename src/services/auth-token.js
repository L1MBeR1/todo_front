import { jwtDecode } from 'jwt-decode'

import { authService } from './auth'

export const EnumTokens = {
	ACCESS_TOKEN: 'accessToken',
	REFRESH_TOKEN: 'refreshToken'
}

class AuthManager {
	constructor() {
		this.accessToken = null
		this.isRefreshing = false
		this.refreshPromise = null
	}

	setToken(token) {
		this.accessToken = token
		console.log(this.accessToken)
		return
	}

	clearToken() {
		this.accessToken = null
		return
	}

	isTokenExpired(token) {
		const decoded = jwtDecode(token)
		const expirationTime = decoded.exp * 1000
		return Date.now() > expirationTime
	}

	async ensureValidToken() {
		if (!this.accessToken || this.isTokenExpired(this.accessToken)) {
			return this.refreshToken()
		}
		return this.accessToken
	}

	async refreshToken() {
		if (this.isRefreshing && this.refreshPromise) {
			return this.refreshPromise
		}

		this.isRefreshing = true

		this.refreshPromise = authService
			.getNewTokens()
			.then(response => {
				const newToken = response.data.accessToken
				this.accessToken = newToken
				return newToken
			})
			.catch(() => {
				this.clearToken()
				return null
			})
			.finally(() => {
				this.isRefreshing = false
				this.refreshPromise = null
			})

		return this.refreshPromise
	}
}

export const authManager = new AuthManager()
