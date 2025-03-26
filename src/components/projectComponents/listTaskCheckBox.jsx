import { VisuallyHidden, addToast, tv, useCheckbox } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const SimpleCheckbox = ({
	isCompleted: initialCompleted,
	size = 'md',
	color = 'primary',
	projectId
}) => {
	const [localCompleted, setLocalCompleted] = useState(initialCompleted)
	const { removeTask } = useProjectElements()

	const { drawerContent, setDrawerContent } = useDrawer()

	const queryClient = useQueryClient()

	useEffect(() => {
		setLocalCompleted(initialCompleted)
	}, [initialCompleted])

	const { isSelected, getBaseProps, getInputProps } = useCheckbox({
		isSelected: localCompleted,
		onChange: setLocalCompleted
	})

	const checkbox = tv({
		slots: {
			base: `border-slate-600 hover:bg-default-100 flex items-center justify-center rounded-md border-2 transition-colors`
		},
		variants: {
			isSelected: {
				true: {
					base: `border-${color} bg-${color} hover:bg-${color}-500 hover:border-${color}-500`
				}
			},
			size: {
				sm: 'h-5 w-5',
				md: 'h-6 w-6',
				lg: 'h-7 w-7'
			}
		}
	})

	const styles = checkbox({ isSelected, size })

	const toggleTaskCompletion = useMutation({
		mutationKey: ['toggle-task-completion'],
		mutationFn: () =>
			groupService.updateTask(drawerContent.id, drawerContent.kanbanGroupId, {
				title: drawerContent.title,
				completed: true
			}),
		onSuccess(data) {
			removeTask(data.kanbanGroupId, data.id)
			setDrawerContent(prev => ({
				...prev,
				completed: true
			}))
			queryClient.invalidateQueries({
				queryKey: [`project/${projectId}/tasks`]
			})
		},
		onError() {
			setLocalCompleted(initialCompleted)
			addToast({
				title: 'Ошибка при обновлении задачи',
				color: 'danger'
			})
		}
	})

	const handleChange = isChecked => {
		setLocalCompleted(isChecked)

		toggleTaskCompletion.mutate(isChecked)
	}

	return (
		<label
			{...getBaseProps()}
			className='inline-flex cursor-pointer'
		>
			<VisuallyHidden>
				<input
					{...getInputProps()}
					onChange={e => handleChange(e.target.checked)}
				/>
			</VisuallyHidden>
			<div className={styles.base()}>
				{isSelected && (
					<Check
						className={`text-${color}-foreground ${
							size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'
						}`}
					/>
				)}
			</div>
		</label>
	)
}
