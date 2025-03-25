import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable'
import { Button } from '@heroui/react'
import { EllipsisVertical } from 'lucide-react'

import { GroupPopover } from '../popovers/groupPopover'

import { CreateTaskButton } from './createTaskButton'
import { GroupName } from './groupName'
import { KanbanTaskCard } from './kanbanTaskCard'

export const GroupDragOverlay = ({ data }) => {
	return (
		<div
			className={`flex flex-col max-w-80 w-full min-w-80 border-1 rounded-lg h-fit gap-5 max-h-full group bg-slate-50`}
		>
			<header className='flex flex-col gap-0.5 px-5 py-4 max-h-fit'>
				<div className='flex flex-row justify-between'>
					<GroupName
						name={data.name}
						projectId={projectId}
						id={data.id}
					/>
					<GroupPopover
						id={data.id}
						projectId={projectId}
						name={data.name}
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
					<p>Задач: {tasks?.length}</p>
				</div>
			</header>
			<div className='flex flex-col grow gap-3 px-4 overflow-x-hidden overflow-y-auto py-1 min-h-10'>
				<SortableContext
					items={tasks && tasks.map(task => `task-${task.id}`)}
					strategy={rectSortingStrategy}
					disabled
				>
					{tasks &&
						tasks.map(task => (
							<KanbanTaskCard
								key={task.id}
								data={task}
							/>
						))}
				</SortableContext>
			</div>
			<CreateTaskButton groupId={data.id} />
		</div>
	)
}
