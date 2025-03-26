import { Textarea } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { projectService } from '../../services/projects'

export const DrawerTaskDescription = ({ description, projectId, id }) => {
	const [isChangingDescription, setIsChangingDescription] = useState(false)
	const [newDescription, setNewDescription] = useState('')
	const inputRef = useRef(null)

	const handleBlur = () => {
		if (newDescription.length === 0 || newDescription === description) {
			setNewDescription(false)
			newDescription('')
			return
		}
		mutate()
		return
	}

	useEffect(() => {
		if (isChangingDescription && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isChangingDescription])

	const handleChange = value => {
		setNewDescription(value)
	}

	const queryClient = useQueryClient()
	const { mutate } = useMutation({
		mutationKey: ['update-task-description'],
		mutationFn: () =>
			projectService.updateGroup(id, projectId, {
				description: newDescription
			}),
		onSuccess(response) {
			console.log(response)
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/groups`],
				type: 'active'
			})
		},
		onSettled() {
			setIsChangingDescription(false)
			setNewDescription('')
		}
	})

	return (
		<>
			{isChangingDescription ? (
				<Textarea
					radius='sm'
					variant='bordered'
					value={newDescription}
					ref={inputRef}
					onBlur={() => {
						handleBlur()
					}}
					placeholder='Введите описание задачи'
					onValueChange={value => {
						handleChange(value)
					}}
				/>
			) : (
				<p
					className='font-medium cursor-pointer select-none text-xl'
					onClick={() => {
						setIsChangingDescription(true)
						setNewDescription(newDescription)
					}}
				>
					{newDescription}
				</p>
			)}
		</>
	)
}
