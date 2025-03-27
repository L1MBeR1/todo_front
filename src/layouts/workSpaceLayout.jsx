import { CircularProgress } from '@heroui/react'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { WorkSpaceSidebar } from '../components/sidebars/workspaceSidebar'
import { APP_PAGES } from '../config/pageConfig'
import { authManager } from '../services/auth-token'

export const WorkSpaceLayout = () => {
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
				<CircularProgress aria-label='Loading...' />
			</section>
		)
	}
	if (!token) {
		return <Navigate to={APP_PAGES.LOGIN} />
	}
	return (
		<main className='flex flex-row w-full h-screen'>
			<WorkSpaceSidebar />
			<Outlet />
		</main>
	)
}
