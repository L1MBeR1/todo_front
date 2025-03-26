import { Select, SelectItem, addToast } from '@heroui/react'
import { useMutation } from '@tanstack/react-query'
import { Flag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

const priorities = [
	{ key: '0', label: 'Низкий', color: 'text-secondary' },
	{ key: '1', label: 'Обычный', color: 'text-foreground' },
	{ key: '2', label: 'Высокий', color: 'text-danger' }
]

export const DrawerPriorityPicker = ({ selectedPriority }) => {
	const { drawerContent, setDrawerContent } = useDrawer()
	const { updateTask } = useProjectElements()

	const [value, setValue] = useState(new Set())
	const [selectedColor, setSelectedColor] = useState(priorities[1].color)

	useEffect(() => {
		const priorityKey = String(selectedPriority ?? 1)
		const priority =
			priorities.find(p => p.key === priorityKey) || priorities[1]

		setValue(new Set([priority.key]))
		setSelectedColor(priority.color)
	}, [selectedPriority])

	const updateTaskMutation = useMutation({
		mutationKey: ['update-task-priority'],
		mutationFn: newPriority =>
			groupService.updateTask(drawerContent.id, drawerContent.kanbanGroupId, {
				title: drawerContent.title,
				priority: Number(newPriority)
			}),
		onSuccess(data) {
			updateTask(data.kanbanGroupId, data.id, { priority: data.priority })
			setDrawerContent(prev => ({
				...prev,
				priority: data.priority
			}))
		},
		onError() {
			addToast({
				title: 'Ошибка при обновлении приоритета задачи',
				color: 'danger'
			})
		}
	})

	const handleSelectionChange = keys => {
		const selectedKey = [...keys][0]
		const priority = priorities.find(p => p.key === selectedKey)

		if (priority) {
			setValue(keys)
			setSelectedColor(priority.color)
			updateTaskMutation.mutate(priority.key)
		}
	}

	return (
		<Select
			selectionMode='single'
			className='w-full'
			selectedKeys={value}
			fullWidth
			items={priorities}
			onSelectionChange={handleSelectionChange}
			radius='sm'
			size='sm'
			startContent={
				<Flag
					size={20}
					className={selectedColor}
				/>
			}
			aria-label='Выберите приоритет'
			renderValue={() => {
				const selectedPriority = priorities.find(p => p.key === [...value][0])
				return selectedPriority ? selectedPriority.label : ''
			}}
		>
			{priorities.map(priority => (
				<SelectItem
					key={priority.key}
					value={priority.key}
				>
					<div className='flex items-center gap-2'>
						<Flag
							size={16}
							className={priority.color}
						/>
						{priority.label}
					</div>
				</SelectItem>
			))}
		</Select>
	)
}
