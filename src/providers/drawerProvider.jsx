import { useState } from 'react'

import { DrawerContext } from '../contexts/drawerContext'

export const DrawerProvider = ({ children }) => {
	const [isDrawerOpen, setIsDrawerOpen] = useState(false)
	const [drawerContent, setDrawerContent] = useState(null)
	const [taskId, setTaskId] = useState(null)

	const openDrawer = (data, id) => {
		setDrawerContent(data)
		setTaskId(id)
		setIsDrawerOpen(true)
	}

	const closeDrawer = () => {
		setIsDrawerOpen(false)
		setDrawerContent(null)
		setTaskId(null)
	}

	const changeTask = (data, id) => {
		setDrawerContent(data)
		setTaskId(id)
	}

	return (
		<DrawerContext.Provider
			value={{
				isDrawerOpen,
				drawerContent,
				setDrawerContent,
				taskId,
				openDrawer,
				closeDrawer,
				changeTask
			}}
		>
			{children}
		</DrawerContext.Provider>
	)
}
