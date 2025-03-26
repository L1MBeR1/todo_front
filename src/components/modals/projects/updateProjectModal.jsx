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
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { projectService } from '../../../services/projects'

export const UpdateProjectModal = ({
	isOpen,
	onOpenChange,
	id,
	name,
	description
}) => {
	const {
		handleSubmit,
		register,
		reset,
		formState: { errors }
	} = useForm({
		defaultValues: { name, description }
	})

	const queryClient = useQueryClient()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (isOpen) {
			reset({ name, description })
		}
	}, [isOpen, name, description, reset])

	const updateProject = useMutation({
		mutationKey: ['update-project'],
		mutationFn: data => projectService.updateProject(id, data),
		onMutate() {
			setLoading(true)
		},
		onSuccess() {
			onOpenChange(false)
			queryClient.refetchQueries({ queryKey: ['my-projects'], type: 'active' })
			queryClient.refetchQueries({
				queryKey: [`project/${id}`],
				type: 'active'
			})
		},
		onSettled() {
			setLoading(false)
		}
	})

	const onSubmit = data => {
		// console.log(data)
		updateProject.mutate(data)
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
							Изменение проекта
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
										isInvalid={!!errors.name}
										errorMessage={errors.name?.message}
										{...register('name', {
											required: 'Название обязательно',
											value: name
										})}
									/>
									<Textarea
										radius='sm'
										fullWidth={true}
										label='Описание'
										variant='bordered'
										maxLength={200}
										maxRows={5}
										placeholder='Введите описание проекта'
										{...register('description', {
											value: description
										})}
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
									Сохранить
								</Button>
							</ModalFooter>
						</form>
					</>
				)}
			</ModalContent>
		</Modal>
	)
}
