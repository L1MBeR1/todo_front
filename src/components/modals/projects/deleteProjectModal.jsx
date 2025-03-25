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
import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../../config/pageConfig'
import { projectService } from '../../../services/projects'

export const DeleteProjectModal = ({ isOpen, onOpenChange, id }) => {
	const queryClient = useQueryClient()
	const [loading, setLoading] = useState(false)
	const navigate = useNavigate()

	const createProject = useMutation({
		mutationKey: [`delete-project/${id}`],
		mutationFn: () => projectService.deleteProject(id),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			onOpenChange(false)
			queryClient.refetchQueries({
				queryKey: [`my-projects`],
				type: 'active'
			})
			navigate(APP_PAGES.WORKSPACE.HOME)
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
							Удаление проекта
						</ModalHeader>
						<ModalBody>
							<div className='flex flex-col gap-4 w-full'>
								<p>Вы уверены, что хотите удалить проект?</p>
								<p>
									При удалении проекта все данные, связанные с ним, будут
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
