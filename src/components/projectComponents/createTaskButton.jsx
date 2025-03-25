import { Button, Input } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { groupService } from '../../services/groups'

export const CreateTaskButton = ({ groupId, projectId }) => {
	const { openDrawer } = useDrawer()

	const [isCreating, setIsCreating] = useState(false)
	const [name, setName] = useState('')
	const inputRef = useRef(null)

	useEffect(() => {
		if (isCreating && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const queryClient = useQueryClient()
	const { mutate } = useMutation({
		mutationKey: ['create-task'],
		mutationFn: data => groupService.createGroupTasks(groupId, data),
		onSuccess(data) {
			console.log(data)
			queryClient.refetchQueries({
				queryKey: [`group/${groupId}/tasks`],
				type: 'active'
			})
			openDrawer(data, data.id)
		},
		onSettled() {
			setIsCreating(false)
			setName('')
		}
	})

	const handleCreateTask = () => {
		setIsCreating(true)
	}

	const handleBlurCreateTask = () => {
		if (name.length === 0) {
			setIsCreating(false)
			setName('')
			return
		}
		mutate({ title: name })
	}

	const handleNameChange = value => {
		setName(value)
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleBlurCreateTask()
		}
	}

	return (
		<div className='w-full'>
			{isCreating ? (
				<div className='w-full'>
					<Input
						variant='bordered'
						value={name}
						ref={inputRef}
						fullWidth
						onBlur={handleBlurCreateTask}
						onValueChange={handleNameChange}
						onKeyDown={handleKeyDown}
					/>
				</div>
			) : (
				<div className='w-full'>
					<Button
						className='border-0'
						startContent={<Plus size={18} />}
						fullWidth
						variant={'faded'}
						onPress={handleCreateTask}
					>
						Добавить задачу
					</Button>
				</div>
			)}
		</div>
	)
}
