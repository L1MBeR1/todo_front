'use client'

import {
	Button,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	addToast
} from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { useDrawer } from '../../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../../hooks/contexts/useProjectElements'
import { groupService } from '../../../services/groups'

export const DeleteTaskModal = ({ isOpen, onOpenChange, data }) => {
	const [loading, setLoading] = useState(false)
	const { removeTask } = useProjectElements()
	const { closeDrawer } = useDrawer()

	// console.log(data)
	const createProject = useMutation({
		mutationKey: ['delete-task'],
		mutationFn: () => groupService.deleteTask(data.id, data.kanbanGroupId),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			onOpenChange(false)
			removeTask(data.kanbanGroupId, data.id)
			closeDrawer()
		},
		onError() {
			addToast({ title: 'Ошибка при удалении задачи', color: 'danger' })
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
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className='p-2'
			hideCloseButton={true}
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='font-primary text-xl font-semibold'>
							Удаление задачи
						</ModalHeader>
						<ModalBody>
							<div className='flex flex-col gap-0.5 w-full'>
								<p>Вы уверены, что хотите удалить задачу</p>
								<p className='max-w-full truncate'>
									<span className='font-semibold'>{data.title}</span> ?
								</p>
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
								Удалить
							</Button>
						</ModalFooter>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
