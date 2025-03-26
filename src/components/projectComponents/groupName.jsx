import { Input } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { useEffect, useRef, useState } from 'react'

import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { projectService } from '../../services/projects'

export const GroupName = ({ name, projectId, id, isList = false }) => {
	const [isChangingName, setIsChangingName] = useState(false)
	const [newName, setNewName] = useState('')
	const inputRef = useRef(null)
	const { updateGroup } = useProjectElements()

	const handleBlur = () => {
		if (newName.length === 0 || newName === name) {
			setIsChangingName(false)
			setNewName('')
			return
		}
		mutate()
		return
	}

	const handleKeyDown = e => {
		if (e.key === 'Enter') {
			e.preventDefault()
			handleBlur()
		}
		if (e.key === 'Escape') {
			setIsChangingName(false)
			setNewName('')
		}
	}

	useEffect(() => {
		if (isChangingName && inputRef.current) {
			inputRef.current.focus()
		}
	}, [isChangingName])

	const handleChange = value => {
		setNewName(value)
	}

	const { mutate } = useMutation({
		mutationKey: ['update-group-name'],
		mutationFn: () =>
			projectService.updateGroup(id, projectId, { name: newName }),
		onSuccess(data) {
			console.log(data)
			updateGroup(data.id, { name: data.name })
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
					onKeyDown={handleKeyDown}
					onValueChange={value => {
						handleChange(value)
					}}
					maxLength={150}
				/>
			) : (
				<p
					className={`font-semibold cursor-pointer select-none break-words ${isList ? 'max-w-[80%]' : 'max-w-56'}`}
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
