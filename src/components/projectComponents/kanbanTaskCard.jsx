import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@heroui/react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'

import { PriorityChip } from './priorityChip'
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

	const { attributes, listeners, setNodeRef, transform, active } = useSortable({
		id: `task-${data.id}`,
		data
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transform ? 'transform 0.38s ' : 'none',
		opacity: active?.id.replace('task-', '') == data.id ? '0' : '1'
	}
	return (
		<div
			ref={setNodeRef}
			style={style}
			{...listeners}
			{...attributes}
			className='task'
			onClick={handleCardClick}
		>
			<Card
				className={`p-4 min-h-28 ${isSelected && 'outline-slate-600'} `}
				style={{
					backgroundColor: data.colorHashCode && `#${data.colorHashCode}`
				}}
				shadow='sm'
				radius='sm'
			>
				<div className='flex flex-col justify-between grow'>
					<div className='flex flex-col gap-1.5'>
						{data.dueDate && <TaskDate date={data.dueDate} />}
						<p className='break-words'>{data.title}</p>
					</div>
					<div className='flex justify-end'>
						<PriorityChip priority={data.priority} />
					</div>
				</div>
			</Card>
		</div>
	)
}
