import { useEffect, useState } from 'react'

import { ProjectContext } from '../contexts/projectContext'

export const ProjectProvider = ({
	children,
	initialGroups = [],
	initialTasks = {}
}) => {
	const [groups, setGroups] = useState([])
	const [tasks, setTasks] = useState({})

	useEffect(() => {
		if (initialGroups && initialGroups.length > 0) {
			const sortedGroups = [...initialGroups].sort((a, b) =>
				a.orderPosition.localeCompare(b.orderPosition)
			)
			setGroups(sortedGroups)
		} else {
			setGroups([])
		}
	}, [initialGroups])

	useEffect(() => {
		if (initialTasks && Object.keys(initialTasks).length > 0) {
			const sortedTasks = Object.fromEntries(
				Object.entries(initialTasks).map(([groupId, groupTasks]) => [
					groupId,
					[...groupTasks].sort((a, b) =>
						a.orderPosition.localeCompare(b.orderPosition)
					)
				])
			)
			setTasks(sortedTasks)
		} else {
			setTasks({})
		}
	}, [initialTasks])

	const addGroup = newGroup => {
		setGroups(prev => [...prev, newGroup])
	}

	const updateGroup = (groupId, updatedFields) => {
		setGroups(prev =>
			prev.map(group =>
				group.id === groupId ? { ...group, ...updatedFields } : group
			)
		)
	}

	const removeGroup = groupId => {
		setGroups(prev => prev.filter(group => group.id !== groupId))
		setTasks(prev => {
			const newTasks = { ...prev }
			delete newTasks[groupId]
			return newTasks
		})
	}

	const addTask = (groupId, newTask) => {
		setTasks(prev => ({
			...prev,
			[groupId]: [...(prev[groupId] || []), newTask]
		}))
	}

	const updateTask = (groupId, taskId, updatedFields) => {
		setTasks(prev => ({
			...prev,
			[groupId]: prev[groupId].map(task =>
				task.id === taskId ? { ...task, ...updatedFields } : task
			)
		}))
	}

	const removeTask = (groupId, taskId) => {
		setTasks(prev => ({
			...prev,
			[groupId]: prev[groupId].filter(task => task.id !== taskId)
		}))
	}

	return (
		<ProjectContext.Provider
			value={{
				groups,
				tasks,

				addGroup,
				updateGroup,
				removeGroup,

				addTask,
				updateTask,
				removeTask,

				setGroups,
				setTasks
			}}
		>
			{children}
		</ProjectContext.Provider>
	)
}
