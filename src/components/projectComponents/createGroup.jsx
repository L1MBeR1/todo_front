import { Button, Input, addToast } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { projectService } from '../../services/projects'

export const CreateGroup = ({ projectId }) => {
	const [isCreating, setIsCreating] = useState(false)
	const [name, setName] = useState('')
	const inputRef = useRef(null)

	const { addGroup } = useProjectElements()

	useEffect(() => {
		if (isCreating && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isCreating])

	const { mutate } = useMutation({
		mutationKey: ['create-group'],
		mutationFn: data => projectService.createGroup(projectId, data),
		onSuccess(data) {
			addGroup(data)
		},
		onError() {
			addToast({ title: 'Ошибка при создании группы', color: 'danger' })
		},
		onSettled() {
			setIsCreating(false)
			setName('')
		}
	})

	const handleCreateGroup = () => {
		setIsCreating(true)
	}

	const handleBlurCreateGroup = () => {
		if (name.length === 0) {
			setIsCreating(false)
			setName('')
			return
		}
		mutate({ name, projectId })
	}

	const handleNameChange = value => {
		setName(value)
	}

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			handleBlurCreateGroup()
		}
	}

	return (
		<div className='min-w-60 pr-8 h-48'>
			{isCreating ? (
				<div className='w-full'>
					<Input
						aria-label='name'
						maxLength={150}
						variant='bordered'
						value={name}
						ref={inputRef}
						onBlur={handleBlurCreateGroup}
						onValueChange={handleNameChange}
						onKeyDown={handleKeyDown}
					/>
				</div>
			) : (
				<div className='w-full'>
					<Button
						radius='sm'
						className='justify-start'
						startContent={<Plus size={18} />}
						fullWidth
						variant={'light'}
						onPress={handleCreateGroup}
					>
						Добавить группу
					</Button>
				</div>
			)}
		</div>
	)
}
