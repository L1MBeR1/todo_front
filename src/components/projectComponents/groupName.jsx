import { Input } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { projectService } from '../../services/projects'

export const GroupName = ({ name, projectId, id }) => {
	const [isChangingName, setIsChangingName] = useState(false)
	const [newName, setNewName] = useState('')
	const inputRef = useRef(null)

	const handleBlur = () => {
		if (newName.length === 0 || newName === name) {
			setIsChangingName(false)
			setNewName('')
			return
		}
		mutate()
		return
	}

	useEffect(() => {
		if (isChangingName && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isChangingName])

	const handleChange = value => {
		setNewName(value)
	}

	const queryClient = useQueryClient()
	const { mutate } = useMutation({
		mutationKey: ['update-group-name'],
		mutationFn: () =>
			projectService.updateGroup(id, projectId, { name: newName }),
		onSuccess(response) {
			console.log(response)
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/groups`],
				type: 'active'
			})
		},
		onSettled() {
			setIsChangingName(false)
			setNewName('')
		}
	})

	return (
		<>
			{isChangingName && projectId ? (
				<Input
					radius='sm'
					variant='bordered'
					value={newName}
					ref={inputRef}
					onBlur={() => {
						handleBlur()
					}}
					onValueChange={value => {
						handleChange(value)
					}}
				/>
			) : (
				<p
					className='font-semibold cursor-pointer select-none'
					onClick={() => {
						setIsChangingName(true)
						setNewName(name)
					}}
				>
					{name}
				</p>
			)}
		</>
	)
}
