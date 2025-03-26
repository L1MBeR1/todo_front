import {
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { useMutation } from '@tanstack/react-query'
import { useState } from 'react'

import { groupService } from '../services/groups'
import { projectService } from '../services/projects'
import { lexorank } from '../utils/calculateLexorank'

import { useProjectElements } from './contexts/useProjectElements'

export const useDragAndDrop = () => {
	const [activeId, setActiveId] = useState(null)
	const [activeData, setActiveData] = useState([])
	const { groups, tasks, setGroups, setTasks } = useProjectElements()
	const updateGroupPosition = useMutation({
		mutationKey: ['update-group-position'],
		mutationFn: async ({ id, projectId, data }) => {
			return projectService.updateGroup(id, projectId, data)
		}
	})

	const updateTaskPosition = useMutation({
		mutationKey: ['update-task-position'],
		mutationFn: async ({ id, groupId, data }) => {
			return groupService.updateTask(id, groupId, data)
		}
	})

	const moveGroup = (activeIndex, overIndex) => {
		const futureGroups = [...groups]
		const thisGroup = futureGroups[activeIndex]
		const prevPosition = thisGroup.orderPosition
		let prevNeighbor
		let nextNeighbor
		if (activeIndex < overIndex) {
			prevNeighbor = futureGroups[overIndex] || null
			nextNeighbor = futureGroups[overIndex + 1] || null
		}

		if (activeIndex > overIndex) {
			prevNeighbor = futureGroups[overIndex - 1] || null
			nextNeighbor = futureGroups[overIndex] || null
		}

		if (nextNeighbor === null) prevNeighbor = futureGroups[overIndex] || null

		if (prevNeighbor === null) nextNeighbor = futureGroups[overIndex] || null

		const newPos = lexorank(
			prevNeighbor?.orderPosition || null,
			nextNeighbor?.orderPosition || null
		)

		thisGroup.orderPosition = newPos

		updateGroupPosition
			.mutateAsync({
				id: thisGroup.id,
				projectId: thisGroup.projectId,
				data: {
					prevId: prevNeighbor?.id || null,
					nextId: nextNeighbor?.id || null
				}
			})
			.then(result => {
				// console.log(121212, result.orderPosition)
				thisGroup.orderPosition = result.orderPosition
			})
			.catch(() => {
				thisGroup.orderPosition = prevPosition
			})
			.finally(() => {
				setGroups(
					futureGroups.sort((a, b) =>
						a.orderPosition.localeCompare(b.orderPosition)
					)
				)
				return
			})

		console.log('Текущий  элемент:', thisGroup)
		console.log('Текущий индекс:', activeIndex)
		console.log('Новый индекс:', overIndex)
		console.log('Предыдущий сосед:', prevNeighbor)
		console.log('Следующий сосед:', nextNeighbor)
		console.log('Новая позиция:', newPos)

		setGroups(
			futureGroups.sort((a, b) =>
				a.orderPosition.localeCompare(b.orderPosition)
			)
		)
	}

	const moveTask = (
		activeIndex,
		overIndex,
		taskId,
		oldGroupId,
		newGroupId,
		data
	) => {
		console.log(activeIndex, overIndex, taskId, oldGroupId, newGroupId)

		const newGroupTasks = [...tasks[newGroupId]]
		console.log('Задачи для новой колонки:', newGroupTasks)

		const taskToMove = newGroupTasks.find(task => task.id === taskId)
		console.log('Задача, которую нужно переместить:', taskToMove)

		let prevNeighbor
		let nextNeighbor

		if (activeIndex === 0 && overIndex === 0) {
			prevNeighbor = null
			nextNeighbor = null
		} else {
			if (activeIndex < overIndex) {
				prevNeighbor = newGroupTasks[overIndex] || null
				nextNeighbor = newGroupTasks[overIndex + 1] || null
			}

			if (activeIndex > overIndex) {
				prevNeighbor = newGroupTasks[overIndex - 1] || null
				nextNeighbor = newGroupTasks[overIndex] || null
			}
		}

		if (nextNeighbor === null) prevNeighbor = newGroupTasks[overIndex] || null
		if (prevNeighbor === null) nextNeighbor = newGroupTasks[overIndex] || null

		console.log('Предыдущий сосед:', prevNeighbor)
		console.log('Следующий сосед:', nextNeighbor)

		const newPos = lexorank(
			prevNeighbor?.orderPosition || null,
			nextNeighbor?.orderPosition || null
		)
		console.log('Новая позиция:', newPos)

		updateTaskPosition.mutateAsync({
			id: data.id,
			groupId: oldGroupId,
			data: {
				title: data.title,
				kanbanGroupId: newGroupId,
				prevId: prevNeighbor?.id || null,
				nextId: nextNeighbor?.id || null
			}
		})
		// .then(result => {
		// 	// console.log(121212, result.orderPosition)
		// 	thisGroup.orderPosition = result.orderPosition
		// })
		// .catch(() => {
		// 	thisGroup.orderPosition = prevPosition
		// })
		// .finally(() => {
		// 	setInitialGroups(
		// 		futureGroups.sort((a, b) =>
		// 			a.orderPosition.localeCompare(b.orderPosition)
		// 		)
		// 	)
		// 	return
		// })

		const updatedTasks = newGroupTasks.map(task => {
			if (task.id === taskId) {
				return {
					...task,
					orderPosition: newPos,
					excludeFromCount: false
				}
			}
			return task
		})
		console.log('Обновленные задачи после изменения позиции:', updatedTasks)

		const sortedTasks = [...updatedTasks].sort((a, b) =>
			a.orderPosition.localeCompare(b.orderPosition)
		)
		console.log('Отсортированные задачи:', sortedTasks)

		const updatedGroups = {
			...tasks,
			[newGroupId]: sortedTasks
		}

		console.log('Обновленные группы перед сортировкой:', updatedGroups)

		const sortedGroups = Object.fromEntries(
			Object.entries(updatedGroups).map(([groupId, groupTasks]) => [
				groupId,
				[...groupTasks].sort((a, b) =>
					a.orderPosition.localeCompare(b.orderPosition)
				)
			])
		)

		console.log('Отсортированные группы:', sortedGroups)

		setTasks(sortedGroups)
	}

	const sensors = useSensors(
		useSensor(MouseSensor, {
			activationConstraint: {
				delay: 80,
				tolerance: 100
			}
		}),
		useSensor(TouchSensor, {
			activationConstraint: {
				delay: 100,
				tolerance: 5
			}
		}),
		useSensor(KeyboardSensor)
	)

	const handleDragStart = event => {
		const { active } = event
		console.log(event)
		setActiveData(active.data.current)
		setActiveId(active.id)
	}

	const handleDragOver = event => {
		const { active, over } = event
		if (active.id.startsWith('group-')) return

		if (!active || !over || active.id == over.id) return

		console.log(active, over)
		let newGroupId
		if (
			over.id.startsWith('group-') &&
			active.data.current.kanbanGroupId !== over.data.current.id
		) {
			newGroupId = over.data.current.id
		}
		if (
			!over.id.startsWith('group-') &&
			active.data.current.kanbanGroupId !== over.data.current.kanbanGroupId
		) {
			newGroupId = over.data.current.kanbanGroupId
		}
		console.log(newGroupId)
		if (!newGroupId) return

		const taskId = active.data.current.id
		const oldGroupId = active.data.current.kanbanGroupId
		// console.log(taskId, oldGroupId)

		setTasks(prev => {
			const updatedTasks = { ...prev }

			const movingTask = updatedTasks[oldGroupId]?.find(
				task => task.id === Number(taskId)
			)

			if (!movingTask) return prev

			updatedTasks[oldGroupId] = updatedTasks[oldGroupId].filter(
				task => task.id !== Number(taskId)
			)

			active.data.current.newGroupId = newGroupId
			movingTask.kanbanGroupId = newGroupId
			movingTask.excludeFromCount = true

			updatedTasks[newGroupId] = [
				...(updatedTasks[newGroupId] || []),
				movingTask
			].sort((a, b) => a.orderPosition.localeCompare(b.orderPosition))

			return updatedTasks
		})

		// if (!over.id.startsWith('group-')) return

		// console.log(
		// 	'Перетаскивание группой:',
		// 	active.data.current.sortable.index,
		// 	'→',
		// 	over.data.current.sortable.index
		// )
	}

	const handleDragEnd = event => {
		console.log(activeData)
		setActiveId(null)
		setActiveData(null)
		const { active, over } = event
		// console.log('active', active)
		// console.log('over', over)
		if (!active || !over) return

		if (active.id.startsWith('group-')) {
			// console.log(groups)
			// console.log(over.data.current.sortable.index)
			const activeIndex = active.data.current.sortable.index

			const overIndex = over.data.current.sortable.index

			if (activeIndex === -1 || overIndex === -1 || activeIndex === overIndex)
				return

			moveGroup(activeIndex, overIndex)
		}
		if (active.id.startsWith('task-')) {
			// console.log('taska')
			// console.log(over.data.current.sortable.index)
			const activeIndex = active.data.current.sortable.index
			console.log('taska')
			const taskId = active.data.current.id
			const oldGroupId = activeData.kanbanGroupId
			const newGroupId = active.data.current.kanbanGroupId

			const overIndex = over.data.current.sortable.index

			if (activeIndex === -1 || overIndex === -1) return

			if (activeIndex === overIndex && oldGroupId === newGroupId) return

			moveTask(
				activeIndex,
				overIndex,
				taskId,
				oldGroupId,
				newGroupId,
				activeData
			)
		}

		// if (active.id.startsWith('group-') && over.id.startsWith('task-')) {
		// 	console.log('Колонка сброшена на задачу — отменяем действие')
		// 	return
		// }
		// if (active.id.startsWith('task-') && over.id.startsWith('group-')) {
		// 	console.log('Задача сброшена на колонку')
		// 	return
		// }

		// console.log(`Элемент ${active.id} перемещён на ${over.id}`)
	}

	return {
		sensors,
		activeId,
		activeData,
		setActiveId,
		handleDragStart,
		handleDragOver,
		handleDragEnd
	}
}
