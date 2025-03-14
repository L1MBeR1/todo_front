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
					toastOffset={10}
					toastProps={{
						radius: 'md',
						color: 'default',
						variant: 'flat',
						timeout: 3000,
						classNames: {
							base: 'bg-background'
						}
					}}
				/>
				{children}
				<ReactQueryDevtools initialIsOpen={false} />
			</HeroUIProvider>
		</QueryClientProvider>
	)
}
