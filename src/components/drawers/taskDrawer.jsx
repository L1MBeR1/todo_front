import { Button, useDisclosure } from '@heroui/react'
import { Trash, X } from 'lucide-react'
import { useEffect, useRef } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'
import { CompleteButton } from '../drawersComponents/completeButton'
import { DrawerColorPicker } from '../drawersComponents/drawerColorPicker'
import { DrawerDatePicker } from '../drawersComponents/drawerDatePicker'
import { DrawerPriorityPicker } from '../drawersComponents/drawerPriorityPicker'
import { DrawerTaskDescription } from '../drawersComponents/drawerTaskDescription'
import { DrawerTaskName } from '../drawersComponents/drawerTaskTitle'
import { DeleteTaskModal } from '../modals/tasks/deleteTaskModal'

export const TaskDrawer = ({ projectId }) => {
	const { isDrawerOpen, closeDrawer, drawerContent } = useDrawer()
	const drawerRef = useRef(null)
	useEffect(() => {
		const handleClickOutside = event => {
			if (
				event.button === 0 &&
				isDrawerOpen &&
				drawerRef.current &&
				!drawerRef.current.contains(event.target) &&
				!event.target.closest('.task') &&
				!event.target.closest('.drawerElement')
			) {
				closeDrawer()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDrawerOpen, closeDrawer])

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	// console.log(drawerContent)
	return (
		<>
			<DeleteTaskModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
				data={drawerContent}
			/>
			<aside
				ref={drawerRef}
				className={`z-50 fixed top-0 right-0 h-full bg-background border-l-1 w-96 transition-transform duration-300 ease-in-out ${isDrawerOpen ? 'translate-x-0' : 'translate-x-full'}`}
			>
				<div className='w-full h-full p-8'>
					<div className='flex flex-col h-full w-full justify-between'>
						<div className='flex flex-col gap-3'>
							<div>
								<header className='flex flex-row justify-between gap-2'>
									<DrawerTaskName name={drawerContent?.title} />
									<Button
										radius='sm'
										isIconOnly
										variant='light'
										onPress={() => {
											closeDrawer()
										}}
									>
										<X size={20} />
									</Button>
								</header>
								<DrawerTaskDescription
									description={drawerContent?.description}
								/>
							</div>
							<div className='flex flex-col gap-2'>
								<div className='flex flex-row items-center'>
									<p className='text-sm font-semibold w-2/5'>Дата</p>
									<div className='w-3/5'>
										<DrawerDatePicker selectedDate={drawerContent?.dueDate} />
									</div>
								</div>
								<div className='flex flex-row items-center'>
									<p className='text-sm font-semibold w-2/5'>Приоритет</p>
									<div className='w-3/5'>
										<DrawerPriorityPicker
											selectedPriority={drawerContent?.priority}
										/>
									</div>
								</div>
								<div className='flex flex-row items-center '>
									<p className='text-sm font-semibold w-2/5'>Цвет</p>
									<div className='w-3/5'>
										<DrawerColorPicker selectedColor={drawerContent?.colorId} />
									</div>
								</div>
							</div>
						</div>
						<div className='flex flex-row justify-between'>
							<CompleteButton projectId={projectId} />
							<Button
								color='danger'
								isIconOnly
								radius='sm'
								variant='flat'
								onPress={() => {
									onOpen()
								}}
							>
								<Trash />
							</Button>
						</div>
					</div>
				</div>
			</aside>
		</>
	)
}
