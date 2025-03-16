'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader
} from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

import { projectService } from '../../../services/projects'

const DeleteGroupModal = ({ isOpen, onOpenChange, name, id, projectId }) => {
	const queryClient = useQueryClient()
	const [loading, setLoading] = useState(false)

	const createProject = useMutation({
		mutationKey: ['create-project'],
		mutationFn: () => projectService.deleteGroup(id, projectId),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			onOpenChange(false)
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/groups`],
				type: 'active'
			})
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = () => {
		createProject.mutate()
	}

	return (
		<Modal
			isDismissable={false}
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className='p-2'
			hideCloseButton={true}
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='font-primary text-xl font-semibold'>
							Удаление группы
						</ModalHeader>
						<ModalBody>
							<div className='flex flex-col gap-4 w-full'>
								<p>
									Вы уверены, что хотите удалить группу{' '}
									<span className='font-semibold'>{name}</span>?
								</p>
								<p>
									При удалении группы все задачи, связанные с ней, будут
									удалены.
								</p>
							</div>
						</ModalBody>
						<ModalFooter className='w-full gap-3'>
							<Button
								radius='sm'
								className='font-medium'
								size='md'
								color='primary'
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
								Удалить
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default DeleteGroupModal
