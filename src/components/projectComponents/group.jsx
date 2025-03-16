import { Button } from '@heroui/react'
import { EllipsisVertical } from 'lucide-react'

import useGroupTasks from '../../hooks/projects/useGroupTasks'
import { GroupPopover } from '../popovers/groupPopover'

import { KanbanTaskCard } from './KanbanTaskCard'
import { CreateTaskButton } from './createTaskButton'
import { GroupName } from './groupName'

export const Group = ({ data, projectId }) => {
	const { data: tasks, isLoading, isError } = useGroupTasks(data.id)
	console.log(tasks)
	return (
		<div className='flex flex-col max-w-80 w-full min-w-80 py-4 border-1 rounded-lg h-fit gap-5 max-h-full z-10 group'>
			<header className='flex flex-col gap-0.5 px-5'>
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
			<div className='flex flex-col grow gap-3 px-4 overflow-x-hidden overflow-y-auto py-1'>
				{tasks &&
					tasks
						.slice()
						.sort((a, b) => a.orderPosition.localeCompare(b.orderPosition))
						.map(task => (
							<KanbanTaskCard
								key={task.id}
								data={task}
							/>
						))}
			</div>
			<CreateTaskButton groupId={data.id} />
		</div>
	)
}
