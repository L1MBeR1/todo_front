'use client'

import {
	Button,
	Input,
	Modal,
	ModalBody,
	ModalContent,
	ModalFooter,
	ModalHeader,
	Textarea
} from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'

import { APP_PAGES } from '../../../config/pageConfig'
import { projectService } from '../../../services/projects'

const CreateProjectModal = ({ isOpen, onOpenChange }) => {
	const { handleSubmit, register, reset } = useForm()
	const queryClient = useQueryClient()
	const [loading, setLoading] = useState(false)

	const navigate = useNavigate()

	const createProject = useMutation({
		mutationKey: ['create-project'],
		mutationFn: data => projectService.createProject(data),
		onMutate() {
			setLoading(true)
		},
		onSuccess(data) {
			// console.log(data)
			reset()
			onOpenChange(false)
			queryClient.refetchQueries({ queryKey: ['my-projects'], type: 'active' })
			navigate(`${APP_PAGES.WORKSPACE.PROJECT}/${data.id}`)
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = data => {
		// console.log(data)
		createProject.mutate(data)
	}

	return (
		<Modal
			isOpen={isOpen}
			onOpenChange={onOpenChange}
			className='p-2 '
			hideCloseButton={true}
		>
			<ModalContent>
				{onClose => (
					<>
						<ModalHeader className='font-primary text-xl font-semibold'>
							Создание проекта
						</ModalHeader>
						<form
							className='flex flex-col gap-4 w-full'
							onSubmit={handleSubmit(onSubmit)}
						>
							<ModalBody>
								<div className='flex flex-col gap-4 w-full'>
									<Input
										radius='sm'
										label='Название проекта'
										placeholder='Введите название проекта'
										variant='bordered'
										required
										maxLength={150}
										{...register('name', { required: 'Название обязательно' })}
									/>
									<Textarea
										radius='sm'
										fullWidth={true}
										label='Описание'
										variant='bordered'
										maxLength={200}
										maxRows={5}
										placeholder='Введите описание проекта'
										{...register('description')}
									/>
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
									color='primary'
									type='submit'
									size='md'
									isLoading={loading}
								>
									Создать
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}

export default CreateProjectModal
