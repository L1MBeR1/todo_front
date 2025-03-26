import { Button, Image } from '@heroui/react'
import { ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../config/pageConfig'

export const MainPage = () => {
	const navigate = useNavigate()
	return (
		<div
			className='flex flex-col px-16 w-screen h-screen justify-between overflow-hidden pb-16'
			style={{
				backgroundImage: "url('/background.avif')"
			}}
		>
			<header className='w-full flex justify-between py-5 items-center'>
				<Image
					className='w-40'
					src='/logoFullBlack.svg'
					alt='logo'
				/>

				<Button
					radius='sm'
					className='bg-background2 text-white font-semibold'
					onPress={() => {
						navigate(APP_PAGES.LOGIN)
					}}
				>
					Войти
				</Button>
			</header>
			<main className='w-full flex flex-row justify-between'>
				<div className='flex flex-col w-4/6 gap-10'>
					<h1 className='text-[100px] font-bold text-white leading-none'>
						Ваши проекты — под четким контролем
					</h1>
					<div>
						<p className='text-2xl text-white max-w-full text-wrap'>
							Перетаскивайте задачи, настраивайте этапы и контролируйте сроки.
						</p>
						<p className='text-2xl text-white max-w-full text-wrap'>
							Интуитивный инструмент для тех, кто ценит порядок и результат
						</p>
					</div>
				</div>
				<div className='flex items-end justify-end'>
					<Button
						className='border-2 border-white rounded-lg flex flex-row items-center justify-center h-36 text-white w-96 hover:bg-default/20'
						variant='bordered'
						endContent={<ChevronRight size={50} />}
						onPress={() => {
							navigate(APP_PAGES.LOGIN)
						}}
					>
						<p className='text-2xl font-semibold text-white'>Создать проект</p>
					</Button>
				</div>
			</main>
		</div>
	)
}
