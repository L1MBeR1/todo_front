'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../../config/pageConfig'
import { authService } from '../../../services/auth'

export const LogoutModal = ({ isOpen, onOpenChange }) => {
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()
	const { mutate } = useMutation({
		mutationKey: ['logout'],
		mutationFn: () => authService.logout(),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			navigate(APP_PAGES.LOGIN)
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = () => {
		mutate()
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className='p-2'
			hideCloseButton={true}
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='font-primary text-xl font-semibold'>
							Выход из аккаунта
						</ModalHeader>
						<ModalBody>
							<div className='flex flex-col gap-4 w-full'>
								<p>Вы уверены, что хотите выйти из аккаунта?</p>
							</div>
						</ModalBody>
						<ModalFooter className='w-full gap-3'>
							<Button
								radius='sm'
								className='font-medium'
								size='md'
								color='default'
								variant='flat'
								isDisabled={loading}
								onPress={onClose}
							>
								Назад
							</Button>
							<Button
								radius='sm'
								className='font-medium'
								color='danger'
								type='submit'
								size='md'
								isLoading={loading}
								onPress={() => {
									onSubmit()
								}}
							>
								Выйти
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
