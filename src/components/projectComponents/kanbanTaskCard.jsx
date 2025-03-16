import { Card } from '@heroui/react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'

import { TaskDate } from './taskDate'

export const KanbanTaskCard = ({ data }) => {
	const { openDrawer, isDrawerOpen, changeTask, taskId } = useDrawer()
	const [isSelected, setIsSelected] = useState(false)
	const handleCardClick = () => {
		if (isDrawerOpen) {
			changeTask(data, data.id)
		} else {
			openDrawer(data, data.id)
		}
	}

	useEffect(() => {
		taskId === data.id ? setIsSelected(true) : setIsSelected(false)
	}, [taskId, data.id])
	return (
		<div
			className='task'
			onClick={handleCardClick}
		>
			<Card
				className={`p-4 min-h-36 ${isSelected && 'outline-slate-600'}`}
				radius='sm'
			>
				<div className='flex flex-col'>
					<div className='flex flex-col gap-1.5'>
						{data.dueDate && <TaskDate date={data.dueDate} />}
						<p>{data.title}</p>
					</div>
				</div>
			</Card>
		</div>
	)
}
