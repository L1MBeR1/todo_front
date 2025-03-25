import {
	Button,
	CircularProgress,
	Image,
	Tab,
	Tabs,
	useDisclosure
} from '@heroui/react'
import { CircleHelp, SquareChartGantt } from 'lucide-react'
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
			<aside className='flex flex-col bg-background2 h-full max-w-80 w-full justify-between p-8 '>
				<div className='flex flex-col gap-8'>
					<Image
						className='w-4/6'
						src='/logoFullWhite.svg'
						alt='logo'
					/>
					<div className='flex flex-col gap-6'>
						<Tabs
							fullWidth
							selectedKey={pathname}
							aria-label='Projects'
							isVertical={true}
							color='primary'
							classNames={{
								tabList: 'bg-transparent p-0 rounded-md py-1.5 gap-3',
								tab: 'justify-start px-4 py-1.5 bg-default-800',
								tabContent: 'text-white text-md font-semibold'
							}}
						>
							<Tab
								radius='sm'
								key='/home'
								href={APP_PAGES.WORKSPACE.HOME}
								title='Главная'
							/>
						</Tabs>
						<section className='flex flex-col gap-2'>
							<p className='text-tiny font-semibold text-gray-300'>
								Мои проекты
							</p>

							{isLoading ? (
								<CircularProgress />
							) : (
								<>
									<Tabs
										selectedKey={pathname}
										aria-label='Projects'
										fullWidth
										isVertical={true}
										color='primary'
										classNames={{
											tabList: 'bg-transparent p-0 rounded-md py-1.5 gap-3',
											tab: 'justify-start px-2 py-1.5',
											tabContent: 'text-white'
										}}
									>
										{data?.map(project => (
											<Tab
												key={`${APP_PAGES.WORKSPACE.PROJECT}/${project.id}`}
												href={`${APP_PAGES.WORKSPACE.PROJECT}/${project.id}`}
												title={
													<div className='flex flex-row gap-2 items-center'>
														<SquareChartGantt />
														<p className='truncate text-sm font-normal max-w-44'>
															{project.name}
														</p>
													</div>
												}
											/>
										))}
									</Tabs>

									{data?.length < 5 ? (
										<Button
											size='sm'
											onPress={onOpen}
											color='primary'
											variant='light'
										>
											Создать проект
										</Button>
									) : (
										<p className='text-tiny font-semibold text-gray-300'>
											Вы достигли лимита по проектам
										</p>
									)}
								</>
							)}
						</section>
					</div>
				</div>
				<div className='flex flex-col gap-10'>
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
