import { useDroppable } from '@dnd-kit/core'
import {
	SortableContext,
	rectSortingStrategy,
	useSortable
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@heroui/react'
import { EllipsisVertical } from 'lucide-react'

import { GroupPopover } from '../popovers/groupPopover'

import { CreateTaskButton } from './createTaskButton'
import { GroupName } from './groupName'
import { ListTaskCard } from './listTaskCard'

export const ListGroup = ({ data, projectId, activeId, tasks }) => {
	const { setNodeRef } = useDroppable({
		id: `group-${data.id}`,
		data: {
			id: data.id
		}
	})
	const {
		attributes,
		listeners,
		setNodeRef: setGroupRef,
		transform,
		active
	} = useSortable({
		id: `group-${data.id}`,
		data
	})
	const style = {
		transform: CSS.Transform.toString(transform),
		transition: transform ? 'transform 0.38s ' : 'none',
		opacity: active?.id.replace('group-', '') == data.id ? '0' : '1'
	}

	return (
		<div
			ref={setGroupRef}
			style={style}
			className={`flex flex-col  w-full min-w-80 border-1 rounded-lg h-fit max-h-full group bg-slate-50 group `}
		>
			<header
				{...listeners}
				{...attributes}
				className='flex flex-col gap-0.5 px-5 py-4 max-h-fit'
			>
				<div className='flex flex-row justify-between'>
					<GroupName
						name={data.name}
						projectId={projectId}
						id={data.id}
						isList
					/>
					<GroupPopover
						projectId={projectId}
						data={data}
					>
						<Button
							radius='sm'
							isIconOnly={true}
							size='sm'
							variant='light'
						>
							<EllipsisVertical size={'19'} />
						</Button>
					</GroupPopover>
				</div>

				<div className='text-sm'>
					{tasks?.filter(task => !task.excludeFromCount).length > 0 && (
						<p>Задач: {tasks.filter(task => !task.excludeFromCount).length}</p>
					)}
				</div>
			</header>
			<div
				ref={setNodeRef}
				className='flex flex-col grow gap-3 px-4 overflow-x-hidden overflow-y-auto py-1 min-h-10'
			>
				{tasks && (
					<SortableContext
						items={tasks.map(task => `task-${task.id}`)}
						strategy={rectSortingStrategy}
						disabled={activeId ? activeId.startsWith('group-') : false}
					>
						{tasks.map(task => (
							<ListTaskCard
								projectId={projectId}
								key={task.id}
								data={task}
							/>
						))}
					</SortableContext>
				)}
			</div>
			<div className='w-full opacity-0 group-hover:opacity-100'>
				<CreateTaskButton groupId={data.id} />
			</div>
		</div>
	)
}
