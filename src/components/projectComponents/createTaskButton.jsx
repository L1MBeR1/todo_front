import { Button, Input, addToast } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const CreateTaskButton = ({ groupId, isHovered }) => {
	const { openDrawer } = useDrawer()

	const [isCreating, setIsCreating] = useState(false)
	const [name, setName] = useState('')
	const { addTask } = useProjectElements()
	const inputRef = useRef(null)

	useEffect(() => {
		if (isCreating && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const { mutate } = useMutation({
		mutationKey: ['create-task'],
		mutationFn: data => groupService.createGroupTasks(groupId, data),
		onMutate() {},
		onSuccess(data) {
			console.log(data)
			addTask(groupId, data)

			openDrawer(data, data.id)
		},
		onError() {
			addToast({ title: 'Ошибка при создании задачи', color: 'danger' })
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
		mutate({ title: name, priority: 1 })
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
		<div className='w-full px-4'>
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
						maxLength={150}
					/>
				</div>
			) : (
				<div className={`w-full ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
					<Button
						radius='sm'
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
