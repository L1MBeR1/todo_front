import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card, Checkbox } from '@heroui/react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'

import { TaskDate } from './taskDate'

export const ListTaskCard = ({ data }) => {
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
				className={`p-[10px] h-12 ${isSelected && 'outline-slate-600'} `}
				shadow='sm'
				radius='sm'
			>
				<div className='flex flex-row'>
					<Checkbox radius='sm' />
					<div className='flex flex-row gap-1.5'>
						{data.dueDate && <TaskDate date={data.dueDate} />}
						<p>{data.title}</p>
					</div>
				</div>
			</Card>
		</div>
	)
}
