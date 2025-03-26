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

import { useProjectElements } from '../../../hooks/contexts/useProjectElements'
import { projectService } from '../../../services/projects'

const DeleteGroupModal = ({ isOpen, onOpenChange, data, projectId }) => {
	const [loading, setLoading] = useState(false)
	const { removeGroup } = useProjectElements()
	// console.log(data)
	const createProject = useMutation({
		mutationKey: ['create-project'],
		mutationFn: () => projectService.deleteGroup(data.id, projectId),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			onOpenChange(false)
			removeGroup(data.id)
		},
		onError() {
			addToast({ title: 'Ошибка при удалении группы', color: 'danger' })
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
							Удаление группы
						</ModalHeader>
						<ModalBody>
							<div className='flex flex-col gap-4 w-full'>
								<p>
									Вы уверены, что хотите удалить группу{' '}
									<span className='font-semibold'>{data.name}</span>?
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

export default DeleteGroupModal
