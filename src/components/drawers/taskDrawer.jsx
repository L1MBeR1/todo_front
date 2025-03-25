import { Button } from '@heroui/react'
import { X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { TaskName } from '../drawersComponents/drawerTaskTitle'

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

	console.log(drawerContent)
	return (
		<aside
			ref={drawerRef}
			className={`z-50 fixed top-0 right-0 h-full bg-background border-l-1 w-96 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
		>
			<div className='w-full h-full p-8'>
				<div className='flex flex-col h-full w-full justify-between'>
					<div className='flex flex-col'>
						<div>
							<header className='flex flex-row justify-between'>
								<TaskName name={drawerContent?.title} />
								<Button
									radius='sm'
									isIconOnly
									variant='light'
								>
									<X size={20} />
								</Button>
							</header>
						</div>
						<div></div>
					</div>
					<div className='flex flex-row'>
						<Button></Button>
						<Button></Button>
					</div>
				</div>
			</div>
		</aside>
	)
}
