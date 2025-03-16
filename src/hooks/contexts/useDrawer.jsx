import { useContext } from 'react'

import { DrawerContext } from '../../contexts/drawerProvider'

export const useDrawer = () => {
	const context = useContext(DrawerContext)
	if (!context) {
		throw new Error('useDrawer must be used within a DrawerProvider')
	}
	return context
}
