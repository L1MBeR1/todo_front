import { Button, Tab, Tabs, useDisclosure } from '@heroui/react'
import { CircleHelp } from 'lucide-react'
import { useLocation } from 'react-router-dom'

import { APP_PAGES } from '../../config/pageConfig'
import useMyProjects from '../../hooks/projects/useMyProjects'
import CreateProjectModal from '../modals/projects/createProjectModal'
import { SidebarProfile } from '../profile/sidebarProfile'

export const WorkSpaceSidebar = () => {
	const { data, isLoading } = useMyProjects()
	const { pathname } = useLocation()

	const { isOpen, onOpen, onOpenChange } = useDisclosure()

	return (
		<>
			<CreateProjectModal
				isOpen={isOpen}
				onOpenChange={onOpenChange}
			/>
			<aside className='flex flex-col bg-gray-700 h-full max-w-80 w-full justify-between p-8'>
				<div className='flex flex-col'>
					<p>Logo</p>
					<div className='flex flex-col'>
						<Tabs
							selectedKey={pathname}
							aria-label='Tabs'
							isVertical={true}
						>
							<Tab
								key='/home'
								href={APP_PAGES.WORKSPACE.HOME}
								title='Главная'
							/>
						</Tabs>
						<section className='flex flex-col gap-2'>
							<p>Мои проекты</p>
							{isLoading ? (
								<p>Загрузка...</p>
							) : data.length === 0 ? (
								<p>У вас пока нет проектов</p>
							) : (
								<Tabs
									selectedKey={pathname}
									aria-label='Projects'
									isVertical={true}
								>
									{data.map(project => (
										<Tab
											key={`${APP_PAGES.WORKSPACE.PROJECT}/${project.id}`}
											href={`${APP_PAGES.WORKSPACE.PROJECT}/${project.id}`}
											title={project.name}
										/>
									))}
								</Tabs>
							)}
							<Button
								size={'sm'}
								onPress={() => {
									onOpen()
								}}
							>
								Создать проект
							</Button>
						</section>
					</div>
				</div>
				<div className='flex flex-col gap-4'>
					<SidebarProfile />
					<div className='flex flex-row gap-3 text-secondary-foreground'>
						<CircleHelp />
						<p>Помощь и начало работы</p>
					</div>
				</div>
			</aside>
		</>
	)
}
