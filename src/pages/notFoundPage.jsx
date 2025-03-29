import { Button, Image } from '@heroui/react'
import { useNavigate } from 'react-router-dom'

import { LogoHandler } from '../components/logo/logoHadler'
import { APP_PAGES } from '../config/pageConfig'

export const NotFoundPage = () => {
	const navigate = useNavigate()
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
				<div className='flex flex-col items-center gap-3'>
					<p className='text-[200px] font-semibold text-primary leading-none'>
						404
					</p>
					<p
						className='text-xl'
						size='lg'
					>
						Ой-ой! Кажется, мы потерялись…
					</p>
					<Button
						className='font-semibold'
						radius='sm'
						variant='light'
						onPress={() => {
							navigate(APP_PAGES.WORKSPACE.HOME)
						}}
					>
						Вернуться назад
					</Button>
				</div>
			</div>
		</div>
	)
}
