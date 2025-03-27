import {
	KeyboardSensor,
	MouseSensor,
	TouchSensor,
	useSensor,
	useSensors
} from '@dnd-kit/core'
import { useMutation } from '@tanstack/react-query'
import { useCallback, useRef, useState } from 'react'

import { groupService } from '../services/groups'
import { projectService } from '../services/projects'
import { lexorank } from '../utils/calculateLexorank'

import { useProjectElements } from './contexts/useProjectElements'

export const useDragAndDrop = () => {
	const [activeId, setActiveId] = useState(null)
	const [activeData, setActiveData] = useState([])
	const { groups, tasks, setGroups, setTasks } = useProjectElements()
	const isDragging = useRef(false)
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

	const moveGroup = useCallback(
		(activeIndex, overIndex) => {
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
					// // console.log(121212, result.orderPosition)
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

			setGroups(
				futureGroups.sort((a, b) =>
					a.orderPosition.localeCompare(b.orderPosition)
				)
			)
		},
		[groups, setGroups, updateGroupPosition]
	)

	const moveTask = useCallback(
		(activeIndex, overIndex, taskId, oldGroupId, newGroupId, data) => {
			const newGroupTasks = [...tasks[newGroupId]]

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

			const newPos = lexorank(
				prevNeighbor?.orderPosition || null,
				nextNeighbor?.orderPosition || null
			)

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
			// 	// // console.log(121212, result.orderPosition)
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
			// console.log('Обновленные задачи после изменения позиции:', updatedTasks)

			const sortedTasks = [...updatedTasks].sort((a, b) =>
				a.orderPosition.localeCompare(b.orderPosition)
			)
			// console.log('Отсортированные задачи:', sortedTasks)

			const updatedGroups = {
				...tasks,
				[newGroupId]: sortedTasks
			}

			// console.log('Обновленные группы перед сортировкой:', updatedGroups)

			const sortedGroups = Object.fromEntries(
				Object.entries(updatedGroups).map(([groupId, groupTasks]) => [
					groupId,
					[...groupTasks].sort((a, b) =>
						a.orderPosition.localeCompare(b.orderPosition)
					)
				])
			)

			// console.log('Отсортированные группы:', sortedGroups)

			setTasks(sortedGroups)
		},
		[setTasks, tasks, updateTaskPosition]
	)

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

	const handleDragOver = useCallback(
		event => {
			if (isDragging.current) return

			const { active, over } = event
			if (!active || !over || active.id === over.id) return
			if (active.id.startsWith('group-')) return

			let newGroupId
			if (over.id.startsWith('group-')) {
				if (active.data.current?.kanbanGroupId !== over.data.current?.id) {
					newGroupId = over.data.current?.id
				}
			} else {
				if (
					active.data.current?.kanbanGroupId !==
					over.data.current?.kanbanGroupId
				) {
					newGroupId = over.data.current?.kanbanGroupId
				}
			}

			if (!newGroupId) return

			isDragging.current = true
			const taskId = active.data.current?.id
			const oldGroupId = active.data.current?.kanbanGroupId

			setTasks(prev => {
				const updatedTasks = { ...prev }
				const movingTask = prev[oldGroupId]?.find(task => task.id === taskId)

				if (!movingTask) return prev

				const updatedTask = {
					...movingTask,
					kanbanGroupId: newGroupId,
					excludeFromCount: true
				}

				return {
					...updatedTasks,
					[oldGroupId]: updatedTasks[oldGroupId].filter(t => t.id !== taskId),
					[newGroupId]: [...(updatedTasks[newGroupId] || []), updatedTask].sort(
						(a, b) => a.orderPosition.localeCompare(b.orderPosition)
					)
				}
			})

			setTimeout(() => (isDragging.current = false), 100)
		},
		[setTasks]
	)
	const handleDragStart = useCallback(event => {
		const { active } = event
		setActiveData(active.data.current)
		setActiveId(active.id)
	}, [])

	const handleDragEnd = useCallback(
		event => {
			isDragging.current = false
			setActiveId(null)
			setActiveData(null)

			const { active, over } = event
			if (!active || !over) return

			if (active.id.startsWith('group-')) {
				const activeIndex = active.data.current.sortable.index
				const overIndex = over.data.current.sortable.index
				if (activeIndex !== overIndex) moveGroup(activeIndex, overIndex)
			}

			if (active.id.startsWith('task-')) {
				const activeIndex = active.data.current.sortable.index
				const overIndex = over.data.current.sortable.index
				const taskId = active.data.current.id
				const oldGroupId = activeData.kanbanGroupId
				const newGroupId = active.data.current.kanbanGroupId

				if (activeIndex !== overIndex || oldGroupId !== newGroupId) {
					moveTask(
						activeIndex,
						overIndex,
						taskId,
						oldGroupId,
						newGroupId,
						activeData
					)
				}
			}
		},
		[activeData, moveGroup, moveTask]
	)

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
