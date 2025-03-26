import { Button, addToast } from '@heroui/react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Check } from 'lucide-react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { useProjectElements } from '../../hooks/contexts/useProjectElements'
import { groupService } from '../../services/groups'

export const CompleteButton = ({ projectId }) => {
	const { removeTask, addTask } = useProjectElements()
	const { drawerContent, setDrawerContent } = useDrawer()
	const queryClient = useQueryClient()
	const completeMutation = useMutation({
		mutationKey: ['complete-task'],
		mutationFn: () =>
			groupService.updateTask(drawerContent.id, drawerContent.kanbanGroupId, {
				title: drawerContent.title,
				completed: true
			}),
		onSuccess(data) {
			// console.log(data)
			removeTask(data.kanbanGroupId, data.id)
			setDrawerContent(prev => ({
				...prev,
				completed: true
			}))
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/tasks/true`],
				type: 'active'
			})
		},
		onError() {
			addToast({ title: 'Ошибка при выполнении задачи', color: 'danger' })
		}
	})

	const unCompleteMutation = useMutation({
		mutationKey: ['unComplete-task'],
		mutationFn: () =>
			groupService.updateTask(drawerContent.id, drawerContent.kanbanGroupId, {
				title: drawerContent.title,
				completed: false
			}),
		onSuccess(data) {
			// console.log(data)
			addTask(data.kanbanGroupId, data)
			setDrawerContent(prev => ({
				...prev,
				completed: false
			}))
			queryClient.refetchQueries({
				queryKey: [`project/${projectId}/tasks/true`],
				type: 'active'
			})
		},
		onError() {
			addToast({
				title: 'Ошибка при изменении статуса задачи',
				color: 'danger'
			})
		}
	})

	const handlePress = () => {
		if (drawerContent && drawerContent?.completed) unCompleteMutation.mutate()
		else completeMutation.mutate()
	}
	return (
		<Button
			className='text-primary-foreground font-semibold'
			color='primary'
			radius='sm'
			variant={drawerContent && drawerContent?.completed ? 'solid' : 'ghost'}
			onPress={handlePress}
			startContent={
				drawerContent && drawerContent?.completed && <Check size={18} />
			}
		>
			{drawerContent && drawerContent?.completed ? 'Выполнено' : 'Выполнить'}
		</Button>
	)
}
