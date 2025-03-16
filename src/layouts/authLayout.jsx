import { Outlet } from 'react-router-dom'

import { LogoHandler } from '../components/logo/logoHadler'

export const AuthLayout = () => {
	return (
		<div className='w-full h-screen flex  justify-center mt-20'>
			<div className='w-full flex flex-col gap-4 items-center'>
				<LogoHandler>
					<span>LOgo</span>
				</LogoHandler>
				<Outlet />
			</div>
		</div>
	)
}
