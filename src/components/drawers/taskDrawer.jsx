import { useEffect, useRef } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'

export const TaskDrawer = () => {
	const { isDrawerOpen, closeDrawer, drawerContent } = useDrawer()
	const drawerRef = useRef(null)
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				isDrawerOpen &&
				drawerRef.current &&
				!drawerRef.current.contains(event.target) &&
				!event.target.closest('.task')
			) {
				closeDrawer()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDrawerOpen, closeDrawer])
	return (
		<aside
			ref={drawerRef}
			className={`fixed top-0 right-0 h-full bg-background border-l-1 w-96 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			<div className='w-full h-full'>
				{/* Контент Drawer */}
				<button onClick={closeDrawer}>Close Drawer</button>
				{/* Отображение данных задачи */}
				{drawerContent && (
					<div>
						<h3>{drawerContent.title}</h3>
					</div>
				)}
			</div>
		</aside>
	)
}
