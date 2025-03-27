import { CircularProgress, Image } from '@heroui/react'
import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

import { LogoHandler } from '../components/logo/logoHadler'
import { APP_PAGES } from '../config/pageConfig'
import { authManager } from '../services/auth-token'

export const AuthLayout = () => {
	const [token, setToken] = useState(null)
	const [loading, setLoading] = useState(true)
	useEffect(() => {
		const fetchToken = async () => {
			const token = await authManager.refreshToken()
			setToken(token)
			setLoading(false)
			// console.log(token)
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
	if (token) {
		return <Navigate to={APP_PAGES.WORKSPACE.HOME} />
	}
	return (
		<div className='w-full h-screen flex  justify-center mt-20'>
			<div className='w-full flex flex-col gap-12 items-center'>
				<LogoHandler>
					<Image
						className='w-36'
						src='/logoFullBlack.svg'
						alt='logo'
					/>
				</LogoHandler>
				<Outlet />
			</div>
		</div>
	)
}
