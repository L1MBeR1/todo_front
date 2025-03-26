import { HeroUIProvider, ToastProvider } from '@heroui/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { useHref, useNavigate } from 'react-router-dom'

const queryClient = new QueryClient()
export const Provider = ({ children }) => {
	const navigate = useNavigate()
	return (
		<QueryClientProvider client={queryClient}>
			<HeroUIProvider
				locale='ru-RU'
				navigate={navigate}
				useHref={useHref}
			>
				<ToastProvider
					toastOffset={30}
					placement='top-center'
					toastProps={{
						radius: 'sm',
						color: 'default',
						variant: 'flat',
						timeout: 4000
					}}
				/>
				<main className='light'>{children}</main>
				<ReactQueryDevtools initialIsOpen={false} />
			</HeroUIProvider>
		</QueryClientProvider>
	)
}
