import { Button } from '@heroui/react'
import { Kanban, LayoutList } from 'lucide-react'
import { useState } from 'react'

import useProjectGroups from '../../../hooks/projects/useProjectGroups'
import { DrawerProvider } from '../../../providers/drawerProvider'
import { TaskDrawer } from '../../drawers/taskDrawer'

import { ProjectKanbanSection } from './projectKanbanSection'
import { ProjectListSection } from './projectListSection'

export const ProjectMainSection = ({ projectId }) => {
	const { data: groups, isLoading, isError } = useProjectGroups(projectId)
	// const { data: tasks } = useProjectTasks(projectId)
	const [isKanban, setIsKanban] = useState(false)

	return (
		<DrawerProvider>
			<main className='flex flex-col w-full h-screen overflow-hidden'>
				<div className='w-full p-8'>
					<div className='flex flex-row gap-3'>
						<Button
							radius='sm'
							isIconOnly={true}
							onPress={() => {
								setIsKanban(false)
							}}
							color={!isKanban ? 'primary' : 'default'}
						>
							<LayoutList />
						</Button>
						<Button
							radius='sm'
							isIconOnly={true}
							onPress={() => {
								setIsKanban(true)
							}}
							color={isKanban ? 'primary' : 'default'}
						>
							<Kanban />
						</Button>
					</div>
				</div>
				{isKanban ? (
					<ProjectKanbanSection
						groups={groups}
						// tasks={tasks}
						projectId={projectId}
					/>
				) : (
					<ProjectListSection
						groups={groups}
						// tasks={tasks}
					/>
				)}
			</main>
			<TaskDrawer />
		</DrawerProvider>
	)
}
