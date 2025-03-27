import { Avatar, Button, CircularProgress, useDisclosure } from '@heroui/react'
import { LogOut } from 'lucide-react'

import useProfile from '../../hooks/user/useProfile'
import { LogoutModal } from '../modals/user/logoutModal'

export const SidebarProfile = () => {
	const { data, isLoading } = useProfile()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<LogoutModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
			<div className='flex flex-row justify-between max-w-full'>
				<div className='flex flex-row gap-2 '>
					<Avatar radius='sm' />

					{isLoading ? (
						<CircularProgress aria-label='Loading...' />
					) : (
						<div className='flex flex-col text-white text-sm leading-tight py-0.5'>
							<p className='font-semibold truncate max-w-40'>{data.username}</p>
							<p className='truncate max-w-40 text-gray-300'>{data.email}</p>
						</div>
					)}
				</div>
				<div>
					<Button
						isIconOnly
						radius='sm'
						color='danger'
						variant='light'
						onPress={() => {
							onOpen()
						}}
					>
						<LogOut />
					</Button>
				</div>
			</div>
		</>
	)
}
