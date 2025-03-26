import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Card } from '@heroui/react'
import { useEffect, useState } from 'react'

import { useDrawer } from '../../hooks/contexts/useDrawer'

import { SimpleCheckbox } from './listTaskCheckBox'
import { PriorityChipSmall } from './priorityChipSmall'
import { TaskDate } from './taskDate'

export const ListTaskCard = ({ data, projectId }) => {
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
				style={{
					backgroundColor: data.colorHashCode && `#${data.colorHashCode}`
				}}
			>
				<div className='flex flex-row justify-between h-full w-full'>
					<div className='flex flex-row gap-3 items-center max-w-[80%]'>
						<SimpleCheckbox projectId={projectId} />
						<p className='mb-0.5 max-w-full truncate'>{data.title}</p>
					</div>
					<div className='flex flex-row items-center gap-4'>
						<PriorityChipSmall priority={data.priority} />
						{data.dueDate && <TaskDate date={data.dueDate} />}
					</div>
				</div>
			</Card>
		</div>
	)
}
