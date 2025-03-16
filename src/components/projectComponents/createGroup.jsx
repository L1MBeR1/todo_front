import { Button, Input } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Plus } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { projectService } from '../../services/projects'

export const CreateGroup = ({ projectId }) => {
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
		mutationKey: ['create-group'],
		mutationFn: data => projectService.createGroup(projectId, data),
		onSuccess(response) {
			console.log(response)
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/groups`],
				type: 'active'
			})
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
						className='justify-start border-0'
						startContent={<Plus size={18} />}
						fullWidth
						variant={'faded'}
						onPress={handleCreateGroup}
					>
						Добавить группу
					</Button>
				</div>
			)}
		</div>
	)
}
