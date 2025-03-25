import {
	BreadcrumbItem,
	Breadcrumbs,
	Button,
	CircularProgress
} from '@heroui/react'
import { EllipsisVertical, Kanban, LayoutList } from 'lucide-react'
import { useState } from 'react'

import { useDrawer } from '../../../hooks/contexts/useDrawer'
import useProjectGroups from '../../../hooks/projects/useProjectGroups'
import useProjectTasks from '../../../hooks/projects/useProjectTasks'
import { ProjectProvider } from '../../../providers/projectProvider'
import { TaskDrawer } from '../../drawers/taskDrawer'
import { ProjectPopover } from '../../popovers/projectPopover'

import { ProjectKanbanSection } from './projectKanbanSection'
import { ProjectListSection } from './projectListSection'

export const ProjectMainSection = ({ projectData, projectId }) => {
	const { data: groups, isLoading } = useProjectGroups(projectId)
	const [isKanban, setIsKanban] = useState(true)
	const { data: tasks, isLoading: isTaskLoading } = useProjectTasks(projectId)

	const { data: tasksCompleted } = useProjectTasks(projectId, true)
	const { isDrawerOpen } = useDrawer()
	return (
		<>
			<main
				className={`flex flex-col w-full h-screen overflow-hidden transition-all duration-300 relative p-8 pb-0 gap-6 ${isDrawerOpen && 'pr-[416px]'}`}
			>
				<div className='flex flex-row'>
					<Breadcrumbs className='font-semibold pointer-events-none'>
						<BreadcrumbItem>Мои проекты</BreadcrumbItem>
						<BreadcrumbItem>
							<p className='max-w-52 truncate'>{projectData?.name}</p>
						</BreadcrumbItem>
					</Breadcrumbs>
				</div>
				<div className='w-full flex flex-row justify-between'>
					<div className='flex flex-row gap-4 items-center'>
						<p className='font-medium text-4xl max-w-[700px] truncate leading-tight'>
							{projectData?.name}
						</p>
						<ProjectPopover data={projectData}>
							<Button
								isIconOnly
								radius='sm'
								variant='light'
							>
								<EllipsisVertical size={20} />
							</Button>
						</ProjectPopover>
					</div>
					<div className='flex flex-row gap-3'>
						<Button
							className='font-semibold'
							variant='light'
							radius='sm'
						>
							Сегодня выполнено
						</Button>
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
				</div>
				{isLoading && isTaskLoading ? (
					<div className='w-full h-full flex items-center justify-center'>
						<CircularProgress />
					</div>
				) : (
					<ProjectProvider>
						{isKanban ? (
							<ProjectKanbanSection
								groups={groups}
								tasks={tasks}
								projectId={projectId}
							/>
						) : (
							<ProjectListSection
								groups={groups}
								tasks={tasks}
								projectId={projectId}
							/>
						)}
					</ProjectProvider>
				)}
			</main>

			<TaskDrawer />
		</>
	)
}
