import { CircularProgress } from '@heroui/react'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { APP_PAGES } from '../config/pageConfig'
import { authManager } from '../services/auth-token'

export const MainLayout = () => {
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		const fetchToken = async () => {
			const token = await authManager.refreshToken()
			setToken(token)
			setLoading(false)
		}

		fetchToken()
	}, [])

	if (loading) {
		return (
			<section className='w-full h-screen flex justify-center items-center'>
				<CircularProgress />
			</section>
		)
	}
	if (token) {
		return <Navigate to={APP_PAGES.WORKSPACE.HOME} />
	}
	return <Outlet />
}
